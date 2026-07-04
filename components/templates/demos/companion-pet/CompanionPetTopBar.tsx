import Link from "next/link";
import { CP_LOYALTY } from "./companionPetData";
import { CP_EMAIL, CP_PATHS } from "./companionPetConfig";

export function CompanionPetTopBar() {
  return (
    <div className="border-b border-[var(--cp-border)] bg-[var(--cp-warm-gray)] text-xs text-[var(--cp-slate)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 md:px-8">
        <p className="font-medium text-[var(--cp-charcoal)]">
          Free shipping on orders $49+ ·{" "}
          <span className="text-[var(--cp-orange)]">{CP_LOYALTY.points.toLocaleString()} points</span> available
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href={CP_PATHS.rewards} className="hover:text-[var(--cp-blue)]">
            Rewards
          </Link>
          <span>Support · (416) 555-0194</span>
          <Link href={`mailto:${CP_EMAIL}`} className="hover:text-[var(--cp-blue)]">
            Email signup
          </Link>
        </div>
      </div>
    </div>
  );
}
