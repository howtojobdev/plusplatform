import { cn } from "../utils/cn";

export type ProgressChipStateType = "todo" | "doing" | "done";

type Props = {
    status: ProgressChipStateType;
};

export const ProgressChip = ({ status }: Props) => {
    let text = "";
    let styles = "";

    switch (status) {
        case "todo":
            text = "TODO";
            styles =
                "bg-red-500/15 text-red-400 border-red-500/40 shadow-red-500/20";
            break;

        case "doing":
            text = "IN PROGRESS";
            styles =
                "bg-blue-500/15 text-blue-400 border-blue-500/40 shadow-blue-500/20";
            break;

        case "done":
            text = "COMPLETED";
            styles =
                "bg-green-500/15 text-green-400 border-green-500/40 shadow-green-500/20";
            break;
    }

    return (
        <span
            className={cn(
                "inline-flex items-center justify-center w-fit",
                "px-4 py-1 rounded-full border text-xs font-semibold tracking-wide",
                "shadow-sm backdrop-blur-sm",
                styles
            )}
        >
            {text}
        </span>
    );
};