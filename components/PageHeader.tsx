"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="w-full mb-6 md:mb-8 text-center">
      {/* TITLE */}
      <h2 className="text-2xl md:text-4xl font-extrabold tracking-[0.18em] uppercase">
        {title}
      </h2>

      {/* SUBTITLE */}
      {subtitle && (
        <p className="max-w-xl mx-auto mt-2 text-sm md:text-base text-base-content">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
