import type { WeekPlanModel, WeekdayKeyModel, WeekDaysModel } from "../../domain/weekPlanType";

export const weekdayOrder: WeekdayKeyModel[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const labels: Record<WeekdayKeyModel, string> = {
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    sun: "Sun",
};

export const weekdayLabel = (k: WeekdayKeyModel) => labels[k];

const startOfLocalDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const parseYYYYMMDDLocal = (s: string) => {
    const [y, m, dd] = String(s ?? "").split("-").map((x) => Number(x));
    if (!y || !m || !dd) return null;
    return new Date(y, m - 1, dd);
};

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const cmpDay = (a: Date, b: Date) => {
    const aa = startOfLocalDay(a).getTime();
    const bb = startOfLocalDay(b).getTime();
    return aa === bb ? 0 : aa < bb ? -1 : 1;
};

export const dateForWeekday = (week: WeekPlanModel, weekday: WeekdayKeyModel) => {
    const base = parseYYYYMMDDLocal(week.startDate);
    if (!base) return null;
    const idx = weekdayOrder.indexOf(weekday);
    if (idx < 0) return null;
    return addDays(base, idx);
};

export function dayLockState(week: WeekPlanModel, weekday: WeekdayKeyModel) {
    const today = startOfLocalDay(new Date());
    const yesterday = addDays(today, -1);

    const weekStart = parseYYYYMMDDLocal(week.startDate);
    const weekEnd = parseYYYYMMDDLocal(week.endDate);

    if (weekStart && weekEnd) {
        if (cmpDay(weekEnd, today) < 0) {
            return {
                locked: true,
                lockedAt: null as WeekdayKeyModel | null,
                lockedAtLabel: "",
                reason: "This week has ended.",
                reasonCode: "week-past" as const,
            };
        }
        if (cmpDay(weekStart, today) > 0) {
            return {
                locked: true,
                lockedAt: null as WeekdayKeyModel | null,
                lockedAtLabel: "",
                reason: "This week hasn’t started yet.",
                reasonCode: "week-future" as const,
            };
        }
    }

    const days: WeekDaysModel = week.days;
    const pos = weekdayOrder.indexOf(weekday);

    for (let i = pos + 1; i < weekdayOrder.length; i++) {
        const d = days[weekdayOrder[i]];
        if (d && String(d.feedback ?? "").trim()) {
            return {
                locked: true,
                lockedAt: weekdayOrder[i],
                lockedAtLabel: weekdayLabel(weekdayOrder[i]),
                reason: `Locked because ${weekdayLabel(weekdayOrder[i])} feedback is submitted.`,
                reasonCode: "later-feedback" as const,
            };
        }
    }

    const dayDate = dateForWeekday(week, weekday);
    if (dayDate) {
        if (cmpDay(dayDate, yesterday) < 0) {
            return {
                locked: true,
                lockedAt: null as WeekdayKeyModel | null,
                lockedAtLabel: "",
                reason: "Locked, assesment window passed.",
                reasonCode: "day-too-old" as const,
            };
        }

        if (cmpDay(dayDate, today) > 0) {
            return {
                locked: true,
                lockedAt: null as WeekdayKeyModel | null,
                lockedAtLabel: "",
                reason: "Locked, future assesment.",
                reasonCode: "day-future" as const,
            };
        }
    }

    return {
        locked: false,
        lockedAt: null as WeekdayKeyModel | null,
        lockedAtLabel: "",
        reason: "",
        reasonCode: "none" as const,
    };
}