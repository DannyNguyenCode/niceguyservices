import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NeopetsPetDetailBody } from "@/components/templates/demos/neopets-nonprofit/pet-detail/NeopetsPetDetailBody";
import { getPetById, NEOPETS_PETS } from "@/components/templates/demos/neopets-nonprofit/neopetsPets";
import { absoluteUrl } from "@/lib/templates/urls";

type PageProps = {
  params: Promise<{ petId: string }>;
};

export function generateStaticParams() {
  return NEOPETS_PETS.map((pet) => ({ petId: pet.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { petId } = await params;
  const pet = getPetById(petId);
  if (!pet) {
    return { title: "Pet not found — Toronto Adopt-A-Pet (demo)" };
  }
  return {
    title: `${pet.name} — Toronto Adopt-A-Pet (demo)`,
    description: `Meet ${pet.name}, a ${pet.breed} available for adoption. ${pet.about.slice(0, 140)}…`,
    alternates: {
      canonical: absoluteUrl(`/template/demo/neopets-nonprofit/explorer/${pet.id}`),
    },
  };
}

export default async function NeopetsPetDetailPage({ params }: PageProps) {
  const { petId } = await params;
  const pet = getPetById(petId);
  if (!pet) notFound();
  return <NeopetsPetDetailBody pet={pet} />;
}
