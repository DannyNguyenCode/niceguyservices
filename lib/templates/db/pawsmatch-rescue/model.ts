import "server-only";

import { ObjectId } from "mongodb";
import { getTemplateCollection } from "../collections";
import { PmrAdoptionError } from "./errors";
import type {
  PmrAdoptionApplicationDocument,
  PmrAdoptionApplicationDTO,
  PmrAdoptionApplicationAdminDTO,
  PmrAdoptionApplicationForm,
  PmrApplicationStatus,
  PmrSubmitAdoptionApplicationInput,
} from "./types";

export const PMR_ADOPTION_APPLICATIONS_COLLECTION = "pmr_adoption_applications";

function toDto(doc: PmrAdoptionApplicationDocument): PmrAdoptionApplicationDTO {
  return {
    id: doc._id!.toHexString(),
    petId: doc.petId,
    status: doc.status,
    form: doc.form,
    submittedAt: doc.submittedAt?.toISOString() ?? null,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

async function applicationsCollection() {
  return getTemplateCollection<PmrAdoptionApplicationDocument>(
    PMR_ADOPTION_APPLICATIONS_COLLECTION,
  );
}

export async function listPmrAdoptionApplicationsByUser(
  userEmail: string,
): Promise<PmrAdoptionApplicationDTO[]> {
  const collection = await applicationsCollection();
  const docs = await collection
    .find({ userEmail: userEmail.trim().toLowerCase() })
    .sort({ updatedAt: -1 })
    .toArray();
  return docs.map(toDto);
}

export async function getPmrAdoptionApplicationForUserPet(
  userEmail: string,
  petId: string,
): Promise<PmrAdoptionApplicationDTO | null> {
  const collection = await applicationsCollection();
  const doc = await collection.findOne({
    userEmail: userEmail.trim().toLowerCase(),
    petId,
  });
  return doc ? toDto(doc) : null;
}

export async function submitPmrAdoptionApplication(
  userEmail: string,
  input: PmrSubmitAdoptionApplicationInput,
): Promise<PmrAdoptionApplicationDTO> {
  const email = userEmail.trim().toLowerCase();
  const collection = await applicationsCollection();
  const now = new Date();

  const existing = await collection.findOne({ userEmail: email, petId: input.petId });
  if (existing) {
    if (existing.status === "under_review" || existing.status === "approved") {
      throw new PmrAdoptionError(
        "You already have an active application for this pet.",
        "APPLICATION_EXISTS",
        409,
      );
    }
    if (existing.status === "pet_unavailable") {
      throw new PmrAdoptionError(
        "This pet has been approved for adoption to another applicant.",
        "PET_UNAVAILABLE",
        409,
      );
    }
  }

  const form = normalizeForm(input.form);

  if (existing) {
    await collection.updateOne(
      { _id: existing._id },
      {
        $set: {
          form,
          status: "under_review",
          submittedAt: now,
          updatedAt: now,
        },
      },
    );
    const updated = await collection.findOne({ _id: existing._id });
    if (!updated) throw new PmrAdoptionError("Could not update application", "UPDATE_FAILED", 500);
    return toDto(updated);
  }

  const doc: PmrAdoptionApplicationDocument = {
    userEmail: email,
    petId: input.petId,
    status: "under_review",
    form,
    submittedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(doc);
  return toDto({ ...doc, _id: result.insertedId });
}

export async function createPmrPendingApplication(
  userEmail: string,
  petId: string,
): Promise<PmrAdoptionApplicationDTO> {
  const email = userEmail.trim().toLowerCase();
  const collection = await applicationsCollection();
  const existing = await collection.findOne({ userEmail: email, petId });
  if (existing) {
    if (existing.status === "pet_unavailable") {
      throw new PmrAdoptionError(
        "This pet has been approved for adoption to another applicant.",
        "PET_UNAVAILABLE",
        409,
      );
    }
    if (existing.status === "withdrawn") {
      const now = new Date();
      await collection.updateOne(
        { _id: existing._id },
        {
          $set: { status: "pending", updatedAt: now },
          $unset: { submittedAt: "" as const },
        },
      );
      const reopened = await collection.findOne({ _id: existing._id });
      if (!reopened) {
        throw new PmrAdoptionError("Could not reopen application", "UPDATE_FAILED", 500);
      }
      return toDto(reopened);
    }
    return toDto(existing);
  }

  const now = new Date();
  const emptyForm: PmrAdoptionApplicationForm = {
    phone: "",
    address: "",
    housingType: "",
    hasYard: false,
    otherPets: "",
    experience: "",
    whyAdopt: "",
    householdNotes: "",
  };

  const doc: PmrAdoptionApplicationDocument = {
    userEmail: email,
    petId,
    status: "pending",
    form: emptyForm,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(doc);
  return toDto({ ...doc, _id: result.insertedId });
}

function toAdminDto(doc: PmrAdoptionApplicationDocument): PmrAdoptionApplicationAdminDTO {
  return {
    ...toDto(doc),
    userEmail: doc.userEmail,
  };
}

export async function listAllPmrAdoptionApplications(): Promise<PmrAdoptionApplicationAdminDTO[]> {
  const collection = await applicationsCollection();
  const docs = await collection.find({}).sort({ updatedAt: -1 }).toArray();
  return docs.map(toAdminDto);
}

export async function updatePmrAdoptionApplicationStatus(
  applicationId: string,
  status: PmrApplicationStatus,
): Promise<PmrAdoptionApplicationAdminDTO> {
  const objectId = await assertPmrApplicationId(applicationId);
  const collection = await applicationsCollection();
  const now = new Date();

  const existing = await collection.findOne({ _id: objectId });
  if (!existing) {
    throw new PmrAdoptionError("Application not found", "NOT_FOUND", 404);
  }

  const update =
    status === "pending"
      ? {
          $set: { status, updatedAt: now },
          $unset: { submittedAt: "" as const },
        }
      : {
          $set: { status, updatedAt: now },
        };

  const updateResult = await collection.updateOne({ _id: objectId }, update);

  if (updateResult.matchedCount === 0) {
    throw new PmrAdoptionError("Application not found", "NOT_FOUND", 404);
  }

  if (status === "approved") {
    await closeOtherApplicationsForPet(collection, existing.petId, objectId, now);
  }

  const doc = await collection.findOne({ _id: objectId });
  if (!doc) {
    throw new PmrAdoptionError("Could not update application", "UPDATE_FAILED", 500);
  }

  return toAdminDto(doc);
}

async function closeOtherApplicationsForPet(
  collection: Awaited<ReturnType<typeof applicationsCollection>>,
  petId: string,
  approvedApplicationId: import("mongodb").ObjectId,
  now: Date,
) {
  await collection.updateMany(
    {
      petId,
      _id: { $ne: approvedApplicationId },
      status: "under_review",
    },
    { $set: { status: "pet_unavailable", updatedAt: now } },
  );
}

export async function withdrawPmrAdoptionApplication(
  userEmail: string,
  applicationId: string,
): Promise<PmrAdoptionApplicationDTO> {
  const objectId = await assertPmrApplicationId(applicationId);
  const collection = await applicationsCollection();
  const email = userEmail.trim().toLowerCase();
  const now = new Date();

  const existing = await collection.findOne({ _id: objectId, userEmail: email });
  if (!existing) {
    throw new PmrAdoptionError("Application not found", "NOT_FOUND", 404);
  }
  if (existing.status !== "under_review") {
    throw new PmrAdoptionError(
      "Only applications under review can be withdrawn.",
      "INVALID_STATUS",
      400,
    );
  }

  const updateResult = await collection.updateOne(
    { _id: objectId },
    {
      $set: { status: "withdrawn", updatedAt: now },
      $unset: { submittedAt: "" as const },
    },
  );

  if (updateResult.matchedCount === 0) {
    throw new PmrAdoptionError("Application not found", "NOT_FOUND", 404);
  }

  const doc = await collection.findOne({ _id: objectId });
  if (!doc) {
    throw new PmrAdoptionError("Could not withdraw application", "UPDATE_FAILED", 500);
  }

  return toDto(doc);
}

function normalizeForm(form: PmrAdoptionApplicationForm): PmrAdoptionApplicationForm {
  return {
    phone: form.phone.trim(),
    address: form.address.trim(),
    housingType: form.housingType.trim(),
    hasYard: Boolean(form.hasYard),
    otherPets: form.otherPets.trim(),
    experience: form.experience.trim(),
    whyAdopt: form.whyAdopt.trim(),
    householdNotes: form.householdNotes.trim(),
  };
}

export async function assertPmrApplicationId(id: string): Promise<ObjectId> {
  if (!ObjectId.isValid(id)) {
    throw new PmrAdoptionError("Invalid application id", "INVALID_ID", 400);
  }
  return new ObjectId(id);
}
