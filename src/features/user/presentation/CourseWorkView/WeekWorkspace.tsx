// src/app/features/user/presentation/CourseWorkView/WeekWorkspace.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/utils/cn";

import type { WeekPlanModel, WeekdayKeyModel, WeekContentItemModel } from "../../domain/weekPlanType";
import type { ContentType } from "@/features/content/domain/contentType";
import type { ClassType } from "@/features/class/domain/classType";
import type { ApiResponseType } from "@/shared/types/ApiResponseType";

import { weekdayLabel, weekdayOrder } from "./weekUtils";
import { DayWorkspace } from "./DayWorkspace";
import { TopCards } from "./TopCards";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import BrandButton from "@/shared/components/BrandButton";

const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

const isClassItem = (t: string) => {
    const x = String(t ?? "").toLowerCase();
    return x === "class" || x === "classcontent" || x === "class_content" || x === "class-content";
};

const collectWeekItems = (week: WeekPlanModel): WeekContentItemModel[] => {
    const out: WeekContentItemModel[] = [];
    const days = week.days;
    for (const k of Object.keys(days) as (keyof typeof days)[]) {
        const d = days[k];
        if (!d) continue;
        for (const c of d.content ?? []) out.push(c);
    }
    return out;
};

const filledDaysCount = (week: WeekPlanModel) => {
    let c = 0;
    for (const k of weekdayOrder) {
        const d = week.days[k];
        if (!d) continue;
        const exp = Array.isArray(d.expectations) ? d.expectations : [];
        const fb = String(d.feedback ?? "").trim();
        if (exp.length || fb) c += 1;
    }
    return c;
};

export const WeekWorkspace = ({ week, weekIndex }: { week: WeekPlanModel; weekIndex: number }) => {
    const validDays = weekdayOrder.filter((d) => week.days[d] !== null);
    const [weekday, setWeekday] = useState<WeekdayKeyModel>(validDays[0]);

    useEffect(() => {
        if (!validDays.includes(weekday)) setWeekday(validDays[0]);
    }, [validDays.join(","), weekday]);

    const filled = useMemo(() => filledDaysCount(week), [week]);

    const items = useMemo(() => collectWeekItems(week), [week]);

    const classIds = useMemo(
        () => uniq(items.filter((x) => isClassItem(x.type)).map((x) => x.id)),
        [items],
    );

    const contentIds = useMemo(
        () => uniq(items.filter((x) => !isClassItem(x.type)).map((x) => x.id)),
        [items],
    );

    const [classMap, setClassMap] = useState<Record<string, ClassType>>({});
    const [contentMap, setContentMap] = useState<Record<string, ContentType>>({});
    const [cardsLoading, setCardsLoading] = useState(false);

    useEffect(() => {
        let mounted = true;

        const run = async () => {
            const hasAny = classIds.length || contentIds.length;

            if (!hasAny) {
                if (mounted) {
                    setClassMap({});
                    setContentMap({});
                    setCardsLoading(false);
                }
                return;
            }

            if (mounted) setCardsLoading(true);

            try {
                const [c1, c2] = await Promise.all([
                    classIds.length
                        ? fetch(`/api/class/ids`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ids: classIds }),
                            cache: "no-store",
                        })
                        : null,
                    contentIds.length
                        ? fetch(`/api/content/ids`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ids: contentIds }),
                            cache: "no-store",
                        })
                        : null,
                ]);

                const classesJson: ApiResponseType<ClassType[]> | null = c1
                    ? ((await c1.json()) as ApiResponseType<ClassType[]>)
                    : null;

                const contentsJson: ApiResponseType<ContentType[]> | null = c2
                    ? ((await c2.json()) as ApiResponseType<ContentType[]>)
                    : null;

                if (!mounted) return;

                const classesArr = Array.isArray(classesJson?.data) ? classesJson!.data : [];
                const contentsArr = Array.isArray(contentsJson?.data) ? contentsJson!.data : [];

                const nextClassMap: Record<string, ClassType> = {};
                for (const c of classesArr) nextClassMap[c.id] = c;

                const nextContentMap: Record<string, ContentType> = {};
                for (const c of contentsArr) nextContentMap[c.id] = c;

                setClassMap(nextClassMap);
                setContentMap(nextContentMap);
            } catch {
                if (!mounted) return;
                setClassMap({});
                setContentMap({});
            } finally {
                if (!mounted) return;
                setCardsLoading(false);
            }
        };

        run();
        return () => {
            mounted = false;
        };
    }, [classIds.join(","), contentIds.join(",")]);

    return (
        <div className={cn("bg-[var(--secondary-bg)] p-4 sm:p-6 space-y-6", UI_ELEMENT_ROUNDNESS)}>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <div className="text-[var(--primary-font)] font-display">
                        {String(week?.title ?? "").trim() || `Week ${weekIndex + 1}`}
                    </div>
                    {String(week?.description ?? "").trim() ? (
                        <div className="text-[var(--secondary-font)] text-sm max-w-3xl">{week.description}</div>
                    ) : null}
                </div>
            </div>

            <div className="space-y-3">
                <div className="text-[var(--primary-font)] font-display">Days</div>

                <div className={cn("inline-flex flex-wrap gap-2 bg-[var(--primary-bg)] p-1", UI_ELEMENT_ROUNDNESS)}>
                    {validDays.map((k) => {
                        const active = k === weekday;
                        return (
                            <BrandButton key={k} onClick={() => setWeekday(k)} variant={active ? "cta" : "ghost"}>
                                {weekdayLabel(k)}
                            </BrandButton>
                        );
                    })}
                </div>
            </div>

            <TopCards
                week={week}
                weekday={weekday}
                classMap={classMap}
                contentMap={contentMap}
                loading={cardsLoading}
            />

            <DayWorkspace week={week} weekIndex={weekIndex} weekday={weekday} />
        </div>
    );
};