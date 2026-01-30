"use client";

import { useMemo } from "react";

import type { WeekPlanModel, WeekContentItemModel, WeekdayKeyModel } from "../../domain/weekPlanType";
import type { ContentType } from "@/features/content/domain/contentType";
import type { ClassType } from "@/features/class/domain/classType";

import { ContentCardItem } from "@/features/content/presentation/ContentCardItem";
import { ClassCardItem } from "@/features/class/presentation/ClassCardItem";

const isClassItem = (t: string) => {
    const x = String(t ?? "").toLowerCase();
    return x === "class" || x === "classcontent" || x === "class_content" || x === "class-content";
};

export const TopCards = ({
    week,
    weekday,
    classMap,
    contentMap,
    loading,
}: {
    week: WeekPlanModel;
    weekday: WeekdayKeyModel;
    classMap: Record<string, ClassType>;
    contentMap: Record<string, ContentType>;
    loading: boolean;
}) => {
    const dayItems = useMemo<WeekContentItemModel[]>(() => {
        const d = week.days[weekday];
        return d?.content ?? [];
    }, [week, weekday]);

    const classes = useMemo(() => {
        return dayItems
            .filter((x) => isClassItem(x.type))
            .map((x) => classMap[x.id])
            .filter(Boolean) as ClassType[];
    }, [dayItems, classMap]);

    const contents = useMemo(() => {
        return dayItems
            .filter((x) => !isClassItem(x.type))
            .map((x) => contentMap[x.id])
            .filter(Boolean) as ContentType[];
    }, [dayItems, contentMap]);

    const nothing = !loading && classes.length === 0 && contents.length === 0;
    if (nothing) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-end justify-between gap-3">
                <div className="space-y-0.5">
                    <div className="text-[var(--primary-font)] font-display text-base">Material for this day</div>
                </div>

                {loading ? <div className="text-xs text-[var(--secondary-font)]">Loading…</div> : null}
            </div>

            {classes.length ? (
                <div className="flex flex-wrap gap-3 overflow-visible scrollbar">
                    {classes.map((cl) => (
                        <ClassCardItem key={cl.id} classItem={cl} />
                    ))}
                </div>
            ) : null}

            {contents.length ? (
                <div className="flex flex-wrap gap-3 overflow-visible scrollbar">
                    {contents.map((c) => (
                        <ContentCardItem key={c.id} contentItem={c} compact />
                    ))}
                </div>
            ) : null}
        </div>
    );
};