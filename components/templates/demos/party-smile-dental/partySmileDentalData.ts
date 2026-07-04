import type { LucideIcon } from "lucide-react";
import {
  Baby,
  Crown,
  Drill,
  HeartPulse,
  Layers,
  Scan,
  Shield,
  Smile,
  Sparkles,
  Stethoscope,
  Sun,
  Zap,
} from "lucide-react";

export type PsdDentist = {
  name: string;
  role: string;
  focus: string;
  bio: string;
  tileColor: string;
};

export type PsdService = {
  title: string;
  description: string;
  icon: LucideIcon;
  tileColor: string;
  whatIsThis: string;
  whyItMatters: string;
  signsYouMayNeedIt: string;
};

export type PsdTestimonial = {
  quote: string;
  name: string;
  detail: string;
  rating: number;
};

export type PsdFaqItem = {
  question: string;
  answer: string;
};

export const PSD_DENTISTS: PsdDentist[] = [
  {
    name: "Dr. Maya Chen",
    role: "Family Dentist",
    focus: "Preventive care for all ages",
    bio: "Dr. Chen helps families build steady oral-health habits with gentle exams, clear explanations, and a calm chair-side style kids actually enjoy.",
    tileColor: "bg-[#3b82f6]",
  },
  {
    name: "Dr. Daniel Brooks",
    role: "Restorative Dentist",
    focus: "Fillings, crowns, and repair",
    bio: "Dr. Brooks focuses on restoring comfort and confidence with durable, natural-looking treatments and step-by-step treatment plans.",
    tileColor: "bg-[#ef4444]",
  },
  {
    name: "Dr. Sofia Patel",
    role: "Children's Dentistry",
    focus: "Kid-friendly visits",
    bio: "Dr. Patel creates positive first visits with patience, playful guidance, and parent-friendly coaching for brushing routines at home.",
    tileColor: "bg-[#eab308]",
  },
  {
    name: "Dr. Adam Rivera",
    role: "Emergency & General Care",
    focus: "Urgent and everyday care",
    bio: "Dr. Rivera handles same-day pain relief and practical general dentistry so families know where to turn when something unexpected happens.",
    tileColor: "bg-[#22c55e]",
  },
];

export const PSD_SERVICES: PsdService[] = [
  {
    title: "Dental Exams & Cleanings",
    description: "Routine checkups and professional cleanings to keep smiles healthy year-round.",
    icon: Stethoscope,
    tileColor: "bg-[#3b82f6]",
    whatIsThis:
      "A dental exam is a careful look at your teeth, gums, and mouth. A cleaning removes plaque and tartar that brushing alone cannot reach.",
    whyItMatters:
      "Regular visits catch small problems early — before they become painful or expensive. They also help kids build confidence at the dentist.",
    signsYouMayNeedIt:
      "It has been six months or more since your last visit, you notice bleeding gums, bad breath that will not go away, or you simply want peace of mind.",
  },
  {
    title: "Family Dentistry",
    description: "One welcoming clinic for parents, teens, and grandparents under the same roof.",
    icon: Smile,
    tileColor: "bg-[#ef4444]",
    whatIsThis:
      "Family dentistry means one team cares for everyone in your household — from first teeth to dentures — with schedules and explanations that fit real life.",
    whyItMatters:
      "When the whole family sees the same clinic, records stay in one place, kids watch calm parents, and follow-up care is easier to coordinate.",
    signsYouMayNeedIt:
      "You are juggling multiple dentists, want one place for kids and adults, or need a clinic that understands busy family schedules.",
  },
  {
    title: "Children's Dentistry",
    description: "Positive, patient visits designed to help kids feel safe and proud of their teeth.",
    icon: Baby,
    tileColor: "bg-[#eab308]",
    whatIsThis:
      "Children's dentistry focuses on gentle exams, fluoride, sealants, and coaching — paced so young patients understand each step before it happens.",
    whyItMatters:
      "Positive early visits reduce fear later in life and help catch issues like cavities or bite problems while they are still simple to treat.",
    signsYouMayNeedIt:
      "Your child's first tooth appeared, they have not seen a dentist yet, they complain of tooth pain, or they feel nervous about the chair.",
  },
  {
    title: "Emergency Dental Care",
    description: "Same-day appointments for toothaches, broken teeth, and urgent pain relief.",
    icon: Zap,
    tileColor: "bg-[#22c55e]",
    whatIsThis:
      "Emergency dental care addresses sudden pain, swelling, knocked-out teeth, or broken restorations — usually with same-day or next-available slots.",
    whyItMatters:
      "Quick treatment relieves pain, lowers infection risk, and can save a tooth that might otherwise be lost.",
    signsYouMayNeedIt:
      "Sharp or throbbing pain, facial swelling, a cracked or knocked-out tooth, lost filling or crown, or bleeding that will not stop.",
  },
  {
    title: "Fillings",
    description: "Tooth-colored repairs that restore strength without making every conversation about dentistry.",
    icon: Drill,
    tileColor: "bg-[#3b82f6]",
    whatIsThis:
      "A filling replaces tooth structure damaged by decay. Modern materials blend with your natural tooth color for a discreet repair.",
    whyItMatters:
      "Treating a cavity early stops it from spreading deeper, which protects the nerve and avoids more involved treatment later.",
    signsYouMayNeedIt:
      "Sensitivity to sweet or cold foods, visible dark spots on a tooth, food getting stuck in one area, or your dentist noted decay on an X-ray.",
  },
  {
    title: "Crowns & Bridges",
    description: "Custom restorations that rebuild damaged teeth and close gaps with a natural finish.",
    icon: Crown,
    tileColor: "bg-[#ef4444]",
    whatIsThis:
      "A crown covers and protects a weakened tooth. A bridge replaces one or more missing teeth by anchoring to neighboring teeth or implants.",
    whyItMatters:
      "Restorations restore chewing comfort, speech, and appearance while preventing surrounding teeth from shifting out of place.",
    signsYouMayNeedIt:
      "A large old filling failed, a tooth cracked after an injury, you are missing a tooth, or chewing on one side has become uncomfortable.",
  },
  {
    title: "Teeth Whitening",
    description: "Professional brightening options for special events or a simple confidence boost.",
    icon: Sun,
    tileColor: "bg-[#eab308]",
    whatIsThis:
      "Professional whitening uses dentist-supervised gels to safely lighten tooth shade. We review your goals and gum health before starting.",
    whyItMatters:
      "Supervised whitening is safer and more predictable than over-the-counter kits, with fewer surprises for sensitive teeth.",
    signsYouMayNeedIt:
      "Stains from coffee, tea, or aging bother you, you have an upcoming event, or store-bought strips caused uneven results or sensitivity.",
  },
  {
    title: "Invisalign / Clear Aligners",
    description: "Discreet orthodontic consults for teens and adults who want straighter smiles.",
    icon: Layers,
    tileColor: "bg-[#22c55e]",
    whatIsThis:
      "Clear aligners are removable trays that gradually move teeth into better alignment. A consult includes scans, photos, and a custom plan.",
    whyItMatters:
      "Straighter teeth are easier to clean and can reduce wear, jaw discomfort, and self-consciousness — without traditional metal braces.",
    signsYouMayNeedIt:
      "Crowded or gapped teeth, bite feels off, you had braces years ago and teeth shifted, or you want a low-profile way to straighten.",
  },
  {
    title: "Root Canal Therapy",
    description: "Comfort-focused treatment to save infected teeth and stop pain at the source.",
    icon: HeartPulse,
    tileColor: "bg-[#3b82f6]",
    whatIsThis:
      "Root canal therapy removes infected tissue inside a tooth, cleans the canal, and seals it — so the natural tooth can stay in place.",
    whyItMatters:
      "Saving your tooth avoids extraction gaps, preserves chewing function, and stops infection from spreading to surrounding bone.",
    signsYouMayNeedIt:
      "Persistent throbbing pain, pain when biting, prolonged sensitivity to heat, gum swelling near one tooth, or a darkened tooth.",
  },
  {
    title: "Dental Implants",
    description: "Long-term replacement options for missing teeth with careful planning and follow-up.",
    icon: Scan,
    tileColor: "bg-[#ef4444]",
    whatIsThis:
      "A dental implant is a small post placed in the jaw that supports a crown, bridge, or denture — mimicking the root of a natural tooth.",
    whyItMatters:
      "Implants help preserve jawbone, feel stable when eating, and do not rely on neighboring teeth the way some bridges do.",
    signsYouMayNeedIt:
      "You are missing one or more teeth, a denture feels loose, you want a fixed solution, or you were told a tooth cannot be saved.",
  },
];

export const PSD_TESTIMONIALS: PsdTestimonial[] = [
  {
    quote:
      "Our whole family books here now. The team explained everything in plain language and our son left smiling instead of scared.",
    name: "The Nguyen Family",
    detail: "Parents of two · Regular cleanings",
    rating: 5,
  },
  {
    quote:
      "I cracked a tooth on a Sunday and they got me in fast. Professional, kind, and zero judgment — exactly what I needed.",
    name: "Marcus L.",
    detail: "Emergency visit",
    rating: 5,
  },
  {
    quote:
      "Direct billing made the visit easy. Forms were simple, staff were cheerful, and my daughter asks when we go back.",
    name: "Priya S.",
    detail: "Child patient · New family",
    rating: 5,
  },
  {
    quote:
      "I was nervous for years. Dr. Chen walked me through each step and never rushed me. I finally feel in control of my dental care.",
    name: "Jordan T.",
    detail: "Restorative treatment",
    rating: 5,
  },
];

export const PSD_FAQS: PsdFaqItem[] = [
  {
    question: "Do you accept new patients?",
    answer:
      "Yes. We welcome new patients of all ages and reserve time each week for first visits. Book online or call our front desk to get started.",
  },
  {
    question: "Do you treat children?",
    answer:
      "Absolutely. Dr. Patel leads our children's dentistry visits with kid-friendly pacing, and the whole team is trained to support nervous young patients.",
  },
  {
    question: "Do you offer emergency dental appointments?",
    answer:
      "Yes. Call us for same-day or next-available emergency slots for pain, swelling, broken teeth, or lost restorations.",
  },
  {
    question: "Do you direct bill insurance?",
    answer:
      "We direct bill most major insurance plans when plan details are provided at check-in. Our team confirms coverage before treatment when possible.",
  },
  {
    question: "What forms do I need as a new patient?",
    answer:
      "Adults complete the new patient packet; parents complete the child form for minors. You can download forms online or request them by email.",
  },
  {
    question: "How long does a first appointment take?",
    answer:
      "Most first visits take 45–60 minutes and include health history review, exam, X-rays if needed, and time for your questions.",
  },
  {
    question: "What if I feel nervous about the dentist?",
    answer:
      "Tell us when you book. We offer slower pacing, breaks, clear explanations, and a calm team that never rushes you through the chair.",
  },
  {
    question: "Can I request a specific dentist?",
    answer:
      "Yes. Choose your preferred provider when booking online or mention your preference when you call — we'll match availability.",
  },
];

export const PSD_TRUST_BADGES = [
  { label: "Family Dentistry", icon: Smile },
  { label: "Emergency Appointments", icon: Zap },
  { label: "Direct Insurance Billing", icon: Shield },
  { label: "Kid-Friendly Visits", icon: Sparkles },
] as const;

export const PSD_JOURNEY_STEPS = [
  { step: 1, title: "Choose your visit", detail: "Pick cleaning, exam, child visit, or emergency care." },
  { step: 2, title: "Meet your dental team", detail: "Get matched with a dentist who fits your needs." },
  { step: 3, title: "Complete your forms", detail: "Download or submit new patient paperwork ahead of time." },
  { step: 4, title: "Visit with confidence", detail: "Arrive ready — we handle the rest as one team." },
] as const;
