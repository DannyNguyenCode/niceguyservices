import {
    BoltIcon,
    CheckCircleIcon,
    CircleStackIcon,
    CommandLineIcon,
    CpuChipIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/solid";

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
} as const;

export type AddOnIconKey = keyof typeof addOnIcons;

export { BoltIcon, CheckCircleIcon };
