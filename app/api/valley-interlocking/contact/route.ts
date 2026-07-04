import {
  normalizeViContactInquiry,
  type ViContactInquiryInput,
} from "@/lib/templates/valley-interlocking/forms";
import { sendViContactInquiry } from "@/lib/templates/db/valley-interlocking/inquiry-email";
import { handleViInquiryRoute, readJsonBody } from "../_lib/http";

/** POST /api/valley-interlocking/contact — demo inquiry capture (console only) */
export async function POST(request: Request) {
  return handleViInquiryRoute(async () => {
    const body = await readJsonBody<ViContactInquiryInput>(request);
    const inquiry = normalizeViContactInquiry(body);
    const result = await sendViContactInquiry(inquiry);
    return { ok: true as const, provider: result.provider };
  });
}
