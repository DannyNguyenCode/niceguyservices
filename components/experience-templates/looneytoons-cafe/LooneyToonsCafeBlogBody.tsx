import Image from "next/image";
import { LT_CAFE_IMAGES } from "./looneytoonsCafeImages";

const POSTS = [
  {
    tag: "Matcha culture",
    read: "5 min read",
    title: "Beyond the whisk: ceremonial mastery",
    excerpt: "We traveled to Uji to source the finest tencha leaves. Here is why the grade of your matcha matters more than you think.",
    img: LT_CAFE_IMAGES.blogCard1,
    alt: "Matcha whisking",
  },
  {
    tag: "Rubberhose lifestyle",
    read: "8 min read",
    title: "Comet Cup Co.: the new Inkwell Pier yarn",
    excerpt: "Exploring how we storyboarded a kinetic hub for creators, dreamers, and caffeine fiends alike — demo copy only.",
    img: LT_CAFE_IMAGES.blogCard2,
    alt: "Cafe interior",
  },
  {
    tag: "Coffee education",
    read: "12 min read",
    title: "Grind size: the variable that matters",
    excerpt: "Master the grind. From coarse French press to the finest espresso dust, learn how to dial in your morning ritual.",
    img: LT_CAFE_IMAGES.blogCard3,
    alt: "Coffee grinder",
  },
] as const;

export function LooneyToonsCafeBlogBody() {
  return (
    <main className="mx-auto max-w-[1280px] bg-[#f9f9ff] px-4 py-12 text-[#151c28] selection:bg-[#495E84] selection:text-white md:px-16">
      <section className="mb-20">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="relative aspect-4/3 lg:col-span-7">
            <div className="lt-retro-tv-mask relative h-full min-h-[240px] border-4 border-[#151c28] bg-[#dde2f4] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <Image
                src={LT_CAFE_IMAGES.blogFeatured}
                alt="Latte pour"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="relative inline-block w-fit rounded-full border-2 border-[#151c28] bg-[#495E84] px-4 py-1 text-sm font-bold text-white [font-family:var(--font-lt-space),system-ui,sans-serif] after:absolute after:-bottom-2.5 after:left-5 after:border-l-[10px] after:border-r-[10px] after:border-t-[10px] after:border-l-transparent after:border-r-transparent after:border-t-black after:content-['']">
              Featured story
            </div>
            <h1 className="font-bold leading-tight [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl md:text-5xl">
              The art of the perfect Comet pour
            </h1>
            <p className="text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
              Discover the obsessive science behind our signature espresso blend and how we achieve the perfect micro-foam
              every single time.
            </p>
            <button
              type="button"
              className="w-fit rounded-full border-2 border-[#151c28] bg-[#495E84] px-8 py-3 text-sm font-bold text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:scale-95 [font-family:var(--font-lt-space),system-ui,sans-serif]"
            >
              Read full story
            </button>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="relative w-full md:w-96">
            <input
              className="lt-hard-shadow h-14 w-full rounded-full border-2 border-[#151c28] bg-white px-6 pr-14 text-sm font-bold focus:border-[#495E84] focus:ring-0 focus:outline-none [font-family:var(--font-lt-space),system-ui,sans-serif]"
              placeholder="Search the archives..."
              type="search"
              readOnly
              aria-label="Search (demo)"
            />
            <span className="material-symbols-outlined pointer-events-none absolute right-6 top-4 text-[#151c28]" aria-hidden>
              search
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {["All posts", "Coffee education", "Matcha culture", "Rubberhose lifestyle"].map((label, i) => (
              <button
                key={label}
                type="button"
                className={
                  i === 0
                    ? "rounded-full border-2 border-[#151c28] bg-[#5d5f5f] px-6 py-2 text-sm font-bold text-white transition-transform hover:scale-95 [font-family:var(--font-lt-space),system-ui,sans-serif]"
                    : "rounded-full border-2 border-[#151c28] bg-white px-6 py-2 text-sm font-bold text-[#151c28] transition-colors hover:bg-[#e9edff] [font-family:var(--font-lt-space),system-ui,sans-serif]"
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post) => (
          <article key={post.title} className="group flex flex-col">
            <div className="lt-retro-tv-mask relative mb-6 aspect-4/3 overflow-hidden border-4 border-[#151c28] bg-[#dde2f4] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 group-hover:-translate-y-2">
              <Image src={post.img} alt={post.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full border-2 border-[#151c28] bg-[#dde2f4] px-3 py-0.5 text-[10px] font-black uppercase">
                {post.tag}
              </span>
              <span className="text-xs font-bold opacity-60 [font-family:var(--font-lt-space),system-ui,sans-serif]">{post.read}</span>
            </div>
            <h2 className="mb-3 font-bold text-2xl transition-colors group-hover:text-[#495E84] [font-family:var(--font-lt-bricolage),system-ui,sans-serif]">
              {post.title}
            </h2>
            <p className="line-clamp-3 text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">{post.excerpt}</p>
          </article>
        ))}
      </section>

      <section className="relative mt-24 mb-12 overflow-hidden rounded-[40px] bg-[#151c28] p-8 text-[#f9f9ff] md:p-16">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#495E84] opacity-20" aria-hidden />
        <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 font-extrabold uppercase leading-none text-white [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl md:text-6xl">
              Stay in the loop
            </h2>
            <p className="max-w-md text-lg text-[#e9edff] [font-family:var(--font-lt-space),system-ui,sans-serif]">
              Get the latest brewing tips, event invites, and cartoon-inspired cafe updates delivered straight to your inbox.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <input
              className="flex-1 border-b-4 border-white bg-transparent px-2 py-4 text-xl font-bold text-white placeholder:text-white/30 focus:outline-none [font-family:var(--font-lt-bricolage),system-ui,sans-serif]"
              placeholder="Your email address"
              type="email"
              readOnly
              aria-label="Newsletter email (demo)"
            />
            <button
              type="button"
              className="rounded-full border-2 border-white bg-[#495E84] px-10 py-4 text-lg font-bold text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 [font-family:var(--font-lt-space),system-ui,sans-serif]"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
