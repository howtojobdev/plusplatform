import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { cn } from "@/shared/utils/cn";

type Props = {
    setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
    isActive: boolean;
    title: string;
    index: number;
};

export const PurposeTitleButton = ({
    setActiveIndex,
    isActive,
    title,
    index
}: Props) => {
    return (
        <button
            type="button"
            onClick={() =>
                setActiveIndex((cur) => (cur === index ? null : index))
            }
            className={cn(
                "w-full text-left px-3 py-3 transition", UI_ELEMENT_ROUNDNESS,
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary-accent)]",
                isActive
                    ? "bg-white/5 border border-white/10"
                    : "hover:bg-white/5 border border-transparent",
            )}
        >
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-xl border border-white/10 bg-[var(--secondary-bg)] grid place-items-center">
                    <span className="text-xs font-semibold text-[var(--primary-font)]">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                </div>

                <div className="min-w-0">
                    <p className="text-[var(--primary-font)] font-semibold leading-snug line-clamp-2">
                        {title || "Untitled purpose"}
                    </p>
                    <p className="mt-1 text-xs text-[var(--secondary-font)] opacity-80">
                        {isActive ? "Selected" : "Tap to open"}
                    </p>
                </div>

                <div className="ml-auto shrink-0">
                    <span
                        className={[
                            "inline-flex h-8 w-8 items-center justify-center rounded-full",
                            "border border-white/10 bg-[var(--secondary-bg)]",
                            "text-[var(--secondary-font)]",
                            "transition",
                            isActive ? "rotate-90" : "rotate-0",
                        ].join(" ")}
                        aria-hidden="true"
                    >
                        ›
                    </span>
                </div>
            </div>
        </button>
    );
};