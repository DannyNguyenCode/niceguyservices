import "server-only";

import { getTemplateCollection } from "../../collections";
import { PetMarketInventoryError } from "../errors";
import {
  PET_MARKET_AUTH_CODE_TTL_MS,
  PET_MARKET_AUTH_CODES_COLLECTION,
  PET_MARKET_MIN_PASSWORD_LENGTH,
  PET_MARKET_SESSION_TTL_MS,
  PET_MARKET_SESSIONS_COLLECTION,
  PET_MARKET_USERS_COLLECTION,
} from "./constants";
import {
  generateOtpCode,
  generateSessionToken,
  hashPassword,
  hashSha256,
  verifyPassword,
} from "./crypto";
import { buildOtpEmailContent, sendPetMarketEmail } from "./email";
import type {
  PetMarketAuthCodeDocument,
  PetMarketAuthCodePurpose,
  PetMarketAuthSessionDTO,
  PetMarketAuthUserDTO,
  PetMarketLoginInput,
  PetMarketRegisterInput,
  PetMarketResetPasswordInput,
  PetMarketSessionDocument,
  PetMarketUserDocument,
  PetMarketVerifyCodeInput,
} from "./types";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function assertPasswordStrength(password: string) {
  if (password.length < PET_MARKET_MIN_PASSWORD_LENGTH) {
    throw new PetMarketInventoryError(
      `Password must be at least ${PET_MARKET_MIN_PASSWORD_LENGTH} characters`,
      "INVALID_PASSWORD",
      400,
    );
  }
}

function toUserDto(user: PetMarketUserDocument): PetMarketAuthUserDTO {
  return {
    email: user.email,
    name: user.name,
    pet_name: user.pet_name,
    role: user.role,
  };
}

async function usersCollection() {
  return getTemplateCollection<PetMarketUserDocument>(PET_MARKET_USERS_COLLECTION);
}

async function codesCollection() {
  return getTemplateCollection<PetMarketAuthCodeDocument>(PET_MARKET_AUTH_CODES_COLLECTION);
}

async function sessionsCollection() {
  return getTemplateCollection<PetMarketSessionDocument>(PET_MARKET_SESSIONS_COLLECTION);
}

export async function ensurePetMarketAdminUser(): Promise<void> {
  const adminEmail = normalizeEmail(
    process.env.SPM_ADMIN_EMAIL?.trim() || "admin@petmarket.local",
  );
  const adminPassword = process.env.SPM_ADMIN_PASSWORD?.trim() || "admin";
  const collection = await usersCollection();
  const existing = await collection.findOne({ email: adminEmail });
  if (existing) return;

  const now = new Date();
  await collection.insertOne({
    email: adminEmail,
    password_hash: await hashPassword(adminPassword),
    name: "Store Admin",
    pet_name: "Bandit",
    role: "admin",
    created_at: now,
    updated_at: now,
  } as PetMarketUserDocument);
}

async function findUserByEmail(email: string): Promise<PetMarketUserDocument | null> {
  const collection = await usersCollection();
  return collection.findOne({ email: normalizeEmail(email) });
}

async function invalidateActiveCodes(email: string, purpose: PetMarketAuthCodePurpose) {
  const collection = await codesCollection();
  const now = new Date();
  await collection.updateMany(
    { email: normalizeEmail(email), purpose, used_at: { $exists: false } },
    { $set: { used_at: now } },
  );
}

async function createAndSendOtp(
  email: string,
  purpose: PetMarketAuthCodePurpose,
): Promise<{ devCode?: string }> {
  const normalized = normalizeEmail(email);
  const code = generateOtpCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + PET_MARKET_AUTH_CODE_TTL_MS);

  await invalidateActiveCodes(normalized, purpose);

  const collection = await codesCollection();
  await collection.insertOne({
    email: normalized,
    code_hash: hashSha256(code),
    purpose,
    expires_at: expiresAt,
    created_at: now,
  } as PetMarketAuthCodeDocument);

  const copy =
    purpose === "login_2fa"
      ? {
          heading: "Your Saturday Pet Market sign-in code",
          intro: "Use this one-time code to finish signing in. It expires in 10 minutes.",
          footer: "If you didn’t try to sign in, you can safely ignore this email.",
        }
      : {
          heading: "Reset your Pet Market password",
          intro: "Use this code to choose a new password. It expires in 10 minutes.",
          footer: "If you didn’t request a reset, you can safely ignore this email.",
        };

  const content = buildOtpEmailContent({ ...copy, code });
  await sendPetMarketEmail({
    to: normalized,
    subject: copy.heading,
    ...content,
  });

  const devCode = process.env.NODE_ENV === "development" ? code : undefined;

  return { devCode };
}

async function verifyOtp(input: PetMarketVerifyCodeInput): Promise<void> {
  const normalized = normalizeEmail(input.email);
  const collection = await codesCollection();
  const now = new Date();

  const doc = await collection.findOne({
    email: normalized,
    purpose: input.purpose,
    code_hash: hashSha256(input.code.trim()),
    used_at: { $exists: false },
    expires_at: { $gt: now },
  });

  if (!doc) {
    throw new PetMarketInventoryError("That code is invalid or expired", "INVALID_CODE", 401);
  }

  await collection.updateOne({ _id: doc._id }, { $set: { used_at: now } });
}

async function createSession(user: PetMarketUserDocument): Promise<PetMarketAuthSessionDTO> {
  const token = generateSessionToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + PET_MARKET_SESSION_TTL_MS);
  const collection = await sessionsCollection();

  await collection.insertOne({
    token_hash: hashSha256(token),
    user_id: user._id,
    email: user.email,
    name: user.name,
    pet_name: user.pet_name,
    role: user.role,
    expires_at: expiresAt,
    created_at: now,
  } as PetMarketSessionDocument);

  return {
    token,
    user: toUserDto(user),
    expires_at: expiresAt.toISOString(),
  };
}

export async function registerPetMarketUser(
  input: PetMarketRegisterInput,
): Promise<PetMarketAuthSessionDTO> {
  await ensurePetMarketAdminUser();

  const email = normalizeEmail(input.email);
  const name = input.name?.trim();
  const petName = input.pet_name?.trim();

  if (!email || !email.includes("@")) {
    throw new PetMarketInventoryError("A valid email is required", "INVALID_EMAIL", 400);
  }
  if (!name) {
    throw new PetMarketInventoryError("Full name is required", "INVALID_NAME", 400);
  }
  if (!petName) {
    throw new PetMarketInventoryError("Pet name is required", "INVALID_PET_NAME", 400);
  }

  assertPasswordStrength(input.password);

  const collection = await usersCollection();
  const existing = await collection.findOne({ email });
  if (existing) {
    throw new PetMarketInventoryError("An account with this email already exists", "EMAIL_EXISTS", 409);
  }

  const now = new Date();
  const insertResult = await collection.insertOne({
    email,
    password_hash: await hashPassword(input.password),
    name,
    pet_name: petName,
    role: "member",
    created_at: now,
    updated_at: now,
  } as PetMarketUserDocument);

  const user = await collection.findOne({ _id: insertResult.insertedId });
  if (!user) {
    throw new Error("Failed to read user after registration");
  }

  await sendPetMarketEmail({
    to: email,
    subject: "Welcome to the Saturday Morning Rewards Club!",
    text: `Hi ${name},\n\nWelcome to Saturday Pet Market! You and ${petName} are officially part of the neighborhood pack.\n\nStart shopping for treats, toys, and essentials today.`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a">
        <h1 style="color:#006a6a">Welcome to the pack, ${name}!</h1>
        <p>You and <strong>${petName}</strong> are officially members of the Saturday Morning Rewards Club.</p>
        <p>Pop by the shop for neighborhood favorites, fresh treats, and tail-wagging deals.</p>
      </div>
    `.trim(),
  });

  return createSession(user);
}

export async function startPetMarketLogin(
  input: PetMarketLoginInput,
): Promise<PetMarketAuthSessionDTO> {
  await ensurePetMarketAdminUser();

  const email = normalizeEmail(input.email);
  const user = await findUserByEmail(email);
  if (!user) {
    throw new PetMarketInventoryError("Email or password is incorrect", "INVALID_CREDENTIALS", 401);
  }

  const valid = await verifyPassword(input.password, user.password_hash);
  if (!valid) {
    throw new PetMarketInventoryError("Email or password is incorrect", "INVALID_CREDENTIALS", 401);
  }

  /* 2FA login — uncomment to require an emailed code before creating a session
  const { devCode } = await createAndSendOtp(email, "login_2fa");

  return {
    email,
    message: "We sent a 6-digit code to your email. Enter it below to finish signing in.",
    devCode,
  };
  */

  return createSession(user);
}

/** Completes login after 2FA — unused while login skips the email code step */
export async function verifyPetMarketLogin(
  input: PetMarketVerifyCodeInput,
): Promise<PetMarketAuthSessionDTO> {
  const email = normalizeEmail(input.email);
  await verifyOtp({ ...input, email, purpose: "login_2fa" });

  const user = await findUserByEmail(email);
  if (!user) {
    throw new PetMarketInventoryError("Account not found", "NOT_FOUND", 404);
  }

  return createSession(user);
}

export async function startPetMarketPasswordReset(
  emailInput: string,
): Promise<{ email: string; message: string; devCode?: string }> {
  await ensurePetMarketAdminUser();
  const email = normalizeEmail(emailInput);

  if (!email || !email.includes("@")) {
    throw new PetMarketInventoryError("A valid email is required", "INVALID_EMAIL", 400);
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return {
      email,
      message:
        "If an account exists for that email, we sent a reset code. Check your inbox in a moment.",
    };
  }

  const { devCode } = await createAndSendOtp(email, "password_reset");

  return {
    email,
    message:
      "If an account exists for that email, we sent a reset code. Check your inbox in a moment.",
    devCode,
  };
}

export async function resetPetMarketPassword(
  input: PetMarketResetPasswordInput,
): Promise<{ message: string }> {
  const email = normalizeEmail(input.email);
  assertPasswordStrength(input.password);

  await verifyOtp({
    email,
    code: input.code,
    purpose: "password_reset",
  });

  const user = await findUserByEmail(email);
  if (!user) {
    throw new PetMarketInventoryError("Account not found", "NOT_FOUND", 404);
  }

  const collection = await usersCollection();
  await collection.updateOne(
    { _id: user._id },
    {
      $set: {
        password_hash: await hashPassword(input.password),
        updated_at: new Date(),
      },
    },
  );

  await sendPetMarketEmail({
    to: email,
    subject: "Your Pet Market password was updated",
    text: "Your password was changed successfully. If this wasn't you, contact the store right away.",
    html: `<p>Your Saturday Pet Market password was changed successfully.</p><p>If this wasn't you, please contact us right away.</p>`,
  });

  return { message: "Password updated. You can sign in with your new password." };
}

export async function getPetMarketSession(
  token: string | null | undefined,
): Promise<PetMarketAuthSessionDTO | null> {
  if (!token?.trim()) return null;

  const collection = await sessionsCollection();
  const now = new Date();
  const doc = await collection.findOne({
    token_hash: hashSha256(token.trim()),
    expires_at: { $gt: now },
  });

  if (!doc) return null;

  return {
    token: token.trim(),
    user: {
      email: doc.email,
      name: doc.name,
      pet_name: doc.pet_name,
      role: doc.role,
    },
    expires_at: doc.expires_at.toISOString(),
  };
}

export async function revokePetMarketSession(token: string | null | undefined): Promise<void> {
  if (!token?.trim()) return;
  const collection = await sessionsCollection();
  await collection.deleteOne({ token_hash: hashSha256(token.trim()) });
}
