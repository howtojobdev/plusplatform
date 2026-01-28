import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { cn } from "@/shared/utils/cn";

type Props = {
    title: string;
    desc: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
}

export const ClassAnalyticItem = ({
    title,
    desc,
    color,
    bg,
    icon
}: Props) => {
    return (
        <div className="flex flex-col gap-2 min-w-[120px] h-[60px]">
            <div className="flex items-center gap-2">
                {icon && <span className={cn(
                    "shrink-0 w-[40px] h-[40px] flex items-center justify-center",
                    bg, color, UI_ELEMENT_ROUNDNESS
                )}>{icon}</span>}
                <h1 className="display-font font-semibold text-3xl">{title}</h1>
            </div>
            <div className="flex items-center gap-2 -mt-4">
                <div className="w-[40px] h-[40px]" />
                <p className="text-[var(--secondary-font)] text-xs -mt-2">{desc}</p>
            </div>
        </div>
    );
};