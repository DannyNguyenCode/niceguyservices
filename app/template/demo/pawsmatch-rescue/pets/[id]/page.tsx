import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PawsMatchPetDetailBody } from "@/components/templates/demos/pawsmatch-rescue/PawsMatchPetDetailBody";
import { getPmrPetById } from "@/components/templates/demos/pawsmatch-rescue/pawsMatchRescueData";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pet = getPmrPetById(id);
  if (!pet) return { title: "Pet not found — PawsMatch Rescue" };
  return { title: `${pet.name} — PawsMatch Rescue (demo)` };
}

export default async function PawsMatchPetDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!getPmrPetById(id)) notFound();
  return <PawsMatchPetDetailBody petId={id} />;
}
