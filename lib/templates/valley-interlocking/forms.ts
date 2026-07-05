import { VI_QUOTE_LOCATIONS } from "@/components/templates/demos/valley-interlocking/valleyInterlockingData";

export type ViContactInquiryInput = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export type ViQuoteInquiryInput = {
  name: string;
  phone: string;
  email: string;
  location: string;
  services: string[];
  address: string;
  details: string;
};

export type ViInquirySubmitResult = {
  ok: true;
  provider: "console";
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireField(value: string, label: string): string {
  const trimmed = value.trim();
  if (!trimmed) throw new Error(`${label} is required`);
  return trimmed;
}

export function normalizeViContactInquiry(input: ViContactInquiryInput): ViContactInquiryInput {
  const email = requireField(input.email, "Email").toLowerCase();
  if (!EMAIL_PATTERN.test(email)) throw new Error("Email must be valid");

  return {
    name: requireField(input.name, "Name"),
    phone: requireField(input.phone, "Phone"),
    email,
    message: requireField(input.message, "Message"),
  };
}

export function normalizeViQuoteInquiry(input: ViQuoteInquiryInput): ViQuoteInquiryInput {
  const email = requireField(input.email, "Email").toLowerCase();
  if (!EMAIL_PATTERN.test(email)) throw new Error("Email must be valid");

  const location = requireField(input.location, "Project location");
  const allowedLocations = VI_QUOTE_LOCATIONS.map((item: { id: string; label: string; detail: string }) => item.id);
  if (!allowedLocations.includes(location as (typeof allowedLocations)[number])) {
    throw new Error("Project location is invalid");
  }

  return {
    name: requireField(input.name, "Name"),
    phone: requireField(input.phone, "Phone"),
    email,
    location,
    services: Array.isArray(input.services)
      ? input.services.map((service) => service.trim()).filter(Boolean)
      : [],
    address: requireField(input.address, "Project street address"),
    details: input.details.trim(),
  };
}

export function viQuoteLocationLabel(locationId: string): string {
  return VI_QUOTE_LOCATIONS.find((item: { id: string; label: string; detail: string }) => item.id === locationId)?.label ?? locationId;
}

export function escapeViEmailHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
