export type ViServiceCta = { label: string; url: string };

export type ViServiceBodyCopyContent = {
  quote: string;
  paragraphs: readonly string[];
  sidebar: {
    title: string;
    description: string;
    cta: ViServiceCta;
  };
};

export type ViServiceBenefitsContent = {
  heading: string;
  paragraphs: readonly string[];
  imageSrc: string;
  imageAlt: string;
  imagePosition: "left" | "right";
};
