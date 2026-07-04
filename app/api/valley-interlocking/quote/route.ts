import {
  normalizeViQuoteInquiry,
  type ViQuoteInquiryInput,
} from "@/lib/templates/valley-interlocking/forms";
import { sendViQuoteInquiry } from "@/lib/templates/db/valley-interlocking/inquiry-email";
import { handleViInquiryRoute, readJsonBody } from "../_lib/http";

/** POST /api/valley-interlocking/quote — demo inquiry capture (console only) */
export async function POST(request: Request) {
  return handleViInquiryRoute(async () => {
    const body = await readJsonBody<ViQuoteInquiryInput>(request);
    const inquiry = normalizeViQuoteInquiry(body);
    const result = await sendViQuoteInquiry(inquiry);
    return { ok: true as const, provider: result.provider };
  });
}
