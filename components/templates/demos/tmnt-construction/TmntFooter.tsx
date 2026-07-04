import Link from "next/link";
import { TMNT_BASE } from "./tmntConfig";

export function TmntFooter() {
  return (
    <footer className="mt-auto w-full border-t-4 border-[#216b41] bg-[#e0e3dd] py-12 pb-28 md:pb-12">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-5 md:grid-cols-4 md:gap-6 md:px-20">
        <div>
          <h2
            className="mb-4 text-2xl font-bold text-[#181d19]"
            style={{ fontFamily: "var(--font-tmnt-headline), system-ui, sans-serif" }}
          >
            PATCHLINE CREW
          </h2>
          <p className="text-sm uppercase tracking-tighter text-[#404941]">
            Urban ninja craftsmanship — demo template only.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p
            className="mb-2 text-xs font-bold uppercase tracking-widest text-[#216b41]"
            style={{ fontFamily: "var(--font-tmnt-label), system-ui, sans-serif" }}
          >
            Services
          </p>
          <Link href={`${TMNT_BASE}/services`} className="text-[#404941] transition-colors hover:text-[#225cb4]">
            Residential interlock
          </Link>
          <Link href={`${TMNT_BASE}/services`} className="text-[#404941] transition-colors hover:text-[#225cb4]">
            Commercial grading
          </Link>
          <Link href={`${TMNT_BASE}/services`} className="text-[#404941] transition-colors hover:text-[#225cb4]">
            Lighting systems
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <p
            className="mb-2 text-xs font-bold uppercase tracking-widest text-[#216b41]"
            style={{ fontFamily: "var(--font-tmnt-label), system-ui, sans-serif" }}
          >
            Operations
          </p>
          <Link href={`${TMNT_BASE}/projects`} className="text-[#404941] transition-colors hover:text-[#225cb4]">
            Project gallery
          </Link>
          <Link href={`${TMNT_BASE}/about`} className="text-[#404941] transition-colors hover:text-[#225cb4]">
            Meet the crew
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <p
            className="mb-2 text-xs font-bold uppercase tracking-widest text-[#216b41]"
            style={{ fontFamily: "var(--font-tmnt-label), system-ui, sans-serif" }}
          >
            Status
          </p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#216b41]" />
            <span className="text-[#181d19]">Systems active</span>
          </div>
          <p className="mt-4 text-xs text-[#707a70]">
            © {new Date().getFullYear()} Patchline Crew (fictional demo).
          </p>
        </div>
      </div>
    </footer>
  );
}
