import type {
  ViContactInquiryInput,
  ViInquirySubmitResult,
  ViQuoteInquiryInput,
} from "@/lib/templates/valley-interlocking/forms";

export const VI_INQUIRY_API = {
  contact: "/api/valley-interlocking/contact",
  quote: "/api/valley-interlocking/quote",
} as const;

type ViInquiryErrorBody = {
  error?: string;
};

async function postInquiry<TInput>(
  url: string,
  payload: TInput,
): Promise<ViInquirySubmitResult> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let body: ViInquirySubmitResult | ViInquiryErrorBody = {};
  try {
    body = (await response.json()) as ViInquirySubmitResult | ViInquiryErrorBody;
  } catch {
    body = {};
  }

  if (!response.ok) {
    const message = "error" in body && body.error ? body.error : "Could not send your message";
    throw new Error(message);
  }

  return body as ViInquirySubmitResult;
}

export function submitViContactInquiry(payload: ViContactInquiryInput) {
  return postInquiry(VI_INQUIRY_API.contact, payload);
}

export function submitViQuoteInquiry(payload: ViQuoteInquiryInput) {
  return postInquiry(VI_INQUIRY_API.quote, payload);
}
