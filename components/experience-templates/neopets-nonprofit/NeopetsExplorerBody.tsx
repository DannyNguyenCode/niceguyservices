import Image from "next/image";
import Link from "next/link";
import { NeopetsExplorerSearch } from "@/components/experience-templates/neopets-nonprofit/NeopetsExplorerSearch";
import { NEOPETS_PATHS } from "@/components/experience-templates/neopets-nonprofit/neopetsConfig";

const PETS = [
  {
    name: "Marty",
    breed: "American Bulldog",
    age: "2 Years Old",
    badge: "New Arrival!",
    badgePos: "-top-4 -right-4 rotate-12",
    polaroid: "-rotate-2 group-hover:rotate-1",
    shadow: "shadow-[8px_8px_0px_0px_#ebe1d5]",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5kGtt-HqdCzwtLy2E_Muz9ECNkKr6ZOywW2cWpVjIbD2-NIju4vldBBAA1TrTQyhi64ZBAY7cuIqMmSsy_7M15_8nxQq9d8eMkm2OSkrp0N44zcV6-zIOt-penvier4NMElhqhMnX3qyDLFa0OwCd-KJApvNaAY2blGscmd_rHaOdH7D8swGOKvQq_QjAWFXfSJHwwxetgqLJYKOGKV3aRmy5xvkMl4UI7cvtkciyG0K5dPbE_75B24uL9IT7zy1DZWROGhT44OlH",
    tags: ["Energetic", "Friendly"],
    tagColors: ["bg-[#8fd3ff] text-[#005c80]", "bg-[#adf19e] text-[#326f2d]"],
    energy: 85,
    energyColor: "bg-[#ba1a1a]",
    energyLabel: "High",
    perk: { icon: "child_care", text: "Great with kids!" },
    btnClass: "np-chunky-button bg-[#0d658c] text-white",
    breedColor: "text-[#0d658c]",
    stickerIcon: "auto_awesome",
    mdOffset: "",
  },
  {
    name: "Ayla",
    breed: "Boxer Mix",
    age: "4 Years Old",
    badge: "Gentle Soul",
    badgePos: "-top-4 -left-4 -rotate-6",
    polaroid: "rotate-2 group-hover:-rotate-1",
    shadow: "shadow-[8px_8px_0px_0px_#adf19e]",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7s4rWOJ8G9T-JaneuqCh2pyebiPXvl1kvT89T7ArXGaCLBvweWMXtiLKCpsONdoi2gFjTX7oSGbeuJ_VwH-cFxO4K-Y9KwZivHSothuIvFgsTOjCQJcjGaPIzG7jyJThuCeeNzB-VY5JtCd5xOEXSWciz6IYrdcuUe33C_XsgJVdSnQCGa0J_4Cnb4x5CVfVxPxJLa0VqslRliMrdUQYsVnMQXJ9anv5E3dEBVSByYYJ2kKwPQnDtVJNl832cpyszqqXbK67zVdfH",
    tags: ["Calm", "Loyal"],
    tagColors: ["bg-[#eec750] text-[#695300]", "bg-[#8fd3ff] text-[#005c80]"],
    energy: 45,
    energyColor: "bg-[#2e6b29]",
    energyLabel: "Medium",
    perk: { icon: "pets", text: "Good with other pets" },
    btnClass: "np-chunky-button bg-[#2e6b29] text-white",
    breedColor: "text-[#2e6b29]",
    stickerIcon: "favorite",
    mdOffset: "md:mt-12",
  },
  {
    name: "Diamond",
    breed: "Rabbit",
    age: "1 Year Old",
    badge: "Featured!",
    badgePos: "bottom-4 -right-4 rotate-3",
    polaroid: "-rotate-1 group-hover:rotate-2",
    shadow: "shadow-[8px_8px_0px_0px_#ffe089]",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7uIFgYB297BhXUh8FCiZpxwaiTiEUL35zPFyWBvG7Runvv752rtCZZTV-9WN1ddeMhEYCJ8cn0lJ__81_XqiyBdv0yFXoJSVXo0tq9qiuLwX1LEyWFGRmuCLVzYKlZWKG9-QiTj3Po4FypC5fMRwbsuom_JY9TXfbuGxOoPZVY0XLF_kXCR56vbuvK67af_5XfoRG8CoJERP5fRnz_X2fSRQEyhHohV1v969EMfYVuJDPISL-6YWWv3_ibcUWde3MS7kyGKnO4AvD",
    tags: ["Quiet", "Curious"],
    tagColors: ["bg-[#adf19e] text-[#326f2d]", "bg-[#eec750] text-[#695300]"],
    energy: 25,
    energyColor: "bg-[#745b00]",
    energyLabel: "Low",
    perk: { icon: "home", text: "Perfect for apartments" },
    btnClass: "np-chunky-button bg-[#745b00] text-white",
    breedColor: "text-[#745b00]",
    stickerIcon: "star",
    mdOffset: "",
  },
] as const;

export function NeopetsExplorerBody() {
  return (
    <main className="np-paper-texture-fine relative mx-auto max-w-[1200px] overflow-hidden px-4 py-12 md:px-16">
      <NeopetsExplorerSearch />

      <div id="featured-pets" className="mb-12 scroll-mt-28 text-center md:text-left">
        <h2
          className="mb-2 text-5xl font-bold leading-[56px] text-[#0d658c]"
          style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
        >
          Meet Your New Best Friend
        </h2>
        <p className="max-w-2xl text-lg leading-7 text-[#40484e]">
          Collect your favorites and start a journey of a lifetime. Every card tells a story waiting for a happy
          ending.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
        {PETS.map((p) => (
          <div
            key={p.name}
            className={`group relative rounded-[24px] border-2 border-[#ebe1d5] bg-white p-6 ${p.shadow} transition-all duration-300 hover:-translate-y-1 ${p.mdOffset}`}
          >
            <div
              className={`absolute ${p.badgePos} z-10 rounded-full border-2 px-4 py-2 text-sm font-semibold shadow-sm ${
                p.name === "Marty"
                  ? "border-[#695300] bg-[#eec750] text-[#695300]"
                  : p.name === "Ayla"
                    ? "border-[#326f2d] bg-[#adf19e] text-[#326f2d]"
                    : "border-[#005c80] bg-[#8fd3ff] text-[#005c80]"
              }`}
              style={{ fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" }}
            >
              {p.badge}
            </div>

            <div
              className={`np-scrapbook-border mb-6 rounded-lg bg-white p-3 pb-8 transition-transform duration-500 ${p.polaroid}`}
            >
              <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-sm">
                <Image src={p.img} alt={`${p.name} the ${p.breed}`} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <p
                className="text-center text-2xl font-semibold leading-8 text-[#1f1b14]"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                {p.name}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-wider ${p.breedColor}`}>{p.breed}</p>
                  <p className="text-base text-[#40484e]">{p.age}</p>
                </div>
                <span className="material-symbols-outlined text-[#0d658c]">{p.stickerIcon}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t, i) => (
                  <span key={t} className={`rounded-full px-3 py-1 text-sm font-semibold ${p.tagColors[i]}`}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Energy Level</span>
                  <span>{p.energyLabel}</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full border border-[#c0c7cf] bg-[#ebe1d5]">
                  <div
                    className={`h-full rounded-full border-r-4 border-white ${p.energyColor}`}
                    style={{ width: `${p.energy}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#135212]">
                <span className="material-symbols-outlined text-[#2e6b29]">{p.perk.icon}</span>
                <span className="text-sm font-semibold">{p.perk.text}</span>
              </div>
              <button type="button" className={`w-full rounded-xl py-4 text-xl font-semibold hover:scale-[0.98] ${p.btnClass}`}>
                Adopt Me
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute right-0 top-10 hidden opacity-20 lg:block">
        <span className="material-symbols-outlined text-[120px] text-[#0d658c]">potted_plant</span>
      </div>
      <div className="pointer-events-none absolute bottom-20 left-0 hidden opacity-20 lg:block">
        <span className="material-symbols-outlined text-[100px] text-[#2e6b29]">nest_eco_leaf</span>
      </div>

      <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-[#40484e]">
        Demo only — see also{" "}
        <Link href={NEOPETS_PATHS.alerts} className="font-semibold text-[#0d658c] underline-offset-2 hover:underline">
          Rescue Alerts
        </Link>{" "}
        and{" "}
        <Link href={NEOPETS_PATHS.successStories} className="font-semibold text-[#0d658c] underline-offset-2 hover:underline">
          Success Stories
        </Link>
        .
      </p>
    </main>
  );
}
