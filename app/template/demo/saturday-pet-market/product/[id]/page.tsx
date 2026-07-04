import type { Metadata } from "next";
import { SaturdayPetMarketProductBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketProductBody";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Product | Pet Market (demo)`,
    description: `Product details for item ${id} at Saturday Morning Pet Market.`,
  };
}

export default async function SaturdayPetMarketProductPage({ params }: PageProps) {
  const { id } = await params;
  return <SaturdayPetMarketProductBody productId={id} />;
}
