const headlineFont = { fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" } as const;

const STEPS = [
  {
    step: "01",
    title: "Discover",
    body: "Browse our gallery of quirky and lovable residents looking for a new home.",
    icon: "search",
    iconBox: "rotate-3 bg-[#0d658c] text-white",
    stepBadge: "text-[#0d658c]",
    stepBadgeBg: "border-[#c0c7cf] bg-[#ebe1d5]/50",
    card: "-rotate-1 border-2 border-[#8fd3ff] bg-white",
  },
  {
    step: "02",
    title: "Connect",
    body: "Submit an inquiry and chat with our counselors about your lifestyle and pet preferences.",
    icon: "chat_bubble",
    iconBox: "-rotate-6 bg-[#2e6b29] text-white",
    stepBadge: "text-[#2e6b29]",
    stepBadgeBg: "border-[#c0c7cf] bg-[#ebe1d5]/50",
    card: "rotate-1 border-2 border-[#adf19e] bg-white",
  },
  {
    step: "03",
    title: "Visit",
    body: "Schedule a playdate at our center to meet your potential match in person.",
    icon: "location_on",
    iconBox: "rotate-6 bg-[#745b00] text-white",
    stepBadge: "text-[#745b00]",
    stepBadgeBg: "border-[#c0c7cf] bg-[#ebe1d5]/50",
    card: "-rotate-1 border-2 border-[#eec750] bg-white",
  },
  {
    step: "04",
    title: "Adopt",
    body: "Complete the paperwork, collect your welcome pack, and start your new life together!",
    icon: "celebration",
    iconBox: "-rotate-2 bg-[#8fd3ff] text-[#005c80]",
    stepBadge: "text-[#0d658c]",
    stepBadgeBg: "border-[#0d658c]/30 bg-[#0d658c]/20",
    card: "rotate-1 border-2 border-[#0d658c] bg-[#0d658c]/5",
  },
] as const;

export function NeopetsAdoptionGuide() {
  return (
    <section className="relative overflow-hidden px-4 py-12 md:px-16">
      <div
        className="np-cloud-shape absolute -right-20 -top-10 -z-10 h-64 w-64 bg-[#8fd3ff]/20 blur-xl"
        aria-hidden
      />
      <div
        className="np-cloud-shape absolute -left-20 top-1/2 -z-10 h-72 w-72 bg-[#adf19e]/20 blur-xl"
        aria-hidden
      />

      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-3 rounded-full bg-[#0d658c]/10 p-3">
            <span className="material-symbols-outlined text-4xl text-[#0d658c]">map</span>
          </div>
          <h3
            className="text-[28px] font-bold leading-9 text-[#0d658c] md:text-[32px] md:leading-10"
            style={headlineFont}
          >
            Your Adoption Adventure
          </h3>
          <p className="mt-2 max-w-xs text-base leading-6 text-[#40484e]">
            A gentle journey to finding your perfect furry companion.
          </p>
        </div>

        <div className="relative space-y-16 before:absolute before:bottom-4 before:left-[31px] before:top-4 before:w-0 before:rounded-full before:border-l-4 before:border-dashed before:border-[#0d658c]/20 before:content-['']">
          {STEPS.map((step) => (
            <div key={step.step} className="relative flex flex-col items-start gap-4">
              <div className="flex items-center gap-6">
                <div
                  className={`z-10 flex h-16 w-16 items-center justify-center rounded-3xl border-4 border-white shadow-xl ${step.iconBox}`}
                >
                  <span className="material-symbols-outlined text-3xl font-bold">{step.icon}</span>
                </div>
                <div className={`rounded-full border px-4 py-1 ${step.stepBadgeBg}`}>
                  <span
                    className={`text-sm font-bold uppercase tracking-wider ${step.stepBadge}`}
                    style={{ fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" }}
                  >
                    Step {step.step}
                  </span>
                </div>
              </div>
              <div className={`np-sticker-shadow ml-4 flex-1 rounded-3xl p-6 ${step.card}`}>
                <h4 className="mb-2 text-2xl font-semibold leading-8 text-[#1f1b14]" style={headlineFont}>
                  {step.title}
                </h4>
                <p className="text-base leading-6 text-[#40484e]">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
