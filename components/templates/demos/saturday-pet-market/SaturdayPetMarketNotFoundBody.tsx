import Link from "next/link";
import { SPM_PATHS } from "./saturdayPetMarketConfig";
import { SPM_IMG } from "./saturdayPetMarketImages";
import { SpmContainer, SpmIcon, SpmImg } from "./SaturdayPetMarketShared";

const SPM_NOT_FOUND_COLLECTIONS = [
  {
    tag: "Organic",
    title: "Gourmet Treats",
    href: SPM_PATHS.shop,
    image: SPM_IMG.notFound.gourmetTreats,
    alt: "Colorful organic dog biscuits in heart and bone shapes",
  },
  {
    tag: "Playtime",
    title: "Tough Toys",
    href: SPM_PATHS.shop,
    image: SPM_IMG.notFound.toughToys,
    alt: "Vintage toy box filled with plush dog and cat toys",
  },
  {
    tag: "Style",
    title: "Fresh Collars",
    href: SPM_PATHS.shop,
    image: SPM_IMG.notFound.freshCollars,
    alt: "Leather and nylon pet collars on a boutique pegboard",
  },
  {
    tag: "Nutrition",
    title: "Raw Meals",
    href: SPM_PATHS.shop,
    image: SPM_IMG.notFound.rawMeals,
    alt: "Bowl of fresh raw pet food with salmon and peas",
  },
] as const;

export function SaturdayPetMarketNotFoundBody() {
  return (
    <main className="relative flex min-h-[70vh] flex-col items-center overflow-hidden px-[var(--spm-margin)] pb-[var(--spm-xl)] pt-[2em]">
      <div className="spm-candy-stripes absolute left-0 top-0 -z-10 h-32 w-full" aria-hidden />
      <div className="spm-candy-stripes absolute bottom-0 left-0 -z-10 h-32 w-full rotate-180" aria-hidden />

      <SpmContainer className="flex w-full max-w-2xl flex-col items-center text-center">
        <div className="spm-label-sm mb-[var(--spm-base)] inline-block rounded-full bg-[var(--spm-secondary-fixed)] px-[var(--spm-md)] py-1 text-[var(--spm-on-secondary-fixed-variant)]">
          ERROR 404
        </div>
        <h1 className="spm-headline-xl mb-[var(--spm-md)] leading-tight text-[var(--spm-primary)]">
          Whoops! This trail went cold.
        </h1>
        <p className="spm-body-lg mb-[var(--spm-lg)] max-w-md text-[var(--spm-on-surface-variant)]">
          It looks like the page you&apos;re looking for has wandered off. Don&apos;t worry, our store experts are on the
          case!
        </p>
        <div className="flex w-full max-w-lg flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <Link
            href={SPM_PATHS.home}
            className="spm-coupon-button spm-headline-md rounded-lg bg-[var(--spm-primary)] px-[var(--spm-lg)] py-4 text-center text-[var(--spm-on-primary)] shadow-[4px_4px_0px_#003636] transition-all hover:bg-[var(--spm-primary-container)] sm:min-w-[12rem]"
          >
            Back to Homepage
          </Link>
          <Link
            href={SPM_PATHS.shop}
            className="spm-coupon-button spm-headline-md rounded-lg bg-[var(--spm-tertiary)] px-[var(--spm-lg)] py-4 text-center text-[var(--spm-on-tertiary)] shadow-[4px_4px_0px_#5e0b34] transition-all hover:bg-[var(--spm-tertiary-container)] sm:min-w-[12rem]"
          >
            Browse Treats
          </Link>
        </div>
        <div className="pt-6">
          <Link
            href={SPM_PATHS.contact}
            className="group inline-flex items-center gap-[var(--spm-xs)] font-semibold text-[var(--spm-secondary)] hover:underline"
          >
            Contact Support
            <SpmIcon name="arrow_forward" className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </SpmContainer>

      <SpmContainer className="mt-[var(--spm-xl)] w-full">
        <div className="spm-wavy-divider mb-[var(--spm-xl)] h-4 w-full bg-[var(--spm-surface-container-highest)]" />
        <h2 className="spm-headline-md mb-[var(--spm-md)] text-[var(--spm-on-surface)]">
          Did you mean to find one of these?
        </h2>
        <div className="grid grid-cols-2 gap-[var(--spm-gutter)] md:grid-cols-4">
          {SPM_NOT_FOUND_COLLECTIONS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group cursor-pointer rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] p-[var(--spm-md)] shadow-sm transition-all hover:border-[var(--spm-primary)]"
            >
              <div className="mb-[var(--spm-sm)]">
                <SpmImg
                  variant="productCard"
                  frameClassName="rounded-md bg-[var(--spm-surface-variant)]"
                  src={item.image}
                  alt={item.alt}
                  className="transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span className="spm-label-sm uppercase text-[var(--spm-primary)]">{item.tag}</span>
              <h3 className="spm-headline-md transition-colors group-hover:text-[var(--spm-secondary)]">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </SpmContainer>
    </main>
  );
}
