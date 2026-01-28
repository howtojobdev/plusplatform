import { parseDuration } from "@/shared/utils/helperFunctions";
import { ClassType } from "../../domain/classType";

export const derviceClassAnalytics = (
    content: ClassType["content"]
) => {
    const totalItems = content.length;

    let itemsCompleted = 0;
    let itemsViewed = 0;

    let totalMinutes = 0;
    let completedMinutes = 0;

    let lastActivity: Date | null = null;

    for (const item of content) {
        const mins = parseDuration(item.estimatedDuration);
        totalMinutes += mins;

        if (item.isCompleted) {
            itemsCompleted += 1;
            completedMinutes += mins;
        }

        if (item.lastVisited && item.lastVisited.trim() !== "") {
            itemsViewed += 1;

            const d = new Date(item.lastVisited);
            if (!Number.isNaN(d.getTime())) {
                if (!lastActivity || d > lastActivity) lastActivity = d;
            }
        }
    }

    const weightedCompletionPercent =
        totalMinutes > 0 ? Math.round((completedMinutes / totalMinutes) * 100) : 0;

    const remainingMinutes = Math.max(0, totalMinutes - completedMinutes);

    return {
        itemsCompleted: totalItems === 0 ? 0 : itemsCompleted,
        itemsViewed: totalItems === 0 ? 0 : itemsViewed,
        weightedCompletionPercent,
        lastActivityISO: (lastActivity ?? new Date()).toISOString(),
        remainingMinutes,
    };
};