import { cn } from "@/shared/utils/cn";
import { Check } from "lucide-react";

type Props = {
    placement?: "topRight" | "topLeft";
};

export const CompletedChip = ({ placement = "topRight" }: Props) => {
    return (
        <div
            className={cn(
                "absolute p-2 rounded-full bg-[var(--primary-accent)] bg-green-400 shadow-lg",
                placement === "topRight"
                    ? "top-3 right-3"
                    : placement === "topLeft"
                        ? "top-3 left-3"
                        : ""
            )}
        >
            <Check className="text-black" size={12} />
        </div>
    );
};