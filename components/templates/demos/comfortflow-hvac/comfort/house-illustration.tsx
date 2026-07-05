import { CFH_HOME_PALETTE as P } from "../home/cfhHomeData";
import { SYSTEM_MAP, type SystemId } from "./systems";

interface Props {
  active: SystemId;
  onHoverSystem?: (s: SystemId | null) => void;
  onSelectSystem?: (s: SystemId) => void;
  /** When false, the diagram is display-only (no hover/click). */
  interactive?: boolean;
  /** Maintenance: highlight ducts, vents, and distribution paths. */
  emphasizeDistribution?: boolean;
}

/**
 * Stylized cutaway home illustration.
 * Layered SVG with per-system glow layers gated by `active`.
 */
export function HouseIllustration({
  active,
  onHoverSystem,
  onSelectSystem,
  interactive = true,
  emphasizeDistribution = false,
}: Props) {
  const isCooling = active === "cooling";
  const isHeating = active === "heating";
  const isWater = active === "water";
  const isAir = active === "air";
  const isThermo = active === "thermostat";
  const isMaint = active === "maintenance";

  const cool = SYSTEM_MAP.cooling.color;
  const heat = SYSTEM_MAP.heating.color;
  const water = SYSTEM_MAP.water.color;
  const air = SYSTEM_MAP.air.color;
  const thermo = SYSTEM_MAP.thermostat.color;
  const maint = SYSTEM_MAP.maintenance.color;
  const duct = P.ductwork;

  const showHeatingDucts = isHeating || emphasizeDistribution;
  const showCoolingDucts = isCooling;
  const showThermoDucts = isThermo && !emphasizeDistribution;
  const showWaterPaths = isWater || emphasizeDistribution;
  const ductInfrastructureActive = showHeatingDucts || showCoolingDucts || showThermoDucts || emphasizeDistribution;

  const ductHighlightColor = emphasizeDistribution
    ? duct
    : isHeating
      ? heat
      : isCooling
        ? cool
        : isThermo
          ? thermo
          : duct;
  const ductFill = ductInfrastructureActive ? `${ductHighlightColor}30` : "oklch(0.82 0.005 250)";
  const ductStrokeColor = ductInfrastructureActive ? ductHighlightColor : "oklch(0.7 0.01 250)";
  const ductStrokeWidth = ductInfrastructureActive ? 2 : 1;

  const hoverHandlers = (id: SystemId) =>
    interactive && onHoverSystem && onSelectSystem
      ? {
          onMouseEnter: () => onHoverSystem(id),
          onMouseLeave: () => onHoverSystem(null),
          onClick: () => onSelectSystem(id),
          style: { cursor: "pointer" as const },
        }
      : {};

  const systemLabel = SYSTEM_MAP[active]?.label ?? "HVAC";

  return (
    <svg
      viewBox="0 0 900 620"
      className="h-auto w-full select-none"
      role="img"
      aria-label={
        interactive
          ? "Interactive cutaway of a home showing HVAC systems"
          : `Cutaway of a home with the ${systemLabel} system highlighted`
      }
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.98 0.01 240)" />
          <stop offset="1" stopColor="oklch(0.94 0.02 240)" />
        </linearGradient>
        <linearGradient id="wallExt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.97 0.005 250)" />
          <stop offset="1" stopColor="oklch(0.92 0.008 250)" />
        </linearGradient>
        <linearGradient id="roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.55 0.03 260)" />
          <stop offset="1" stopColor="oklch(0.42 0.03 260)" />
        </linearGradient>
        <linearGradient id="basement" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.9 0.008 250)" />
          <stop offset="1" stopColor="oklch(0.85 0.01 250)" />
        </linearGradient>
        <linearGradient id="roomBedroom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.98 0.01 260)" />
          <stop offset="1" stopColor="oklch(0.94 0.015 260)" />
        </linearGradient>
        <linearGradient id="roomBath" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.98 0.012 220)" />
          <stop offset="1" stopColor="oklch(0.94 0.018 220)" />
        </linearGradient>
        <linearGradient id="roomLiving" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.98 0.014 90)" />
          <stop offset="1" stopColor="oklch(0.94 0.02 90)" />
        </linearGradient>
        <linearGradient id="roomKitchen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.98 0.012 150)" />
          <stop offset="1" stopColor="oklch(0.94 0.018 150)" />
        </linearGradient>
        <radialGradient id="glowCool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={cool} stopOpacity="0.55" />
          <stop offset="1" stopColor={cool} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowHeat" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={heat} stopOpacity="0.6" />
          <stop offset="1" stopColor={heat} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowWater" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={water} stopOpacity="0.55" />
          <stop offset="1" stopColor={water} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowAir" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={air} stopOpacity="0.55" />
          <stop offset="1" stopColor={air} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowThermo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={thermo} stopOpacity="0.6" />
          <stop offset="1" stopColor={thermo} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowMaint" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={maint} stopOpacity="0.45" />
          <stop offset="1" stopColor={maint} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowDuct" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={ductHighlightColor} stopOpacity="0.5" />
          <stop offset="1" stopColor={ductHighlightColor} stopOpacity="0" />
        </radialGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dy="4" result="off" />
          <feComponentTransfer><feFuncA type="linear" slope="0.18" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Sky / ground backdrop */}
      <rect x="0" y="0" width="900" height="620" fill="url(#sky)" />
      <ellipse cx="450" cy="590" rx="380" ry="18" fill="oklch(0.85 0.01 250)" opacity="0.5" />

      {/* Trees silhouettes */}
      <g opacity="0.35" fill="oklch(0.8 0.03 155)">
        <circle cx="90" cy="360" r="55" />
        <rect x="83" y="360" width="14" height="120" fill="oklch(0.6 0.03 60)" opacity="0.6" />
        <circle cx="830" cy="330" r="65" />
        <rect x="823" y="330" width="14" height="150" fill="oklch(0.6 0.03 60)" opacity="0.6" />
      </g>

      {/* Roof */}
      <polygon points="200,140 700,140 640,80 260,80" fill="url(#roof)" filter="url(#softShadow)" />
      <polygon points="200,140 260,80 250,80 190,140" fill="oklch(0.35 0.03 260)" />
      {/* Chimney */}
      <rect x="580" y="60" width="26" height="55" fill="oklch(0.5 0.03 260)" />

      {/* House shell */}
      <rect x="200" y="140" width="500" height="340" fill="url(#wallExt)" filter="url(#softShadow)" />

      {/* ========== ROOMS ========== */}
      {/* Upstairs floor divider */}
      <line x1="200" y1="270" x2="700" y2="270" stroke="oklch(0.85 0.01 250)" strokeWidth="3" />
      {/* Vertical wall dividers upstairs (bedroom | bath) */}
      <line x1="450" y1="140" x2="450" y2="270" stroke="oklch(0.85 0.01 250)" strokeWidth="3" />
      {/* Downstairs (living | kitchen) */}
      <line x1="450" y1="270" x2="450" y2="400" stroke="oklch(0.85 0.01 250)" strokeWidth="3" />
      {/* Ground/basement divider */}
      <line x1="200" y1="400" x2="700" y2="400" stroke="oklch(0.78 0.01 250)" strokeWidth="4" />

      {/* Bedroom */}
      <rect x="205" y="145" width="243" height="123" fill="url(#roomBedroom)" />
      {/* bed */}
      <rect x="230" y="215" width="120" height="45" rx="4" fill="oklch(0.88 0.02 30)" />
      <rect x="230" y="200" width="120" height="20" rx="3" fill="oklch(0.95 0.01 30)" />
      <rect x="235" y="205" width="35" height="12" rx="2" fill="oklch(0.98 0.005 250)" />
      {/* nightstand */}
      <rect x="360" y="235" width="25" height="25" fill="oklch(0.78 0.02 60)" />
      <circle cx="372" cy="230" r="6" fill="oklch(0.9 0.04 85)" opacity="0.7" />
      <text x="325" y="165" fontSize="11" fontWeight="600" fill="oklch(0.5 0.02 260)" textAnchor="middle" letterSpacing="0.5">BEDROOM</text>

      {/* Bathroom */}
      <rect x="453" y="145" width="243" height="123" fill="url(#roomBath)" />
      {/* tub */}
      <rect x="480" y="225" width="90" height="35" rx="8" fill="oklch(0.95 0.01 220)" stroke="oklch(0.85 0.01 220)" />
      {/* sink */}
      <rect x="600" y="220" width="60" height="30" rx="4" fill="oklch(0.9 0.01 220)" />
      <rect x="620" y="205" width="20" height="18" fill="oklch(0.95 0.005 220)" />
      <text x="574" y="165" fontSize="11" fontWeight="600" fill="oklch(0.5 0.02 260)" textAnchor="middle" letterSpacing="0.5">BATHROOM</text>

      {/* Living room */}
      <rect x="205" y="275" width="243" height="123" fill="url(#roomLiving)" />
      {/* sofa */}
      <rect x="235" y="345" width="130" height="35" rx="6" fill="oklch(0.78 0.03 60)" />
      <rect x="230" y="335" width="20" height="45" rx="4" fill="oklch(0.72 0.03 60)" />
      <rect x="350" y="335" width="20" height="45" rx="4" fill="oklch(0.72 0.03 60)" />
      {/* coffee table */}
      <rect x="260" y="385" width="80" height="8" rx="2" fill="oklch(0.6 0.04 60)" />
      {/* plant */}
      <circle cx="405" cy="360" r="14" fill="oklch(0.65 0.1 155)" />
      <rect x="399" y="370" width="12" height="20" fill="oklch(0.55 0.05 60)" />
      {/* picture */}
      <rect x="240" y="295" width="30" height="22" fill="oklch(0.95 0.01 250)" stroke="oklch(0.7 0.02 250)" />
      <text x="325" y="295" fontSize="11" fontWeight="600" fill="oklch(0.5 0.02 260)" textAnchor="middle" letterSpacing="0.5">LIVING ROOM</text>

      {/* Kitchen */}
      <rect x="453" y="275" width="243" height="123" fill="url(#roomKitchen)" />
      {/* counters */}
      <rect x="465" y="360" width="220" height="30" fill="oklch(0.82 0.01 150)" />
      <rect x="465" y="355" width="220" height="8" fill="oklch(0.7 0.02 150)" />
      {/* stove */}
      <rect x="510" y="345" width="45" height="15" fill="oklch(0.75 0.01 260)" />
      <circle cx="520" cy="352" r="3" fill="oklch(0.5 0.02 260)" />
      <circle cx="545" cy="352" r="3" fill="oklch(0.5 0.02 260)" />
      {/* sink */}
      <rect x="600" y="350" width="40" height="12" rx="3" fill="oklch(0.88 0.008 210)" />
      {/* upper cabinets */}
      <rect x="465" y="290" width="90" height="30" fill="oklch(0.85 0.01 60)" />
      <rect x="595" y="290" width="90" height="30" fill="oklch(0.85 0.01 60)" />
      <text x="574" y="295" fontSize="11" fontWeight="600" fill="oklch(0.5 0.02 260)" textAnchor="middle" letterSpacing="0.5">KITCHEN</text>

      {/* ========== BASEMENT ========== */}
      <rect x="205" y="405" width="491" height="75" fill="url(#basement)" />
      {/* concrete texture lines */}
      <line x1="205" y1="430" x2="696" y2="430" stroke="oklch(0.82 0.01 250)" strokeWidth="1" opacity="0.5" />
      <line x1="205" y1="455" x2="696" y2="455" stroke="oklch(0.82 0.01 250)" strokeWidth="1" opacity="0.5" />

      {/* Maintenance glow — whole utility room */}
      <rect
        x="205" y="405" width="491" height="75"
        fill={maint} opacity={isMaint ? 0.12 : 0}
        className={isMaint ? "soft-pulse" : ""}
        style={{ transition: "opacity 350ms" }}
      />

      {/* ========== DUCTWORK (basement horizontal trunk + risers) ========== */}
      <g style={{ transition: "opacity 350ms" }}>
        <rect
          x="270" y="415" width="360" height="14" rx="3"
          fill={ductFill} stroke={ductStrokeColor} strokeWidth={ductStrokeWidth}
        />
        {[
          [290, 270, 10, 145],
          [410, 270, 10, 145],
          [500, 270, 10, 145],
          [600, 270, 10, 145],
          [290, 140, 10, 130],
          [500, 140, 10, 130],
        ].map(([x, y, w, h], i) => (
          <rect
            key={i}
            x={x} y={y} width={w} height={h}
            fill={ductFill} stroke={ductStrokeColor} strokeWidth={ductStrokeWidth}
          />
        ))}
        {/* Furnace → main trunk */}
        {(showHeatingDucts || emphasizeDistribution) && (
          <path
            d="M 325 430 L 325 422 L 355 422"
            stroke={emphasizeDistribution ? heat : ductHighlightColor}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            className="flow-dash"
            opacity={emphasizeDistribution ? 0.85 : 1}
          />
        )}
      </g>

      {/* Cooling airflow overlay — blue flow through ducts */}
      <g opacity={showCoolingDucts ? 1 : 0} style={{ transition: "opacity 350ms" }}>
        <path
          d="M 355 422 L 620 422"
          stroke={cool} strokeWidth="4" fill="none" strokeLinecap="round"
          className="flow-dash"
        />
        <path d="M 295 415 L 295 145" stroke={cool} strokeWidth="3" fill="none" className="flow-dash" />
        <path d="M 505 415 L 505 145" stroke={cool} strokeWidth="3" fill="none" className="flow-dash" />
        <path d="M 415 415 L 415 275" stroke={cool} strokeWidth="3" fill="none" className="flow-dash" />
        <path d="M 605 415 L 605 275" stroke={cool} strokeWidth="3" fill="none" className="flow-dash" />
      </g>
      {/* Heating airflow overlay — warm orange */}
      <g opacity={showHeatingDucts && !emphasizeDistribution ? 1 : 0} style={{ transition: "opacity 350ms" }}>
        <path d="M 355 422 L 620 422" stroke={heat} strokeWidth="4" fill="none" strokeLinecap="round" className="flow-dash" />
        <path d="M 295 415 L 295 145" stroke={heat} strokeWidth="3" fill="none" className="flow-dash" />
        <path d="M 505 415 L 505 145" stroke={heat} strokeWidth="3" fill="none" className="flow-dash" />
        <path d="M 415 415 L 415 275" stroke={heat} strokeWidth="3" fill="none" className="flow-dash" />
        <path d="M 605 415 L 605 275" stroke={heat} strokeWidth="3" fill="none" className="flow-dash" />
      </g>
      {/* Steady heating paths when showing full distribution (ductwork service) */}
      <g opacity={emphasizeDistribution ? 0.75 : 0} style={{ transition: "opacity 350ms" }}>
        <path d="M 355 422 L 620 422" stroke={heat} strokeWidth="3" fill="none" strokeLinecap="round" className="flow-dash" />
        <path d="M 295 415 L 295 145" stroke={heat} strokeWidth="2.5" fill="none" className="flow-dash" />
        <path d="M 505 415 L 505 145" stroke={heat} strokeWidth="2.5" fill="none" className="flow-dash" />
        <path d="M 415 415 L 415 275" stroke={heat} strokeWidth="2.5" fill="none" className="flow-dash" />
        <path d="M 605 415 L 605 275" stroke={heat} strokeWidth="2.5" fill="none" className="flow-dash" />
      </g>

      {/* Supply vents (ceiling of upstairs & downstairs rooms) */}
      {[
        [285, 152], [505, 152],
        [285, 282], [415, 282], [505, 282], [605, 282],
      ].map(([x, y], i) => {
        const ventLit = isCooling || isHeating || showThermoDucts || emphasizeDistribution;
        const ventFill = ventLit
          ? ductHighlightColor
          : "oklch(0.75 0.01 250)";
        return (
        <g key={i}>
          <rect x={x - 8} y={y - 4} width="26" height="6" rx="1" fill={ventFill} opacity={ventLit ? 0.95 : 0.7} style={{ transition: "fill 350ms, opacity 350ms" }} />
          <circle
            cx={x + 5} cy={y + 8} r="18" fill="url(#glowCool)"
            opacity={isCooling ? 1 : 0}
            style={{ transition: "opacity 350ms" }}
          />
          <circle
            cx={x + 5} cy={y + 8} r="18" fill="url(#glowHeat)"
            opacity={isHeating && !emphasizeDistribution ? 1 : 0}
            style={{ transition: "opacity 350ms" }}
          />
          <circle
            cx={x + 5} cy={y + 8} r="16" fill="url(#glowDuct)"
            opacity={showThermoDucts || emphasizeDistribution ? 0.85 : 0}
            style={{ transition: "opacity 350ms" }}
          />
        </g>
        );
      })}

      {/* Return air path (from living room ceiling down to filter) */}
      <g opacity={isAir ? 1 : 0.4} style={{ transition: "opacity 350ms" }}>
        <path
          d="M 250 275 L 250 415"
          stroke={isAir ? air : "oklch(0.78 0.01 250)"}
          strokeWidth={isAir ? 4 : 3}
          strokeDasharray={isAir ? "6 10" : "2 4"}
          className={isAir ? "flow-dash" : ""}
          fill="none"
        />
      </g>

      {/* ========== EQUIPMENT (interactive) ========== */}

      {/* Thermostat — living room wall */}
      <g {...hoverHandlers("thermostat")}>
        <circle cx="440" cy="330" r="26" fill="url(#glowThermo)" opacity={isThermo ? 1 : 0} style={{ transition: "opacity 300ms" }} />
        <rect x="428" y="318" width="24" height="30" rx="4" fill="oklch(0.98 0.005 250)" stroke="oklch(0.65 0.02 260)" strokeWidth="1.2" />
        <rect x="431" y="322" width="18" height="14" rx="1.5" fill={isThermo ? thermo : "oklch(0.7 0.08 200)"} style={{ transition: "fill 300ms" }} />
        <text x="440" y="332" fontSize="7" fontWeight="700" fill="oklch(0.99 0 0)" textAnchor="middle">72°</text>
      </g>

      {/* Furnace */}
      <g {...hoverHandlers("heating")}>
        <circle cx="325" cy="450" r="40" fill="url(#glowHeat)" opacity={isHeating ? 1 : 0} style={{ transition: "opacity 300ms" }} />
        <rect x="305" y="430" width="40" height="45" rx="3" fill="oklch(0.55 0.02 260)" stroke="oklch(0.4 0.02 260)" />
        <rect x="310" y="435" width="30" height="18" rx="2" fill={isHeating ? heat : "oklch(0.35 0.03 40)"} style={{ transition: "fill 300ms" }} />
        <circle cx="325" cy="465" r="3" fill={isHeating ? heat : "oklch(0.5 0.02 260)"} />
        <text x="325" y="446" fontSize="6" fontWeight="700" fill="oklch(0.99 0 0)" textAnchor="middle">HEAT</text>
      </g>

      {/* Air Filter (part of the trunk between furnace and humidifier) */}
      <g {...hoverHandlers("air")}>
        <circle cx="405" cy="450" r="34" fill="url(#glowAir)" opacity={isAir ? 1 : 0} style={{ transition: "opacity 300ms" }} />
        <rect x="388" y="430" width="34" height="45" rx="3" fill="oklch(0.9 0.008 250)" stroke="oklch(0.7 0.015 250)" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="392" y1={436 + i * 8} x2="418" y2={436 + i * 8}
            stroke={isAir ? air : "oklch(0.65 0.02 250)"}
            strokeWidth="1.5"
            style={{ transition: "stroke 300ms" }}
          />
        ))}
      </g>

      {/* Humidifier */}
      <g {...hoverHandlers("air")}>
        <circle cx="475" cy="450" r="34" fill="url(#glowAir)" opacity={isAir ? 1 : 0} style={{ transition: "opacity 300ms" }} />
        <rect x="458" y="430" width="34" height="45" rx="3" fill="oklch(0.95 0.005 250)" stroke="oklch(0.7 0.015 250)" />
        <rect x="463" y="436" width="24" height="18" rx="2" fill={isAir ? air : "oklch(0.85 0.03 155)"} style={{ transition: "fill 300ms" }} />
        <circle cx="475" cy="463" r="4" fill={isAir ? air : "oklch(0.75 0.05 155)"} />
      </g>

      {/* Water heater — right side of basement */}
      <g {...hoverHandlers("water")}>
        <circle cx="610" cy="448" r="38" fill="url(#glowWater)" opacity={isWater ? 1 : 0} style={{ transition: "opacity 300ms" }} />
        <rect x="594" y="420" width="32" height="58" rx="14" fill="oklch(0.94 0.008 220)" stroke="oklch(0.7 0.015 220)" />
        <rect x="596" y="432" width="28" height="4" fill={isWater ? water : "oklch(0.7 0.02 220)"} style={{ transition: "fill 300ms" }} />
        <circle cx="610" cy="452" r="4" fill={isWater ? water : "oklch(0.75 0.03 220)"} />
        <rect x="605" y="415" width="10" height="8" rx="2" fill="oklch(0.6 0.02 260)" />
      </g>

      {/* Hot water lines — from water heater through wall chases to bathroom & kitchen */}
      <g opacity={showWaterPaths ? 1 : 0.35} style={{ transition: "opacity 350ms" }}>
        {/* Wall chases (shared paths through the structure) */}
        <rect x="565" y="145" width="12" height="265" rx="2" fill={water} opacity={showWaterPaths ? 0.12 : 0} style={{ transition: "opacity 350ms" }} />
        <rect x="633" y="350" width="12" height="58" rx="2" fill={water} opacity={showWaterPaths ? 0.12 : 0} style={{ transition: "opacity 350ms" }} />
        <rect x="565" y="398" width="52" height="10" rx="2" fill={water} opacity={showWaterPaths ? 0.12 : 0} style={{ transition: "opacity 350ms" }} />
        <path
          d="M 610 420 L 610 405 L 570 405 L 570 280 L 570 145"
          stroke={showWaterPaths ? water : "oklch(0.75 0.02 220)"}
          strokeWidth={showWaterPaths ? 3.5 : 2}
          fill="none"
          strokeLinecap="round"
          className={showWaterPaths ? "flow-dash" : ""}
          style={{ transition: "stroke 300ms" }}
        />
        <path
          d="M 610 420 L 610 405 L 640 405 L 640 355"
          stroke={showWaterPaths ? water : "oklch(0.75 0.02 220)"}
          strokeWidth={showWaterPaths ? 3.5 : 2}
          fill="none"
          strokeLinecap="round"
          className={showWaterPaths ? "flow-dash" : ""}
          style={{ transition: "stroke 300ms" }}
        />
        {showWaterPaths && (
          <>
            <circle cx="570" cy="145" r="5" fill={water} opacity="0.9" />
            <circle cx="640" cy="355" r="5" fill={water} opacity="0.9" />
          </>
        )}
      </g>

      {/* Outdoor AC condenser */}
      <g {...hoverHandlers("cooling")}>
        <circle cx="755" cy="440" r="48" fill="url(#glowCool)" opacity={isCooling ? 1 : 0} style={{ transition: "opacity 300ms" }} />
        <rect x="730" y="420" width="52" height="52" rx="5" fill="oklch(0.78 0.008 250)" stroke="oklch(0.6 0.015 250)" />
        <circle cx="756" cy="446" r="18" fill="oklch(0.55 0.02 250)" />
        <circle cx="756" cy="446" r="14" fill={isCooling ? cool : "oklch(0.7 0.02 250)"} style={{ transition: "fill 300ms" }} />
        <g stroke="oklch(0.98 0 0)" strokeWidth="2" strokeLinecap="round">
          <line x1="756" y1="434" x2="756" y2="458" />
          <line x1="744" y1="446" x2="768" y2="446" />
          <line x1="748" y1="438" x2="764" y2="454" />
          <line x1="764" y1="438" x2="748" y2="454" />
        </g>
        {/* line from AC into basement */}
        <line x1="730" y1="440" x2="696" y2="440" stroke={isCooling ? cool : "oklch(0.7 0.02 250)"} strokeWidth="2" />
      </g>

      {/* Maintenance small badges when active */}
      <g opacity={isMaint ? 1 : 0} style={{ transition: "opacity 300ms" }}>
        {[[325, 425], [405, 425], [475, 425], [610, 415]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="6" fill={maint} />
            <circle cx={x} cy={y} r="6" fill="none" stroke={maint} strokeOpacity="0.4" strokeWidth="3" className="soft-pulse" />
          </g>
        ))}
      </g>

      {/* ============ LABELS with connector lines ============ */}
      <Label x={175} y={90} anchor="end" title="SUPPLY AIR VENTS" desc="Comfort delivered to every room" toX={290} toY={148} />
      <Label x={155} y={220} anchor="end" title="THERMOSTAT" desc="Smart control for perfect comfort" toX={432} toY={330} />
      <Label x={155} y={370} anchor="end" title="RETURN AIR" desc="Air flows back for filtration and balance" toX={252} toY={340} />
      <Label x={155} y={470} anchor="end" title="FURNACE" desc="Heats your home in the winter" toX={310} toY={452} />

      <Label x={340} y={555} anchor="middle" title="AIR FILTER" desc="Captures dust, pollen &amp; allergens" toX={405} toY={478} />
      <Label x={510} y={555} anchor="middle" title="HUMIDIFIER" desc="Adds the right moisture to your air" toX={476} toY={478} />

      <Label x={745} y={555} anchor="middle" title="WATER HEATER" desc="Hot water for your home" toX={612} toY={478} />
      <Label x={870} y={370} anchor="end" title="OUTDOOR AC UNIT" desc="Cooling your home efficiently" toX={755} toY={420} />
    </svg>
  );
}

function Label({
  x, y, title, desc, toX, toY, anchor = "start",
}: {
  x: number; y: number; title: string; desc: string;
  toX: number; toY: number; anchor?: "start" | "middle" | "end";
}) {
  return (
    <g>
      <line x1={x} y1={y + 4} x2={toX} y2={toY} stroke="oklch(0.72 0.01 250)" strokeWidth="1" />
      <circle cx={toX} cy={toY} r="3" fill="oklch(0.55 0.02 260)" />
      <text x={x} y={y - 4} fontSize="9.5" fontWeight="700" fill="oklch(0.25 0.03 260)" textAnchor={anchor} letterSpacing="0.4">
        {title}
      </text>
      <text x={x} y={y + 10} fontSize="8.5" fill="oklch(0.5 0.02 260)" textAnchor={anchor}>
        {desc}
      </text>
    </g>
  );
}