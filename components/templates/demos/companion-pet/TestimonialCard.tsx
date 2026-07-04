"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Testimonial } from "./companionPetData";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="cp-card rounded-2xl p-6"
    >
      <div className="flex gap-1">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-[var(--cp-orange)] text-[var(--cp-orange)]" aria-hidden />
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--cp-charcoal)]">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={testimonial.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-white" />
        <div>
          <p className="text-sm font-semibold text-[var(--cp-charcoal)]">{testimonial.name}</p>
          <p className="text-xs text-[var(--cp-slate)]">{testimonial.pet}</p>
        </div>
      </div>
    </motion.div>
  );
}
