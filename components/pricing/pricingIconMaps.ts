import {
    ArrowTrendingUpIcon,
    BoltIcon,
    ChartBarIcon,
    CheckCircleIcon,
    CircleStackIcon,
    ClockIcon,
    CommandLineIcon,
    CpuChipIcon,
    DocumentPlusIcon,
    InformationCircleIcon,
    LifebuoyIcon,
    PencilSquareIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon as CheckBadgeSolid } from "@heroicons/react/24/solid";

export const trustIcons = {
    bolt: BoltIcon,
    shield: ShieldCheckIcon,
    command: CommandLineIcon,
} as const;

export type TrustIconKey = keyof typeof trustIcons;

export const addOnIcons = {
    shield: ShieldCheckIcon,
    cpu: CpuChipIcon,
    circleStack: CircleStackIcon,
    bolt: BoltIcon,
    documentPlus: DocumentPlusIcon,
    clock: ClockIcon,
} as const;

export type AddOnIconKey = keyof typeof addOnIcons;

export const packageIncludeIcons = {
    check: CheckCircleIcon,
    info: InformationCircleIcon,
    doneAll: CheckBadgeSolid,
    trendingUp: ArrowTrendingUpIcon,
    bolt: BoltIcon,
    analytics: ChartBarIcon,
    editNote: PencilSquareIcon,
    supportAgent: LifebuoyIcon,
} as const;

export type PackageIncludeIconKey = keyof typeof packageIncludeIcons;

export { BoltIcon, CheckCircleIcon };
