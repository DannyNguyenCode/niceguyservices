import Image from "next/image";
import { LT_CAFE_IMAGES } from "./looneytoonsCafeImages";

type MenuItem = {
  name: string;
  price: string;
  description: string;
  image: string;
  alt: string;
  badge?: { text: string; className: string; rotate?: string; side: "left" | "right" };
};

const MENU_ITEMS: MenuItem[] = [
  {
    name: "Flat White",
    price: "$5.95",
    description: "Micro-foam steamed milk poured over a double shot of our signature house roast.",
    image: LT_CAFE_IMAGES.menuFlatWhite,
    alt: "Flat white coffee with latte art",
  },
  {
    name: "Iced Matcha Latte",
    price: "$7.95",
    description: "Premium ceremonial grade matcha whisked to perfection and served over ice.",
    image: LT_CAFE_IMAGES.menuMatcha,
    alt: "Iced matcha latte",
  },
  {
    name: "Banana Iced Matcha",
    price: "$8.95",
    description: "Our signature matcha with a sweet, creamy banana-milk fusion.",
    image: LT_CAFE_IMAGES.menuBananaMatcha,
    alt: "Banana iced matcha",
    badge: {
      text: "BARISTA'S CHOICE",
      className: "bg-[#5d5f5f] text-white",
      rotate: "-rotate-[5deg]",
      side: "left" as const,
    },
  },
  {
    name: "Mango Iced Matcha",
    price: "$8.75",
    description: "A tropical twist on a classic, featuring real Alphonso mango purée.",
    image: LT_CAFE_IMAGES.menuMangoMatcha,
    alt: "Mango iced matcha",
  },
  {
    name: "Turkey Chipotle",
    price: "$13.95",
    description: "Roasted turkey breast, spicy chipotle aioli, and fresh greens on sourdough.",
    image: LT_CAFE_IMAGES.menuTurkey,
    alt: "Turkey chipotle sandwich",
    badge: { text: "HOT ITEM", className: "bg-[#ba1a1a] text-white", rotate: "rotate-[5deg]", side: "right" as const },
  },
  {
    name: "Cappuccino",
    price: "$5.95",
    description: "Equal parts espresso, steamed milk, and rich foam. Simple and sophisticated.",
    image: LT_CAFE_IMAGES.menuCappuccino,
    alt: "Cappuccino",
  },
];

export function LooneyToonsCafeMenuBody() {
  return (
    <main className="min-h-screen bg-[#f9f9ff] text-[#151c28] selection:bg-[#495E84] selection:text-white">
      <section className="relative overflow-hidden bg-[#e9edff] px-4 py-16 md:px-16">
        <div className="relative z-10 mx-auto max-w-[1280px] text-center md:text-left">
          <h1 className="mb-4 font-extrabold uppercase italic text-[#151c28] [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl leading-10 md:text-[84px] md:leading-[90px] md:tracking-[-0.04em]">
            Crafted &amp; Kinetic
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif] md:mx-0">
            Premium artisanal coffee meets mid-century kinetic energy. Explore our curated menu of high-contrast
            flavors.
          </p>
          <div className="relative inline-block">
            <div className="pointer-events-none absolute inset-0 translate-x-1 translate-y-1 rounded-full bg-black" aria-hidden />
            <a
              href="#order"
              className="relative inline-block rounded-full border-2 border-black bg-[#495E84] px-8 py-4 text-lg font-bold text-white transition-all hover:translate-x-0.5 hover:translate-y-0.5 [font-family:var(--font-lt-space),system-ui,sans-serif]"
            >
              View specials
            </a>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full border-[12px] border-[#151c28] opacity-10" aria-hidden />
      </section>

      <div className="relative h-20 bg-[#e9edff]">
        <div className="absolute inset-0 rounded-t-[100px] border-t-4 border-[#151c28] bg-[#f9f9ff]" />
      </div>

      <section id="order" className="scroll-mt-24 bg-[#f9f9ff] px-4 py-12 md:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-16 flex flex-col items-end justify-between gap-4 md:flex-row">
            <div>
              <span className="mb-4 inline-block rounded-full border-2 border-black bg-[#495E84] px-3 py-1 text-xs font-bold text-white">
                The roasts
              </span>
              <h2 className="font-bold text-[#151c28] [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl md:text-5xl">
                Signature brews
              </h2>
            </div>
            <div className="flex gap-2 opacity-50">
              <span className="material-symbols-outlined text-4xl text-[#444748]" aria-hidden>
                coffee
              </span>
              <span className="material-symbols-outlined text-4xl text-[#444748]" aria-hidden>
                bolt
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {MENU_ITEMS.map((item) => (
              <div
                key={item.name}
                className="group relative border-4 border-[#151c28] bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                {item.badge ? (
                  <div
                    className={`absolute z-10 border-2 border-black px-4 py-1 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] [font-family:var(--font-lt-space),system-ui,sans-serif] ${item.badge.className} ${item.badge.rotate ?? ""} ${item.badge.side === "left" ? "-left-4 -top-4" : "-right-4 -top-4"}`}
                  >
                    {item.badge.text}
                  </div>
                ) : null}
                <div className="lt-retro-tv-menu relative mb-6 h-64 w-full border-2 border-[#151c28] bg-[#dde2f4]">
                  <div className="lt-halftone absolute inset-0" aria-hidden />
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className={`object-cover transition-transform duration-500 group-hover:scale-110 ${item.name === "Flat White" ? "grayscale-[20%]" : ""}`}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-bold uppercase tracking-tight text-[#151c28] [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-2xl">
                    {item.name}
                  </h3>
                  <span className="text-xl font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]">
                    {item.price}
                  </span>
                </div>
                <p className="mb-6 h-12 overflow-hidden text-base text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                  {item.description}
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center rounded-full border-2 border-[#151c28] bg-[#f9f9ff] px-3 py-1">
                    <button type="button" className="material-symbols-outlined text-sm" aria-label="Decrease quantity (demo)">
                      remove
                    </button>
                    <span className="mx-4 font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]">1</span>
                    <button type="button" className="material-symbols-outlined text-sm" aria-label="Increase quantity (demo)">
                      add
                    </button>
                  </div>
                  <button
                    type="button"
                    className="flex-1 rounded-full border-2 border-[#151c28] bg-[#495E84] py-3 font-bold text-white transition-transform [font-family:var(--font-lt-space),system-ui,sans-serif] hover:scale-95 active:scale-90"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside
        className="pointer-events-none fixed inset-y-0 right-0 z-[45] flex w-80 translate-x-full flex-col border-l-4 border-[#151c28] bg-[#f9f9ff]/80 p-6 shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)] backdrop-blur-xl md:w-96"
        aria-hidden
      >
        <div className="flex items-center justify-between border-b-2 border-[#151c28] pb-4">
          <h2 className="text-2xl font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif]">Your cart</h2>
          <span className="material-symbols-outlined">close</span>
        </div>
        <p className="mt-4 text-sm text-[#444748]">Demo — cart drawer is visual only.</p>
      </aside>
    </main>
  );
}
