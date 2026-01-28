"use client";

import { useEffect, useState } from "react";
import { cn } from "@/shared/utils/cn";

import { useUserPrefrenceStore } from "../../application/state/userPrefrenceState";
import { WeekStrip } from "./WeekStrip";
import { WeekWorkspace } from "./WeekWorkspace";
import Separator from "@/shared/components/Saperator";

export const CourseWorkView = () => {
    const weeks = useUserPrefrenceStore((s) => s.weeks);
    const [activeWeek, setActiveWeek] = useState(0);

    useEffect(() => {
        if (weeks.length === 0) setActiveWeek(0);
        else if (activeWeek >= weeks.length) setActiveWeek(weeks.length - 1);
    }, [weeks.length]);

    const week = weeks[activeWeek];

    return (
        <div className={cn("min-h-[100dvh] px-6 py-6")}>
            <div className="content-pad">
                <WeekStrip
                    weeks={weeks}
                    activeIndex={activeWeek}
                    onPick={setActiveWeek}
                />
                <Separator></Separator>
                {week ? (
                    <WeekWorkspace week={week} weekIndex={activeWeek} />
                ) : (
                    <div className="text-[var(--secondary-font)]">
                        No week available
                    </div>
                )}
            </div>
        </div>
    );
};