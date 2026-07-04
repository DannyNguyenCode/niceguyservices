import {
  ArrowRight,
  Gift,
  HandHeart,
  Heart,
  Home,
  MapPin,
  Megaphone,
  Search,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NEOPETS_PATHS } from "@/components/templates/demos/neopets-nonprofit/neopetsConfig";
import { NEOPETS_IMAGES } from "@/components/templates/demos/neopets-nonprofit/neopetsImages";

const headlineFont = { fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" } as const;

const pets = [
  {
    name: "Milo",
    type: "Young Cat",
    tag: "Calm and cuddly",
    image: NEOPETS_IMAGES.featuredPets.milo,
  },
  {
    name: "Luna",
    type: "Rescue Dog",
    tag: "Loves walks",
    image: NEOPETS_IMAGES.featuredPets.luna,
  },
  {
    name: "Bean",
    type: "Kitten",
    tag: "Needs foster",
    image: NEOPETS_IMAGES.featuredPets.bean,
  },
] as const;

const impactStats = [
  { label: "Pets helped", value: "1,248" },
  { label: "Adoptions", value: "982" },
  { label: "Reunited", value: "315" },
  { label: "Raised", value: "$42k" },
] as const;

const pathways = [
  {
    icon: Search,
    title: "Adopt a pet",
    text: "Browse pets looking for a safe, loving home.",
    href: NEOPETS_PATHS.explorer,
  },
  {
    icon: MapPin,
    title: "Adoption journey",
    text: "Follow our guided quest from exploring pets to welcome home.",
    href: NEOPETS_PATHS.adoptionProcess,
  },
  {
    icon: HandHeart,
    title: "Donate",
    text: "Support food, vet care, shelter, and community rescue work.",
    href: NEOPETS_PATHS.volunteers,
  },
  {
    icon: Megaphone,
    title: "Lost or found",
    text: "Post urgent updates and help reunite pets with families.",
    href: NEOPETS_PATHS.adventure,
  },
] as const;

const donationBreakdown = [
  { label: "Food and supplies", value: "$12,400", width: "w-[78%]" },
  { label: "Emergency vet care", value: "$18,250", width: "w-[92%]" },
  { label: "Rehoming support", value: "$7,900", width: "w-[58%]" },
  { label: "Dog park awareness", value: "$3,450", width: "w-[42%]" },
] as const;

export function NeopetsHomeBody() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fff8ef] pb-12 text-[#241b13]">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:px-8 md:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#ead9c4] bg-white px-4 py-2 text-sm font-bold text-[#2f7d46]">
            <Heart size={16} aria-hidden />
            Built for adoption, rescue, and community care
          </div>

          <h1 className="max-w-2xl text-4xl font-black leading-tight md:text-6xl" style={headlineFont}>
            Help every pet find safety, love, and a second chance.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-[#6e5c4c]">
            A Toronto-based adoption platform for pet owners, shelters, businesses, and volunteers to
            connect, rehome pets safely, and support local animal causes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={NEOPETS_PATHS.explorer}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f6f8f] px-6 py-4 font-bold text-white shadow-md transition hover:scale-[0.98]"
            >
              Meet adoptable pets
              <ArrowRight size={18} aria-hidden />
            </Link>

            <Link
              href={NEOPETS_PATHS.volunteers}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#2f7d46] bg-white px-6 py-4 font-bold text-[#2f7d46] transition hover:scale-[0.98]"
            >
              Donate now
              <Gift size={18} aria-hidden />
            </Link>
          </div>
        </div>

        <div className="relative pb-10 md:pb-14">
          <div className="overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl">
            <div className="relative h-[420px] w-full md:h-[560px]">
              <Image
                src={NEOPETS_IMAGES.homeHero}
                alt="Happy adopted pets with people"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          <div className="absolute -bottom-6 left-4 right-4 rounded-3xl border border-[#ead9c4] bg-white p-4 shadow-xl md:left-8 md:right-8">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {impactStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-[#fff3dc] p-4 text-center">
                  <p className="text-2xl font-black text-[#0f6f8f]" style={headlineFont}>
                    {stat.value}
                  </p>
                  <p className="text-sm font-semibold text-[#6e5c4c]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="support" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 md:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 font-bold text-[#2f7d46]">Choose how you want to help</p>
          <h2 className="text-3xl font-black md:text-5xl" style={headlineFont}>
            One platform. Multiple ways to save lives.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {pathways.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-3xl border border-[#ead9c4] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe09a] text-[#5f4700]">
                  <Icon size={24} aria-hidden />
                </div>
                <h3 className="mb-2 text-xl font-black" style={headlineFont}>
                  {item.title}
                </h3>
                <p className="leading-7 text-[#6e5c4c]">{item.text}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="pets" className="scroll-mt-24 bg-[#f2e5d4] px-4 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-2 font-bold text-[#2f7d46]">Featured pets</p>
              <h2 className="text-3xl font-black md:text-5xl" style={headlineFont}>
                Ready for a new beginning
              </h2>
            </div>

            <Link
              href={NEOPETS_PATHS.explorer}
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-[#241b13] px-5 py-3 font-bold text-white transition hover:scale-[0.98]"
            >
              View all pets
              <ArrowRight size={18} aria-hidden />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pets.map((pet) => (
              <article key={pet.name} className="overflow-hidden rounded-3xl bg-white shadow-md">
                <div className="relative h-72 w-full">
                  <Image
                    src={pet.image}
                    alt={pet.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-2xl font-black" style={headlineFont}>
                      {pet.name}
                    </h3>
                    <p className="font-semibold text-[#6e5c4c]">{pet.type}</p>
                  </div>

                  <p className="inline-block rounded-full bg-[#fff3dc] px-4 py-2 text-sm font-bold text-[#6e5c4c]">
                    {pet.tag}
                  </p>

                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="donate" className="mx-auto grid max-w-7xl scroll-mt-24 gap-8 px-4 py-16 md:grid-cols-2 md:px-8">
        <div className="rounded-[2rem] bg-[#0f6f8f] p-8 text-white md:p-10">
          <Gift className="mb-6" size={42} aria-hidden />
          <h2 className="text-3xl font-black md:text-5xl" style={headlineFont}>
            Show where every donation goes.
          </h2>
          <p className="mt-5 leading-8 text-white/85">
            Build trust with donation transparency: total raised, active causes, business partners, city
            initiatives, food support, vet care, and shelter needs.
          </p>

          <Link
            href={NEOPETS_PATHS.volunteers}
            className="mt-8 inline-block rounded-2xl bg-white px-6 py-4 font-black text-[#0f6f8f] transition hover:scale-[0.98]"
          >
            Support a cause
          </Link>
        </div>

        <div className="grid gap-4">
          {donationBreakdown.map((item) => (
            <div key={item.label} className="rounded-3xl border border-[#ead9c4] bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="font-black">{item.label}</p>
                <p className="shrink-0 font-black text-[#2f7d46]">{item.value}</p>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#f2e5d4]">
                <div className={`h-full rounded-full bg-[#2f7d46] ${item.width}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="scroll-mt-24 bg-white px-4 py-16 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="mb-2 font-bold text-[#2f7d46]">About us</p>
            <h2 className="text-3xl font-black leading-tight md:text-5xl" style={headlineFont}>
              A community-based non-profit driven by doing good for all living things.
            </h2>
            <p className="mt-5 max-w-3xl leading-8 text-[#6e5c4c]">
              As pet owners, our hearts break when animals are left homeless, starving, or without love.
              This platform helps turn community concern into action through adoption, donation, surrender
              support, lost pet posts, and rescue awareness.
            </p>
            <Link
              href={NEOPETS_PATHS.about}
              className="mt-6 inline-flex items-center gap-2 font-bold text-[#0f6f8f] underline-offset-4 hover:underline"
            >
              Read our full story
              <ArrowRight size={18} aria-hidden />
            </Link>
          </div>

          <div className="rounded-3xl bg-[#fff3dc] p-6">
            <div className="mb-4 flex items-center gap-3">
              <MapPin className="shrink-0 text-[#0f6f8f]" aria-hidden />
              <p className="font-black">Toronto, Ontario</p>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <Users className="shrink-0 text-[#2f7d46]" aria-hidden />
              <p className="font-black">Shelters, owners, volunteers</p>
            </div>

            <div className="flex items-center gap-3">
              <Home className="shrink-0 text-[#745b00]" aria-hidden />
              <p className="font-black">Safe rehoming first</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
