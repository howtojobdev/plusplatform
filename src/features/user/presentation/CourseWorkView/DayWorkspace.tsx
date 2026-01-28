// src/app/features/user/presentation/CourseWorkView/DayWorkspace.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/utils/cn";
import BrandButton from "@/shared/components/BrandButton";
import BrandInput from "@/shared/components/BrandInput";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";

import { useUserPrefrenceStore } from "../../application/state/userPrefrenceState";
import type { WeekDayPlanModel, WeekExpectationItemModel, WeekPlanModel, WeekdayKeyModel } from "../../domain/weekPlanType";
import { dayLockState } from "./weekUtils";

const hasAnyAns = (items: WeekExpectationItemModel[] | undefined | null) =>
    Array.isArray(items) && items.some((x) => String(x?.ans ?? "").trim().length > 0);

export const DayWorkspace = ({
    week,
    weekIndex,
    weekday,
}: {
    week: WeekPlanModel;
    weekIndex: number;
    weekday: WeekdayKeyModel;
}) => {
    const day: WeekDayPlanModel | null = week.days[weekday];
    if (!day) return null;

    const setExpectations = useUserPrefrenceStore((s) => s.studentSetExpectations);
    const setFeedback = useUserPrefrenceStore((s) => s.studentSetFeedback);

    const lock = useMemo(() => dayLockState(week, weekday), [week, weekday]);

    const [answers, setAnswers] = useState<WeekExpectationItemModel[]>(day.expectations ?? []);
    const [feedback, setFeedbackText] = useState(day.feedback ?? "");

    useEffect(() => {
        setAnswers(day.expectations ?? []);
        setFeedbackText(day.feedback ?? "");
    }, [weekday, day]);

    const expectationsSaved = hasAnyAns(day.expectations);
    const feedbackSaved = String(day.feedback ?? "").trim().length > 0;

    const expLocked = lock.locked || expectationsSaved || feedbackSaved;
    const fbLocked = lock.locked || feedbackSaved;

    return (
        <div className="space-y-6">
            <div className={cn("bg-[var(--primary-bg)] p-5 space-y-4", UI_ELEMENT_ROUNDNESS)}>
                <div>
                    <div className="text-[var(--primary-font)] font-medium">Expectations</div>
                    <div className="text-xs text-[var(--secondary-font)]">One-time answer. Locks after submission.</div>

                    {lock.locked ? (
                        <div className="text-xs text-[var(--secondary-font)] mt-1">{lock.reason}</div>
                    ) : null}
                </div>

                {answers.map((e, i) => (
                    <BrandInput
                        key={i}
                        value={e.ans}
                        disabled={expLocked}
                        label={e.ques}
                        placeholder="Write here..."
                        onChange={(ev) =>
                            setAnswers((prev) => prev.map((x, ix) => (ix === i ? { ...x, ans: ev } : x)))
                        }
                        className={cn(
                            "w-full rounded-xl px-4 py-2 bg-[var(--secondary-bg)]",
                            "text-[var(--primary-font)] focus:outline-none",
                            expLocked && "opacity-60",
                        )}
                    />
                ))}

                <BrandButton disabled={expLocked} onClick={() => setExpectations(weekIndex, weekday, answers)}>
                    Save Expectations
                </BrandButton>
            </div>

            <div className={cn("bg-[var(--primary-bg)] p-5 space-y-4", UI_ELEMENT_ROUNDNESS)}>
                <div>
                    <div className="text-[var(--primary-font)] font-medium">Feedback</div>

                    {lock.locked ? (
                        <div className="text-xs text-[var(--secondary-font)] mt-1">{lock.reason}</div>
                    ) : null}
                </div>

                <BrandInput
                    value={feedback}
                    disabled={fbLocked}
                    placeholder="Your journey for past days..."
                    onChange={(e) => setFeedbackText(e)}
                />

                <BrandButton disabled={fbLocked} onClick={() => setFeedback(weekIndex, weekday, feedback)}>
                    Save Feedback
                </BrandButton>
            </div>
        </div>
    );
};