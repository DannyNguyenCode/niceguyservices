import "server-only";

import { getTemplateCollection } from "../../collections";
import { LooneyTunesProductError } from "../errors";
import {
  LOONEY_TUNES_AUTH_CODE_TTL_MS,
  LOONEY_TUNES_AUTH_CODES_COLLECTION,
  LOONEY_TUNES_MIN_PASSWORD_LENGTH,
  LOONEY_TUNES_SESSION_TTL_MS,
  LOONEY_TUNES_SESSIONS_COLLECTION,
  LOONEY_TUNES_USERS_COLLECTION,
} from "./constants";
import {
  generateOtpCode,
  generateSessionToken,
  hashPassword,
  hashSha256,
  verifyPassword,
} from "./crypto";
import { buildOtpEmailContent, sendLooneyTunesEmail } from "./email";
import type {
  LooneyTunesAuthCodeDocument,
  LooneyTunesAuthCodePurpose,
  LooneyTunesAuthSessionDTO,
  LooneyTunesAuthUserDTO,
  LooneyTunesLoginInput,
  LooneyTunesRegisterInput,
  LooneyTunesResetPasswordInput,
  LooneyTunesSessionDocument,
  LooneyTunesUserDocument,
  LooneyTunesVerifyCodeInput,
} from "./types";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function assertPasswordStrength(password: string) {
  if (password.length < LOONEY_TUNES_MIN_PASSWORD_LENGTH) {
    throw new LooneyTunesProductError(
      `Password must be at least ${LOONEY_TUNES_MIN_PASSWORD_LENGTH} characters`,
      "INVALID_PASSWORD",
      400,
    );
  }
}

function toUserDto(user: LooneyTunesUserDocument): LooneyTunesAuthUserDTO {
  return {
    email: user.email,
    name: user.name,
    favorite_drink: user.favorite_drink,
    role: user.role,
  };
}

async function usersCollection() {
  return getTemplateCollection<LooneyTunesUserDocument>(LOONEY_TUNES_USERS_COLLECTION);
}

async function codesCollection() {
  return getTemplateCollection<LooneyTunesAuthCodeDocument>(LOONEY_TUNES_AUTH_CODES_COLLECTION);
}

async function sessionsCollection() {
  return getTemplateCollection<LooneyTunesSessionDocument>(LOONEY_TUNES_SESSIONS_COLLECTION);
}

export async function ensureLooneyTunesAdminUser(): Promise<void> {
  const adminEmail = normalizeEmail(
    process.env.LT_ADMIN_EMAIL?.trim() || "admin@cometcup.local",
  );
  const adminPassword = process.env.LT_ADMIN_PASSWORD?.trim() || "admin";
  const collection = await usersCollection();
  const existing = await collection.findOne({ email: adminEmail });
  if (existing) return;

  const now = new Date();
  await collection.insertOne({
    email: adminEmail,
    password_hash: await hashPassword(adminPassword),
    name: "Demo Admin",
    favorite_drink: "Latte",
    role: "admin",
    created_at: now,
    updated_at: now,
  } as LooneyTunesUserDocument);
}

async function findUserByEmail(email: string): Promise<LooneyTunesUserDocument | null> {
  const collection = await usersCollection();
  return collection.findOne({ email: normalizeEmail(email) });
}

async function invalidateActiveCodes(email: string, purpose: LooneyTunesAuthCodePurpose) {
  const collection = await codesCollection();
  const now = new Date();
  await collection.updateMany(
    { email: normalizeEmail(email), purpose, used_at: { $exists: false } },
    { $set: { used_at: now } },
  );
}

async function createAndSendOtp(
  email: string,
  purpose: LooneyTunesAuthCodePurpose,
): Promise<{ devCode?: string }> {
  const normalized = normalizeEmail(email);
  const code = generateOtpCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + LOONEY_TUNES_AUTH_CODE_TTL_MS);

  await invalidateActiveCodes(normalized, purpose);

  const collection = await codesCollection();
  await collection.insertOne({
    email: normalized,
    code_hash: hashSha256(code),
    purpose,
    expires_at: expiresAt,
    created_at: now,
  } as LooneyTunesAuthCodeDocument);

  const copy =
    purpose === "login_2fa"
      ? {
          heading: "Your Comet Cup Co. sign-in code",
          intro: "Use this one-time code to finish signing in. It expires in 10 minutes.",
          footer: "If you didn't try to sign in, you can safely ignore this email.",
        }
      : {
          heading: "Reset your Comet Cup Co. password",
          intro: "Use this code to choose a new password. It expires in 10 minutes.",
          footer: "If you didn't request a reset, you can safely ignore this email.",
        };

  const content = buildOtpEmailContent({ ...copy, code });
  await sendLooneyTunesEmail({
    to: normalized,
    subject: copy.heading,
    ...content,
  });

  const devCode = process.env.NODE_ENV === "development" ? code : undefined;

  return { devCode };
}

async function verifyOtp(input: LooneyTunesVerifyCodeInput): Promise<void> {
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
    throw new LooneyTunesProductError("That code is invalid or expired", "INVALID_CODE", 401);
  }

  await collection.updateOne({ _id: doc._id }, { $set: { used_at: now } });
}

async function createSession(user: LooneyTunesUserDocument): Promise<LooneyTunesAuthSessionDTO> {
  const token = generateSessionToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + LOONEY_TUNES_SESSION_TTL_MS);
  const collection = await sessionsCollection();

  await collection.insertOne({
    token_hash: hashSha256(token),
    user_id: user._id,
    email: user.email,
    name: user.name,
    favorite_drink: user.favorite_drink,
    role: user.role,
    expires_at: expiresAt,
    created_at: now,
  } as LooneyTunesSessionDocument);

  return {
    token,
    user: toUserDto(user),
    expires_at: expiresAt.toISOString(),
  };
}

export async function registerLooneyTunesUser(
  input: LooneyTunesRegisterInput,
): Promise<LooneyTunesAuthSessionDTO> {
  await ensureLooneyTunesAdminUser();

  const email = normalizeEmail(input.email);
  const name = input.name?.trim();
  const favoriteDrink = input.favorite_drink?.trim();

  if (!email || !email.includes("@")) {
    throw new LooneyTunesProductError("A valid email is required", "INVALID_EMAIL", 400);
  }
  if (!name) {
    throw new LooneyTunesProductError("Full name is required", "INVALID_NAME", 400);
  }
  if (!favoriteDrink) {
    throw new LooneyTunesProductError("Favorite drink is required", "INVALID_FAVORITE_DRINK", 400);
  }

  assertPasswordStrength(input.password);

  const collection = await usersCollection();
  const existing = await collection.findOne({ email });
  if (existing) {
    throw new LooneyTunesProductError("An account with this email already exists", "EMAIL_EXISTS", 409);
  }

  const now = new Date();
  const insertResult = await collection.insertOne({
    email,
    password_hash: await hashPassword(input.password),
    name,
    favorite_drink: favoriteDrink,
    role: "member",
    created_at: now,
    updated_at: now,
  } as LooneyTunesUserDocument);

  const user = await collection.findOne({ _id: insertResult.insertedId });
  if (!user) {
    throw new Error("Failed to read user after registration");
  }

  await sendLooneyTunesEmail({
    to: email,
    subject: "Welcome to the Comet Streak rewards club!",
    text: `Hi ${name},\n\nWelcome to Comet Cup Co.! Your favorite ${favoriteDrink} is just the beginning.\n\nOrder as a guest anytime — sign in to track stars and rewards.`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;color:#151c28">
        <h1 style="color:#495E84">Welcome aboard, ${name}!</h1>
        <p>You're officially in the <strong>Comet Streak</strong> rewards club.</p>
        <p>Your go-to order: <strong>${favoriteDrink}</strong>. We'll keep the good vibes brewing at Inkwell Pier.</p>
      </div>
    `.trim(),
  });

  return createSession(user);
}

export async function startLooneyTunesLogin(
  input: LooneyTunesLoginInput,
): Promise<LooneyTunesAuthSessionDTO> {
  await ensureLooneyTunesAdminUser();

  const email = normalizeEmail(input.email);
  const user = await findUserByEmail(email);
  if (!user) {
    throw new LooneyTunesProductError("Email or password is incorrect", "INVALID_CREDENTIALS", 401);
  }

  const valid = await verifyPassword(input.password, user.password_hash);
  if (!valid) {
    throw new LooneyTunesProductError("Email or password is incorrect", "INVALID_CREDENTIALS", 401);
  }

  return createSession(user);
}

export async function startLooneyTunesPasswordReset(
  emailInput: string,
): Promise<{ email: string; message: string; devCode?: string }> {
  await ensureLooneyTunesAdminUser();
  const email = normalizeEmail(emailInput);

  if (!email || !email.includes("@")) {
    throw new LooneyTunesProductError("A valid email is required", "INVALID_EMAIL", 400);
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

export async function resetLooneyTunesPassword(
  input: LooneyTunesResetPasswordInput,
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
    throw new LooneyTunesProductError("Account not found", "NOT_FOUND", 404);
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

  await sendLooneyTunesEmail({
    to: email,
    subject: "Your Comet Cup Co. password was updated",
    text: "Your password was changed successfully. If this wasn't you, contact the cafe right away.",
    html: `<p>Your Comet Cup Co. password was changed successfully.</p><p>If this wasn't you, please contact us right away.</p>`,
  });

  return { message: "Password updated. You can sign in with your new password." };
}

export async function getLooneyTunesSession(
  token: string | null | undefined,
): Promise<LooneyTunesAuthSessionDTO | null> {
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
      favorite_drink: doc.favorite_drink,
      role: doc.role,
    },
    expires_at: doc.expires_at.toISOString(),
  };
}

export async function revokeLooneyTunesSession(token: string | null | undefined): Promise<void> {
  if (!token?.trim()) return;
  const collection = await sessionsCollection();
  await collection.deleteOne({ token_hash: hashSha256(token.trim()) });
}
