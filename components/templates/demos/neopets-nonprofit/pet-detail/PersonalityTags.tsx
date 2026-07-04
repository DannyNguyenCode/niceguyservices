const bodyFont = { fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" } as const;

const TAG_COLORS = [
  "bg-[#8fd3ff] text-[#005c80]",
  "bg-[#adf19e] text-[#326f2d]",
  "bg-[#eec750] text-[#695300]",
  "bg-[#fcf2e6] text-[#745b00] border border-[#ebe1d5]",
] as const;

type PersonalityTagsProps = {
  tags: readonly string[];
};

export function PersonalityTags({ tags }: PersonalityTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, i) => (
        <span
          key={tag}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${TAG_COLORS[i % TAG_COLORS.length]}`}
          style={bodyFont}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
