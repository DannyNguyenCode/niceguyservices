import type { ObjectId } from "mongodb";

export type LooneyTunesUserRole = "member" | "admin";

export interface LooneyTunesUser {
  email: string;
  password_hash: string;
  name: string;
  favorite_drink: string;
  role: LooneyTunesUserRole;
  created_at: Date;
  updated_at: Date;
}

export interface LooneyTunesUserDocument extends LooneyTunesUser {
  _id: ObjectId;
}

export type LooneyTunesAuthCodePurpose = "login_2fa" | "password_reset";

export interface LooneyTunesAuthCode {
  email: string;
  code_hash: string;
  purpose: LooneyTunesAuthCodePurpose;
  expires_at: Date;
  created_at: Date;
  used_at?: Date;
}

export interface LooneyTunesAuthCodeDocument extends LooneyTunesAuthCode {
  _id: ObjectId;
}

export interface LooneyTunesSession {
  token_hash: string;
  user_id: ObjectId;
  email: string;
  name: string;
  favorite_drink: string;
  role: LooneyTunesUserRole;
  expires_at: Date;
  created_at: Date;
}

export interface LooneyTunesSessionDocument extends LooneyTunesSession {
  _id: ObjectId;
}

export type LooneyTunesAuthUserDTO = {
  email: string;
  name: string;
  favorite_drink: string;
  role: LooneyTunesUserRole;
};

export type LooneyTunesAuthSessionDTO = {
  token: string;
  user: LooneyTunesAuthUserDTO;
  expires_at: string;
};

export type LooneyTunesRegisterInput = {
  email: string;
  password: string;
  name: string;
  favorite_drink: string;
};

export type LooneyTunesLoginInput = {
  email: string;
  password: string;
};

export type LooneyTunesVerifyCodeInput = {
  email: string;
  code: string;
  purpose: LooneyTunesAuthCodePurpose;
};

export type LooneyTunesResetPasswordInput = {
  email: string;
  code: string;
  password: string;
};
