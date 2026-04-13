"use client";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="w-full mb-6 md:mb-8 text-center">
      <h2 className="text-2xl md:text-4xl font-extrabold tracking-[0.18em] uppercase">
        {title}
      </h2>

      {subtitle && (
        <p className="max-w-xl mx-auto mt-2 text-sm md:text-base text-base-content">
          {subtitle}
        </p>
      )}
    </div>
  );
}
