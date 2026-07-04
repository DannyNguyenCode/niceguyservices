export type PmrApplicationStatus =
  | "pending"
  | "under_review"
  | "denied"
  | "approved"
  | "withdrawn"
  | "pet_unavailable";

/** Statuses only admins can set from the dashboard */
export const PMR_ADMIN_SETTABLE_STATUSES: PmrApplicationStatus[] = [
  "pending",
  "under_review",
  "denied",
  "approved",
];

export type PmrAdoptionApplicationForm = {
  phone: string;
  address: string;
  housingType: string;
  hasYard: boolean;
  otherPets: string;
  experience: string;
  whyAdopt: string;
  householdNotes: string;
};

export type PmrAdoptionApplicationDocument = {
  _id?: import("mongodb").ObjectId;
  userEmail: string;
  petId: string;
  status: PmrApplicationStatus;
  form: PmrAdoptionApplicationForm;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type PmrAdoptionApplicationDTO = {
  id: string;
  petId: string;
  status: PmrApplicationStatus;
  form: PmrAdoptionApplicationForm;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PmrAdoptionApplicationAdminDTO = PmrAdoptionApplicationDTO & {
  userEmail: string;
};

export type PmrSubmitAdoptionApplicationInput = {
  petId: string;
  form: PmrAdoptionApplicationForm;
};
