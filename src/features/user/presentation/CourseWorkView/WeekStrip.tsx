"use client";

import { cn } from "@/shared/utils/cn";
import type { WeekPlanModel } from "../../domain/weekPlanType";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { toDDMMYYYY } from "@/shared/utils/helperFunctions";

const titleForWeek = (w: WeekPlanModel, i: number) =>
    String(w.title ?? "").trim() || `Week ${i + 1}`;

export const WeekStrip = ({
    weeks,
    activeIndex,
    onPick,
}: {
    weeks: WeekPlanModel[];
    activeIndex: number;
    onPick: (i: number) => void;
}) => {
    return (
        <div className={cn(
            "bg-[var(--secondary-bg)] p-2",
            UI_ELEMENT_ROUNDNESS
        )}>
            <div className="flex gap-3 overflow-x-auto scrollbar overflow-y-hidden">
                {weeks.map((w, i) => {
                    const active = i === activeIndex;
                    return (
                        <button
                            key={i}
                            onClick={() => onPick(i)}
                            className={cn(
                                "w-fit text-left px-4 py-3 transition",
                                "bg-[var(--primary-bg)] focus:outline-none",
                                active ? "opacity-100" : "opacity-70 hover:opacity-100",
                                UI_ELEMENT_ROUNDNESS
                            )}
                        >
                            <div className="text-[var(--primary-font)] font-display">
                                {titleForWeek(w, i)}
                            </div>
                            <div className="text-xs text-[var(--secondary-font)]">
                                {toDDMMYYYY(w.startDate)} → {toDDMMYYYY(w.endDate)}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};