import type { ObjectId } from "mongodb";

export type PetMarketUserRole = "member" | "admin";

export interface PetMarketUser {
  email: string;
  password_hash: string;
  name: string;
  pet_name: string;
  role: PetMarketUserRole;
  created_at: Date;
  updated_at: Date;
}

export interface PetMarketUserDocument extends PetMarketUser {
  _id: ObjectId;
}

export type PetMarketAuthCodePurpose = "login_2fa" | "password_reset";

export interface PetMarketAuthCode {
  email: string;
  code_hash: string;
  purpose: PetMarketAuthCodePurpose;
  expires_at: Date;
  created_at: Date;
  used_at?: Date;
}

export interface PetMarketAuthCodeDocument extends PetMarketAuthCode {
  _id: ObjectId;
}

export interface PetMarketSession {
  token_hash: string;
  user_id: ObjectId;
  email: string;
  name: string;
  pet_name: string;
  role: PetMarketUserRole;
  expires_at: Date;
  created_at: Date;
}

export interface PetMarketSessionDocument extends PetMarketSession {
  _id: ObjectId;
}

export type PetMarketAuthUserDTO = {
  email: string;
  name: string;
  pet_name: string;
  role: PetMarketUserRole;
};

export type PetMarketAuthSessionDTO = {
  token: string;
  user: PetMarketAuthUserDTO;
  expires_at: string;
};

export type PetMarketRegisterInput = {
  email: string;
  password: string;
  name: string;
  pet_name: string;
};

export type PetMarketLoginInput = {
  email: string;
  password: string;
};

export type PetMarketVerifyCodeInput = {
  email: string;
  code: string;
  purpose: PetMarketAuthCodePurpose;
};

export type PetMarketResetPasswordInput = {
  email: string;
  code: string;
  password: string;
};
