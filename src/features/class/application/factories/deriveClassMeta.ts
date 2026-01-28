import { parseDuration } from "@/shared/utils/helperFunctions";
import { ClassType } from "../../domain/classType";
import { ProgressChipStateType } from "@/shared/components/ProgressChip";

export const deriveClassProgress = (content: ClassType["content"]) => {
    let totalDuration = 0;
    let completedDuration = 0;

    let latestVisitedDate: Date | null = null;
    let continueItem: typeof content[number] | null = null;

    let hasAnyVisited = false;
    let hasAnyCompleted = false;

    for (const item of content) {
        const duration = parseDuration(item.estimatedDuration);
        totalDuration += duration;

        if (item.isCompleted) {
            completedDuration += duration;
            hasAnyCompleted = true;
        }

        if (item.lastVisited) {
            hasAnyVisited = true;
            const visitedDate = new Date(item.lastVisited);

            if (!latestVisitedDate || visitedDate > latestVisitedDate) {
                latestVisitedDate = visitedDate;

                if (!item.isCompleted) {
                    continueItem = item;
                }
            }
        }
    }

    if(!continueItem) continueItem = content[0];

    // progress %
    const progress =
        totalDuration === 0
            ? 0
            : Math.round((completedDuration / totalDuration) * 100);

    // chip status
    let chipProgress: ProgressChipStateType = "todo";

    if (completedDuration === totalDuration && totalDuration > 0) {
        chipProgress = "done";
    } else if (hasAnyCompleted || hasAnyVisited) {
        chipProgress = "doing";
    }

    return {
        chipProgress,
        progress,
        lastVisited: latestVisitedDate
            ? latestVisitedDate
            : new Date(),
        continueLink: continueItem
            ? `/${continueItem.type}?watch=${continueItem.id}`
            : "",
    };
}