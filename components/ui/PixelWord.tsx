import PixelKeyword from "@/components/ui/PixelKeyword";

type PixelWordProps = {
    text: string;
    variant?: "highlight" | "base";
    className?: string;
};

export default function PixelWord({
    text,
    variant = "highlight",
    className = "",
}: PixelWordProps) {
    return (
        <PixelKeyword variant={variant} className={className}>
            {text}
        </PixelKeyword>
    );
}
