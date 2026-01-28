import { Eye, TrendingUp, Percent, Clock3 } from "lucide-react";
import { derviceClassAnalytics } from "../../application/factories/deriveClassAnalytics";
import { ClassType } from "../../domain/classType";
import { ClassAnalyticItem } from "./ClassAnalyticItem";
import { formatTimeFromMinString } from "@/shared/utils/helperFunctions";

type Props = {
    content: ClassType["content"];
};

export const ClassAnalytics = ({ content }: Props) => {
    const {
        itemsCompleted,
        itemsViewed,
        remainingMinutes,
        weightedCompletionPercent,
    } = derviceClassAnalytics(content);

    const totalItems = content.length;

    return (
        <div className="flex flex-wrap items-center gap-6 justify-evenly w-full p-4 py-12 bg-[var(--secondary-bg)]">
            <ClassAnalyticItem
                bg="bg-emerald-400/20"
                color="text-emerald-300"
                desc="Completed"
                title={`${itemsCompleted.toString()}/${totalItems}`}
                icon={<TrendingUp />}
            />

            <ClassAnalyticItem
                bg="bg-sky-400/20"
                color="text-sky-300"
                desc="Viewed"
                title={`${itemsViewed.toString()}/${totalItems}`}
                icon={<Eye />}
            />

            <ClassAnalyticItem
                bg="bg-violet-400/20"
                color="text-violet-300"
                desc="Progress"
                title={`${weightedCompletionPercent}%`}
                icon={<Percent />}
            />

            <ClassAnalyticItem
                bg="bg-amber-400/20"
                color="text-amber-300"
                desc={remainingMinutes >= 60 ? "Hours Left" : "Minutes Left"}
                title={formatTimeFromMinString(remainingMinutes)}
                icon={<Clock3 />}
            />
        </div>
    );
};