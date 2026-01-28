import { cn } from "@/shared/utils/cn";
import { usePopupState } from "../application/state/usePopupState";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { X } from "lucide-react";

export const Popup = () => {
    const isVis = usePopupState(s => s.isVis);
    const message = usePopupState(s => s.message);
    const desc = usePopupState(s => s.desc);
    const hideToast = usePopupState(s => s.hideToast);

    return (
        <div
            className={cn(
                "fixed w-[90%] max-w-[320px] h-fit bg-[var(--secondary-bg)]",
                "z-[999] shadow-md bottom-2 right-2",
                "transition-transform duration-500 [transition-timing-function:cubic-bezier(.34,1.56,.64,1)]",
                isVis ? "translate-x-0" : "translate-x-[calc(100%+50%)]",
                "border border-[color-mix(in_srgb,var(--secondary-font)_18%,transparent)]",
                "p-4 flex flex-col gap-2",
                UI_ELEMENT_ROUNDNESS
            )}
        >
            <div
                className="flex items-center justify-between"
            >
                <h1
                    className="text-sm"
                >{message}</h1>
                <X
                    size={"0.875rem"}
                    className={cn(
                        "cursor-pointer"
                    )}
                    onClick={hideToast}
                ></X>
            </div>
            <p
                className="text-[var(--secondary-font)] text-sm flex-1"
            >{desc}</p>
        </div>
    );
};