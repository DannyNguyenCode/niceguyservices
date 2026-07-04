"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  SPM_NAV_ITEMS,
  SPM_PATHS,
  SPM_SITE,
  isSpmNavActive,
} from "./saturdayPetMarketConfig";
import { SPM_IMG } from "./saturdayPetMarketImages";
import { useSpmAuth } from "./SaturdayPetMarketAuthContext";
import { useSpmCart } from "./SaturdayPetMarketCartContext";
import { SaturdayPetMarketNavSearch } from "./SaturdayPetMarketNavSearch";
import {
  SPM_IMAGE_SIZES,
  SPM_IMAGE_VARIANTS,
  spmResponsiveImageClassName,
  type SpmImageVariant,
} from "./spmImageSizes";

export type { SpmImageVariant };
export { SPM_IMAGE_SIZES, SPM_IMAGE_VARIANTS };

export const SPM_QUICK_LINKS = [
  { label: "FAQ", href: SPM_PATHS.faq },
  { label: "Contact", href: SPM_PATHS.contact },
  { label: "Locations", href: SPM_PATHS.locations },
  { label: "Resource Center", href: SPM_PATHS.resources },
] as const;

export type SpmQuickLinkLabel = (typeof SPM_QUICK_LINKS)[number]["label"];

export function SpmQuickLinksNav({
  active,
  className = "space-y-1",
  linkClassName = "text-[var(--spm-on-surface-variant)] hover:text-[var(--spm-primary)]",
  activeClassName = "font-bold text-[var(--spm-primary)]",
}: {
  active?: SpmQuickLinkLabel;
  className?: string;
  linkClassName?: string;
  activeClassName?: string;
}) {
  return (
    <ul className={className}>
      {SPM_QUICK_LINKS.map(({ label, href }) => (
        <li key={label}>
          <Link href={href} className={active === label ? activeClassName : linkClassName}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SpmIcon({
  name,
  className = "",
  fill = false,
}: {
  name: string;
  className?: string;
  fill?: boolean;
}) {
  return (
    <span className={`material-symbols-outlined ${fill ? "spm-icon-fill" : ""} ${className}`} aria-hidden>
      {name}
    </span>
  );
}

export function SpmContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`spm-container ${className}`}>{children}</div>;
}

export function SpmImageFrame({
  variant,
  className = "",
  children,
}: {
  variant: SpmImageVariant;
  className?: string;
  children: ReactNode;
}) {
  const config = SPM_IMAGE_VARIANTS[variant];
  return <div className={`${config.frameClassName} ${className}`.trim()}>{children}</div>;
}

export function SpmImg({
  src,
  alt,
  className = "",
  frameClassName = "",
  fill,
  width,
  height,
  priority,
  sizes,
  variant,
  responsive = true,
}: {
  src: string;
  alt: string;
  className?: string;
  /** Extra classes on the variant frame wrapper. */
  frameClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  /** Preset responsive frame + intrinsic dimensions. */
  variant?: SpmImageVariant;
  /** Scale width/height images down inside their container (default: true). */
  responsive?: boolean;
}) {
  const imageClassName = `${spmResponsiveImageClassName(responsive)} ${className}`.trim();

  if (variant) {
    const config = SPM_IMAGE_VARIANTS[variant];
    return (
      <div className={`${config.frameClassName} ${frameClassName}`.trim()}>
        <Image
          src={src}
          alt={alt}
          fill
          className={imageClassName}
          sizes={sizes ?? config.sizes}
          priority={priority}
        />
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={imageClassName}
        sizes={sizes ?? SPM_IMAGE_SIZES.productCard}
        priority={priority}
      />
    );
  }

  const resolvedWidth = width ?? 400;
  const resolvedHeight = height ?? 400;

  return (
    <Image
      src={src}
      alt={alt}
      width={resolvedWidth}
      height={resolvedHeight}
      className={imageClassName}
      sizes={sizes ?? `(max-width: ${resolvedWidth}px) 100vw, ${resolvedWidth}px`}
      priority={priority}
    />
  );
}

export function SpmCartButton({ className = "" }: { className?: string }) {
  const { itemCount, toggleCart } = useSpmCart();
  return (
    <button
      type="button"
      onClick={toggleCart}
      className={`relative rounded-full p-2 transition-all hover:bg-[var(--spm-surface-container)] active:scale-95 ${className}`}
      aria-label={`Shopping cart, ${itemCount} items`}
    >
      <SpmIcon name="shopping_cart" className="text-[var(--spm-primary)]" />
      {itemCount > 0 ? (
        <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--spm-secondary)] text-[10px] font-bold text-white">
          {itemCount}
        </span>
      ) : null}
    </button>
  );
}

export function SpmNav() {
  const pathname = usePathname();
  const path = pathname.replace(/\/$/, "") || "/";
  const isAccount = path === SPM_PATHS.account;
  const { isLoggedIn } = useSpmAuth();

  const navLinkClass = (active: boolean, compact = false) =>
    `${compact ? "spm-label-sm whitespace-nowrap" : "spm-body-md"} font-medium transition-colors duration-200 ${
      active
        ? "border-b-2 border-[var(--spm-primary)] pb-1 font-bold text-[var(--spm-primary)]"
        : "text-[var(--spm-on-surface-variant)] hover:text-[var(--spm-secondary)]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--spm-outline-variant)] bg-[var(--spm-background)] shadow-sm">
      <div className="spm-nav-inner flex items-center justify-between gap-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-4 xl:gap-8">
          <Link href={SPM_PATHS.home} className="spm-headline-lg shrink-0 text-[var(--spm-secondary)]">
            {SPM_SITE}
          </Link>
          <nav className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-1 md:flex lg:gap-5 xl:gap-6" aria-label="Main">
            {SPM_NAV_ITEMS.map((item) => {
              const active = isSpmNavActive(pathname, item.key);
              return (
                <Link key={item.key} href={item.href} className={`${navLinkClass(active)} whitespace-nowrap`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <SaturdayPetMarketNavSearch />
          {isLoggedIn ? <SpmCartButton /> : null}
          {isLoggedIn ? (
            isAccount ? (
              <span className="hidden rounded-full bg-[var(--spm-primary)] px-4 py-1 text-sm font-bold text-[var(--spm-on-primary)] md:inline">
                My Profile
              </span>
            ) : (
              <Link
                href={SPM_PATHS.account}
                className="hidden rounded-full bg-[var(--spm-primary)] px-4 py-1 text-sm font-bold text-[var(--spm-on-primary)] transition-transform hover:scale-95 md:inline"
              >
                My Profile
              </Link>
            )
          ) : (
            <Link
              href={SPM_PATHS.login}
              className="hidden rounded-full border-2 border-[var(--spm-primary)] px-4 py-1 text-sm font-bold text-[var(--spm-primary)] transition-transform hover:scale-95 hover:bg-[var(--spm-primary-fixed)] md:inline"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
      <div className="border-t border-[var(--spm-outline-variant)] md:hidden">
        <div className="spm-nav-inner py-2">
          <nav className="flex gap-4 overflow-x-auto pb-1" aria-label="Mobile">
            {SPM_NAV_ITEMS.map((item) => {
              const active = isSpmNavActive(pathname, item.key);
              return (
                <Link key={item.key} href={item.href} className={navLinkClass(active, true)}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

export type SpmFooterVariant =
  | "home"
  | "shop"
  | "cart"
  | "product"
  | "account"
  | "rewards"
  | "community"
  | "resources"
  | "locations"
  | "contact"
  | "faq";

export function SpmFooter({ variant = "home" }: { variant?: SpmFooterVariant }) {
  if (variant === "account") {
    return (
      <footer className="mt-16 border-t border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container)]">
        <SpmContainer className="grid grid-cols-1 gap-6 py-12 md:grid-cols-4">
          <div>
            <span className="spm-headline-md mb-2 block text-[var(--spm-primary)]">{SPM_SITE}</span>
            <p className="spm-body-md mb-4 text-sm text-[var(--spm-on-surface-variant)]">
              Bringing the joy of a Saturday morning stroll to your doorstep since 1989.
            </p>
            <div className="flex gap-2">
              {["f", "t", "i"].map((label) => (
                <span
                  key={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--spm-secondary)] text-sm font-bold text-white"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="spm-headline-md mb-4 text-sm text-[var(--spm-secondary)]">Quick Links</h4>
            <SpmQuickLinksNav />
          </div>
          <div>
            <h4 className="spm-headline-md mb-4 text-sm text-[var(--spm-secondary)]">Legal Stuff</h4>
            <ul className="space-y-1 text-[var(--spm-on-surface-variant)]">
              {["Privacy Policy", "Terms of Service", "Refunds & Returns"].map((l) => (
                <li key={l}>
                  <span className="hover:text-[var(--spm-primary)]">{l}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="spm-coupon-border rounded-lg bg-[var(--spm-primary-container)] p-4 text-[var(--spm-on-primary-container)]">
            <p className="spm-headline-md mb-1 text-sm">Join the Kennel!</p>
            <p className="mb-4 text-xs">Sign up for our newsletter and get a digital &quot;treat&quot; on your first order.</p>
            <div className="flex gap-1">
              <input className="flex-1 rounded-full border-none px-2 py-1 text-xs" placeholder="email@example.com" type="email" />
              <button type="button" className="rounded-full bg-[var(--spm-secondary)] px-4 py-1 text-xs font-bold text-white">
                JOIN
              </button>
            </div>
          </div>
        </SpmContainer>
        <div className="bg-[var(--spm-secondary)] py-2 text-center text-xs text-[var(--spm-on-secondary)]">
          © 1989 Saturday Morning Pet Market. Locally Owned &amp; Operated.
        </div>
      </footer>
    );
  }

  if (variant === "rewards") {
    return (
      <footer className="mt-16 rounded-t-lg bg-[var(--spm-surface-container)]">
        <SpmContainer className="grid grid-cols-1 gap-6 py-12 md:grid-cols-4">
          <div>
            <span className="spm-headline-md mb-2 block text-[var(--spm-primary)]">{SPM_SITE}</span>
            <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
              Punch cards, Paws Points, and neighborhood perks — loyalty the Saturday Morning way.
            </p>
          </div>
          <div>
            <h4 className="spm-headline-md mb-4 text-[var(--spm-secondary)]">Quick Links</h4>
            <SpmQuickLinksNav className="space-y-1" />
          </div>
          <div>
            <h4 className="spm-headline-md mb-4 text-[var(--spm-secondary)]">Member Hub</h4>
            <ul className="space-y-1">
              <li>
                <Link href={SPM_PATHS.rewards} className="font-bold text-[var(--spm-primary)]">
                  How Rewards Work
                </Link>
              </li>
              <li>
                <Link href={SPM_PATHS.account} className="text-[var(--spm-on-surface-variant)] hover:text-[var(--spm-primary)]">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href={SPM_PATHS.login} className="text-[var(--spm-on-surface-variant)] hover:text-[var(--spm-primary)]">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="spm-headline-md mb-4 text-[var(--spm-secondary)]">Our Hours</h4>
            <div className="spm-body-md space-y-1 text-[var(--spm-on-surface-variant)]">
              <p>Mon - Fri: 9am - 8pm</p>
              <p>Sat: 8am - 9pm</p>
              <p>Sun: 10am - 6pm</p>
            </div>
          </div>
        </SpmContainer>
        <div className="border-t border-[var(--spm-outline-variant)] py-4 text-center">
          <p className="spm-label-sm text-[var(--spm-on-surface-variant)]">
            © 1989 Saturday Morning Pet Market. Locally Owned &amp; Operated.
          </p>
        </div>
      </footer>
    );
  }

  if (variant === "community") {
    return (
      <footer className="mt-16 rounded-t-lg bg-[var(--spm-surface-container)]">
        <SpmContainer className="grid grid-cols-1 gap-6 py-12 md:grid-cols-4">
          <div>
            <span className="spm-headline-md mb-2 block text-[var(--spm-primary)]">{SPM_SITE}</span>
            <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
              Your neighborhood spot for fresh food, local friends, and happy tails.
            </p>
            <div className="mt-4 flex gap-2">
              {["public", "thumb_up"].map((icon) => (
                <span key={icon} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--spm-primary)]">
                  <SpmIcon name={icon} />
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="spm-headline-md mb-2 text-[var(--spm-secondary)]">Navigation</h4>
            <ul className="space-y-1">
              <li>
                <Link href={SPM_PATHS.shop} className="text-[var(--spm-on-surface-variant)] hover:text-[var(--spm-primary)]">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href={SPM_PATHS.community} className="font-bold text-[var(--spm-on-secondary-fixed-variant)] underline">
                  Community Hub
                </Link>
              </li>
              <li>
                <Link href={SPM_PATHS.rewards} className="text-[var(--spm-on-surface-variant)] hover:text-[var(--spm-primary)]">
                  Rewards Program
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="spm-headline-md mb-2 text-[var(--spm-secondary)]">Resources</h4>
            <SpmQuickLinksNav active="Resource Center" className="space-y-1" />
          </div>
          <div>
            <h4 className="spm-headline-md mb-2 text-[var(--spm-secondary)]">Our Hours</h4>
            <div className="spm-body-md space-y-1 text-[var(--spm-on-surface-variant)]">
              <p className="flex justify-between">
                <span>Mon-Fri:</span> <span>9am - 8pm</span>
              </p>
              <p className="flex justify-between font-bold text-[var(--spm-primary)]">
                <span>Sat:</span> <span>8am - 6pm</span>
              </p>
              <p className="flex justify-between">
                <span>Sun:</span> <span>10am - 5pm</span>
              </p>
            </div>
          </div>
        </SpmContainer>
        <div className="border-t border-[var(--spm-outline-variant)] py-4 text-center">
          <p className="spm-label-sm text-[var(--spm-on-surface-variant)] opacity-70">
            © 1989 Saturday Morning Pet Market. Locally Owned &amp; Operated.
          </p>
        </div>
      </footer>
    );
  }

  if (variant === "resources") {
    return (
      <footer className="mt-16 rounded-t-lg bg-[var(--spm-surface-container)]">
        <SpmContainer className="grid grid-cols-1 gap-6 py-12 md:grid-cols-4">
          <div>
            <div className="spm-headline-md mb-2 text-[var(--spm-primary)]">{SPM_SITE}</div>
            <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
              Your neighborhood spot for fresh food, honest advice, and wagging tails since 1989.
            </p>
          </div>
          <div>
            <h4 className="spm-headline-md mb-2 text-[var(--spm-secondary)]">Resources</h4>
            <SpmQuickLinksNav active="Resource Center" className="flex flex-col gap-1" />
          </div>
          <div>
            <h4 className="spm-headline-md mb-2 text-[var(--spm-secondary)]">Community</h4>
            <ul className="flex flex-col gap-1 text-[var(--spm-on-surface-variant)]">
              {["Adoption Events", "Local Vets", "Pet of the Month"].map((l) => (
                <li key={l}>
                  <span className="hover:text-[var(--spm-primary)]">{l}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="spm-headline-md mb-2 text-[var(--spm-secondary)]">Connect</h4>
            <div className="mb-4 flex gap-2">
              {["chat", "share", "mail"].map((icon) => (
                <span
                  key={icon}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[var(--spm-surface-container-highest)] hover:bg-[var(--spm-primary)] hover:text-white"
                >
                  <SpmIcon name={icon} />
                </span>
              ))}
            </div>
            <p className="spm-body-md text-[var(--spm-on-surface-variant)] opacity-60">
              © 1989 Saturday Morning Pet Market. Locally Owned &amp; Operated.
            </p>
          </div>
        </SpmContainer>
      </footer>
    );
  }

  if (variant === "locations") {
    return (
      <footer className="mt-16 rounded-t-lg bg-[var(--spm-surface-container)]">
        <SpmContainer className="grid grid-cols-1 gap-6 py-12 md:grid-cols-4">
          <div>
            <div className="spm-headline-md mb-4 text-[var(--spm-primary)]">{SPM_SITE}</div>
            <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
              The original neighborhood choice for happy tails and healthy purrs. Locally owned since 1989.
            </p>
          </div>
          <div>
            <h4 className="spm-headline-md mb-2 text-[var(--spm-on-surface)]">Quick Links</h4>
            <SpmQuickLinksNav active="Locations" className="flex flex-col gap-1" activeClassName="font-bold text-[var(--spm-on-secondary-fixed-variant)] underline" />
          </div>
          <div>
            <h4 className="spm-headline-md mb-2 text-[var(--spm-on-surface)]">Social Community</h4>
            <div className="flex gap-2">
              {["camera", "chat", "group"].map((icon) => (
                <span key={icon} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--spm-surface-container-highest)] text-[var(--spm-primary)] hover:bg-[var(--spm-primary)] hover:text-white">
                  <SpmIcon name={icon} />
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="spm-headline-md mb-2 text-[var(--spm-on-surface)]">Visit Us</h4>
            <p className="spm-body-md italic text-[var(--spm-on-surface-variant)]">&quot;The treats are fresh and the people are friendly!&quot;</p>
            <p className="spm-label-sm mt-2 text-[var(--spm-on-surface)]">— Martha &amp; Buddy the Beagle</p>
          </div>
        </SpmContainer>
        <div className="border-t border-[var(--spm-outline-variant)]/30 py-4 text-center">
          <p className="spm-label-sm text-[var(--spm-on-surface-variant)] opacity-70">
            © 1989 Saturday Morning Pet Market. Locally Owned &amp; Operated.
          </p>
        </div>
      </footer>
    );
  }

  if (variant === "contact") {
    return (
      <footer className="mt-16 rounded-t-lg bg-[var(--spm-surface-container)]">
        <SpmContainer className="grid grid-cols-1 gap-6 py-12 md:grid-cols-4">
          <div>
            <div className="spm-headline-md mb-4 text-[var(--spm-primary)]">{SPM_SITE}</div>
            <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
              Quality treats and community for your local furry friends since 1989.
            </p>
          </div>
          <div>
            <div className="spm-headline-md mb-2 text-[var(--spm-secondary)]">Quick Links</div>
            <SpmQuickLinksNav active="Contact" className="flex flex-col gap-1" />
          </div>
          <div>
            <div className="spm-headline-md mb-2 text-[var(--spm-secondary)]">Shop Categories</div>
            <nav className="flex flex-col gap-1 text-[var(--spm-on-surface-variant)]">
              {["Dog Supplies", "Cat Supplies", "Bird & Small Pet", "Special Offers"].map((l) => (
                <span key={l}>{l}</span>
              ))}
            </nav>
          </div>
          <div>
            <div className="spm-headline-md mb-2 text-[var(--spm-secondary)]">Connect</div>
            <div className="flex gap-4">
              {["face_nod", "photo_camera", "share"].map((icon) => (
                <SpmIcon key={icon} name={icon} className="cursor-pointer text-[var(--spm-primary)] hover:scale-110" />
              ))}
            </div>
            <p className="spm-body-md mt-4 text-[var(--spm-on-surface-variant)]">
              © 1989 Saturday Morning Pet Market. Locally Owned &amp; Operated.
            </p>
          </div>
        </SpmContainer>
      </footer>
    );
  }

  if (variant === "faq") {
    return (
      <footer className="bg-[var(--spm-surface-container)]">
        <SpmContainer className="grid grid-cols-1 gap-6 py-12 md:grid-cols-4">
          <div className="space-y-4">
            <div className="spm-headline-md text-[var(--spm-primary)]">{SPM_SITE}</div>
            <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
              Bringing joy to neighborhood pets since 1989. Visit us for locally-sourced goods and community spirit.
            </p>
            <div className="flex gap-4 text-[var(--spm-secondary)]">
              {["face_nod", "photo_camera", "share"].map((icon) => (
                <SpmIcon key={icon} name={icon} className="cursor-pointer hover:text-[var(--spm-primary)]" />
              ))}
            </div>
          </div>
          <div>
            <h5 className="spm-headline-md text-[var(--spm-secondary)]">Quick Links</h5>
            <SpmQuickLinksNav active="FAQ" className="mt-2 space-y-1" />
          </div>
          <div>
            <h5 className="spm-headline-md text-[var(--spm-secondary)]">Market Hours</h5>
            <ul className="spm-body-md mt-2 space-y-1 text-[var(--spm-on-surface-variant)]">
              <li>Mon - Fri: 8am - 8pm</li>
              <li>Saturday: 7am - 9pm</li>
              <li>Sunday: 9am - 6pm</li>
            </ul>
          </div>
          <div>
            <h5 className="spm-headline-md text-[var(--spm-secondary)]">Find Us</h5>
            <div className="relative mt-2 h-32 overflow-hidden rounded-md border border-[var(--spm-outline-variant)] grayscale">
              <SpmImg src={SPM_IMG.faq.map} alt="Store location map" fill className="object-cover" sizes="300px" />
            </div>
            <p className="spm-label-sm mt-2 text-[var(--spm-on-surface-variant)]">
              © 1989 Saturday Morning Pet Market. Locally Owned &amp; Operated.
            </p>
          </div>
        </SpmContainer>
      </footer>
    );
  }

  if (variant === "cart") {
    return (
      <footer className="mt-16 border-t-2 border-dashed border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container)]">
        <SpmContainer className="grid grid-cols-1 gap-6 py-12 md:grid-cols-4">
          <div>
            <span className="spm-headline-md mb-4 block text-[var(--spm-primary)]">{SPM_SITE}</span>
            <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
              Bringing the neighborhood charm to your pet&apos;s doorstep since 1989.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-bold text-[var(--spm-secondary)]">SHOPPING</h4>
            <ul className="space-y-2 text-[var(--spm-on-surface-variant)]">
              {["Dog Supplies", "Cat Supplies", "Small Pets", "New Arrivals"].map((l) => (
                <li key={l}>
                  <span className="hover:text-[var(--spm-primary)]">{l}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold text-[var(--spm-secondary)]">RESOURCES</h4>
            <SpmQuickLinksNav className="space-y-2" />
          </div>
          <div>
            <h4 className="mb-4 font-bold text-[var(--spm-secondary)]">NEWSLETTER</h4>
            <p className="mb-2 text-sm text-[var(--spm-on-surface-variant)]">Get treat alerts and event invites!</p>
            <input
              className="mb-2 w-full rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-lowest)] px-3 py-1 text-sm"
              placeholder="Your email..."
              type="email"
            />
            <button type="button" className="w-full rounded-lg bg-[var(--spm-primary)] py-1 font-bold text-[var(--spm-on-primary)]">
              Join the Pack
            </button>
          </div>
        </SpmContainer>
        <div className="border-t border-[var(--spm-outline-variant)] py-4 text-center">
          <p className="spm-label-sm text-[var(--spm-on-surface-variant)]">
            © 1989 Saturday Morning Pet Market. Locally Owned &amp; Operated.
          </p>
        </div>
      </footer>
    );
  }

  if (variant === "shop") {
    return (
      <footer className="mt-16 rounded-t-lg bg-[var(--spm-surface-container)]">
        <SpmContainer className="grid grid-cols-1 gap-6 py-12 md:grid-cols-4">
          <div>
            <span className="spm-headline-md mb-4 block text-[var(--spm-primary)]">{SPM_SITE}</span>
            <p className="spm-body-md mb-4 text-[var(--spm-on-surface-variant)]">
              Bringing the joy of the Saturday morning market to you and your best friends since 1989.
            </p>
            <div className="flex gap-2">
              {["star", "favorite", "share"].map((icon) => (
                <span
                  key={icon}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--spm-secondary)] text-[var(--spm-on-secondary)]"
                >
                  <SpmIcon name={icon} className="text-[20px]" />
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="spm-headline-md mb-4 text-[var(--spm-secondary)]">Quick Links</h4>
            <SpmQuickLinksNav className="space-y-1" linkClassName="spm-body-md text-[var(--spm-on-surface-variant)] hover:text-[var(--spm-primary)]" />
          </div>
          <div>
            <h4 className="spm-headline-md mb-4 text-[var(--spm-secondary)]">Our Hours</h4>
            <div className="spm-body-md space-y-1 text-[var(--spm-on-surface-variant)]">
              <p className="flex justify-between">
                <span>Mon - Fri:</span> <span>9am - 8pm</span>
              </p>
              <p className="flex justify-between">
                <span>Saturday:</span> <span>8am - 9pm</span>
              </p>
              <p className="flex justify-between">
                <span>Sunday:</span> <span>10am - 6pm</span>
              </p>
            </div>
          </div>
          <div>
            <h4 className="spm-headline-md mb-4 text-[var(--spm-secondary)]">Stay Updated</h4>
            <div className="flex">
              <input
                className="spm-body-md w-full rounded-l-full border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-lowest)] px-4 py-1"
                placeholder="Email address"
                type="email"
              />
              <button type="button" className="rounded-r-full bg-[var(--spm-primary)] px-4 text-[var(--spm-on-primary)]">
                Join
              </button>
            </div>
          </div>
        </SpmContainer>
        <div className="border-t border-[var(--spm-outline-variant)] py-4 text-center opacity-70">
          <p className="spm-label-sm text-[var(--spm-on-surface-variant)]">
            © 1989 Saturday Morning Pet Market. Locally Owned &amp; Operated. Built for Wagging Tails.
          </p>
        </div>
      </footer>
    );
  }

  if (variant === "product") {
    return (
      <footer className="mt-16 rounded-t-lg bg-[var(--spm-surface-container)]">
        <SpmContainer className="grid grid-cols-1 gap-6 py-12 md:grid-cols-4">
          <div className="space-y-4">
            <div className="spm-headline-md text-[var(--spm-primary)]">{SPM_SITE}</div>
            <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
              Celebrating 35 years of happy tails and morning purrs in our neighborhood.
            </p>
            <div className="flex gap-2">
              {["alternate_email", "call", "location_on"].map((icon) => (
                <span
                  key={icon}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--spm-primary)] text-[var(--spm-on-primary)]"
                >
                  <SpmIcon name={icon} />
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="spm-headline-md mb-4 text-[var(--spm-secondary)]">Quick Links</h4>
            <SpmQuickLinksNav className="space-y-1" />
          </div>
          <div>
            <h4 className="spm-headline-md mb-4 text-[var(--spm-secondary)]">Categories</h4>
            <ul className="space-y-1 text-[var(--spm-on-surface-variant)]">
              {["Dog Supplies", "Cat Supplies", "Bird & Small Pet", "Special Offers"].map((l) => (
                <li key={l}>
                  <span className="hover:text-[var(--spm-primary)]">{l}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2 rounded-lg bg-[var(--spm-primary-container)] p-4">
            <h4 className="spm-headline-md text-[var(--spm-on-primary-container)]">Morning Newsletter</h4>
            <p className="spm-label-sm text-[var(--spm-on-primary-container)]">
              Get fresh treat alerts and local pet news every Saturday morning.
            </p>
            <div className="flex gap-1">
              <input
                className="w-full rounded-md border-none px-2 py-1 text-[var(--spm-on-background)] outline-none focus:ring-2 focus:ring-[var(--spm-secondary)]"
                placeholder="Email Address"
                type="email"
              />
              <button type="button" className="rounded-md bg-[var(--spm-secondary)] px-2 text-[var(--spm-on-secondary)]">
                <SpmIcon name="send" />
              </button>
            </div>
          </div>
        </SpmContainer>
        <div className="border-t border-[var(--spm-outline-variant)] py-4 text-center">
          <p className="spm-label-sm text-[var(--spm-on-surface-variant)]">
            © 1989 Saturday Morning Pet Market. Locally Owned &amp; Operated.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-16 rounded-t-lg bg-[var(--spm-surface-container)]">
      <SpmContainer className="grid grid-cols-1 gap-6 py-12 md:grid-cols-4">
        <div>
          <span className="spm-headline-md mb-4 inline-block text-[var(--spm-primary)]">{SPM_SITE}</span>
          <p className="spm-body-md mb-6 text-[var(--spm-on-surface-variant)]">
            Your neighborhood destination for healthy pets and happy families since 1989.
          </p>
          <div className="flex gap-4">
            {["face_nod", "camera", "video_library"].map((icon) => (
              <SpmIcon key={icon} name={icon} className="text-[var(--spm-primary)] transition-transform hover:scale-110" />
            ))}
          </div>
        </div>
        <div>
          <h4 className="spm-headline-md mb-4 text-[var(--spm-on-surface)]">Quick Links</h4>
          <SpmQuickLinksNav className="space-y-2" linkClassName="spm-body-md text-[var(--spm-on-surface-variant)] hover:text-[var(--spm-primary)]" />
        </div>
        <div>
          <h4 className="spm-headline-md mb-4 text-[var(--spm-on-surface)]">Market Hours</h4>
          <ul className="spm-body-md space-y-2 text-[var(--spm-on-surface-variant)]">
            <li className="flex justify-between">
              <span>Mon - Fri</span> <span>9:00 - 8:00</span>
            </li>
            <li className="flex justify-between font-bold text-[var(--spm-primary)]">
              <span>Saturday</span> <span>8:00 - 9:00</span>
            </li>
            <li className="flex justify-between">
              <span>Sunday</span> <span>10:00 - 6:00</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="spm-headline-md mb-4 text-[var(--spm-on-surface)]">Visit Our Store</h4>
          <p className="spm-body-md mb-4 text-[var(--spm-on-surface-variant)]">
            123 Nostalgia Lane
            <br />
            Maplewood Heights, VT 05401
          </p>
          <div className="relative h-32 overflow-hidden rounded-lg border border-[var(--spm-outline-variant)]">
            <SpmImg src={SPM_IMG.home.map} alt="Store location map" fill className="object-cover" sizes="300px" />
          </div>
        </div>
      </SpmContainer>
      <div className="border-t border-[var(--spm-outline-variant)] py-4 text-center md:text-left">
        <SpmContainer>
          <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
            © 1989 Saturday Morning Pet Market. Locally Owned &amp; Operated.
          </p>
        </SpmContainer>
      </div>
    </footer>
  );
}

export function SpmPriceTag({
  price,
  salePrice,
  variant = "hole",
  className = "",
}: {
  price: number;
  salePrice?: number;
  variant?: "hole" | "cutout";
  className?: string;
}) {
  const display = salePrice ?? price;
  return (
    <div
      className={`relative bg-[var(--spm-secondary)] px-6 py-1 text-[var(--spm-on-secondary)] ${
        variant === "hole" ? "spm-price-tag-hole rounded-full" : "spm-price-tag-cutout rounded-sm pl-8"
      } spm-label-price ${className}`}
    >
      {salePrice ? (
        <>
          <span className="mr-1 text-sm font-normal line-through opacity-70">{`$${price.toFixed(2)}`}</span>
          {`$${display.toFixed(2)}`}
        </>
      ) : (
        `$${display.toFixed(2)}`
      )}
    </div>
  );
}
