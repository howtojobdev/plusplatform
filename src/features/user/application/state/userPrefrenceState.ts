// src/app/features/user/application/state/userPrefrenceState.ts
import { create } from "zustand";
import { ApiResponseType } from "@/shared/types/ApiResponseType";
import type { UserPrefrenceType } from "../../domain/userPrefrenceType";
import { WeekdayKeyModel, WeekExpectationItemModel, WeekPlanModel } from "../../domain/weekPlanType";

type WeeksLoadingKey =
    | `load:${string}`
    | `toggleBookmark:${string}`
    | `studentExpectations:${number}:${WeekdayKeyModel}`
    | `studentFeedback:${number}:${WeekdayKeyModel}`;

export type UserPrefrenceStateType = UserPrefrenceType & {
    loadingMap: Record<string, boolean>;

    loadPrefrences: (userId: string) => Promise<void>;
    toggleBookmark: (bookmarkId: string, userId: string) => Promise<void>;

    studentSetExpectations: (weekIndex: number, weekday: WeekdayKeyModel, expectations: WeekExpectationItemModel[]) => Promise<void>;

    studentSetFeedback: (weekIndex: number, weekday: WeekdayKeyModel, feedback: string) => Promise<void>;
};

export const useUserPrefrenceStore = create<UserPrefrenceStateType>((set, get) => {
    const setLoading = (key: string, v: boolean) =>
        set((s) => ({
            loadingMap: v
                ? { ...s.loadingMap, [key]: true }
                : (() => {
                    const { [key]: _, ...rest } = s.loadingMap;
                    return rest;
                })(),
        })) as any;

    const safeWeeksUpdate = (updater: (weeks: WeekPlanModel[]) => WeekPlanModel[]) => {
        set((s) => ({ weeks: updater(s.weeks) }));
    };

    const applyUpstreamWeeks = (weeks: WeekPlanModel[] | undefined | null) => {
        if (!Array.isArray(weeks)) return;
        set({ weeks });
    };

    return {
        loadingMap: {},
        bookmarks: [],
        weeks: [],

        loadPrefrences: async (userId: string) => {
            const key: WeeksLoadingKey = `load:${userId}`;
            if (get().loadingMap[key]) return;

            try {
                setLoading(key, true);

                const res = await fetch(`/api/user/${userId}`, { cache: "no-store" });
                const json: ApiResponseType<UserPrefrenceType> = await res.json();

                if (!json.successful) return;

                set({
                    bookmarks: json.data.bookmarks ?? [],
                    weeks: json.data.weeks ?? [],
                });
            } catch (err) {
                console.error("Failed to load preferences", err);
            } finally {
                setLoading(key, false);
            }
        },

        toggleBookmark: async (bookmarkId: string, userId: string) => {
            const key: WeeksLoadingKey = `toggleBookmark:${bookmarkId}`;
            const { bookmarks, loadingMap } = get();
            if (loadingMap[key]) return;

            set((state) => ({
                loadingMap: { ...state.loadingMap, [key]: true },
                bookmarks: bookmarks.includes(bookmarkId) ? bookmarks.filter((id) => id !== bookmarkId) : [...bookmarks, bookmarkId],
            }));

            try {
                const res = await fetch(`/api/user/toggleBookmark`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, bookmarkId }),
                    cache: "no-store",
                });

                const json: ApiResponseType<string[]> = await res.json();

                if (!json.successful) {
                    set({ bookmarks });
                    return;
                }

                set({ bookmarks: Array.isArray(json.data) ? json.data : get().bookmarks });
            } catch (err) {
                set({ bookmarks });
                console.error("Failed to toggle bookmark", err);
            } finally {
                set((state) => {
                    const { [key]: _, ...rest } = state.loadingMap;
                    return { loadingMap: rest };
                });
            }
        },

        studentSetExpectations: async (weekIndex, weekday, expectations) => {
            const key: WeeksLoadingKey = `studentExpectations:${weekIndex}:${weekday}`;
            if (get().loadingMap[key]) return;

            const prevWeeks = get().weeks;

            safeWeeksUpdate((weeks) => {
                const next = [...weeks];
                const w = next[weekIndex];
                if (!w) return weeks;

                const days = { ...w.days } as any;
                const existingDay = days[weekday] ?? { content: [], expectations: [], feedback: "" };

                days[weekday] = {
                    ...existingDay,
                    expectations: Array.isArray(expectations) ? expectations : [],
                };

                next[weekIndex] = { ...w, days };
                return next;
            });

            try {
                setLoading(key, true);

                const res = await fetch(`/api/user/expectations`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ weekIndex, weekday, expectations }),
                    cache: "no-store",
                });

                const json: ApiResponseType<{ weeks: WeekPlanModel[] }> = await res.json();

                if (!json.successful) {
                    set({ weeks: prevWeeks });
                    return;
                }

                applyUpstreamWeeks(json.data?.weeks);
            } catch (err) {
                set({ weeks: prevWeeks });
                console.error("Failed to set expectations", err);
            } finally {
                setLoading(key, false);
            }
        },

        studentSetFeedback: async (weekIndex, weekday, feedback) => {
            const key: WeeksLoadingKey = `studentFeedback:${weekIndex}:${weekday}`;
            if (get().loadingMap[key]) return;

            const prevWeeks = get().weeks;

            safeWeeksUpdate((weeks) => {
                const next = [...weeks];
                const w = next[weekIndex];
                if (!w) return weeks;

                const days = { ...w.days } as any;
                const existingDay = days[weekday] ?? { content: [], expectations: [], feedback: "" };

                days[weekday] = {
                    ...existingDay,
                    feedback: String(feedback ?? ""),
                };

                next[weekIndex] = { ...w, days };
                return next;
            });

            try {
                setLoading(key, true);

                const res = await fetch(`/api/user/feedback`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ weekIndex, weekday, feedback }),
                    cache: "no-store",
                });

                const json: ApiResponseType<{ weeks: WeekPlanModel[] }> = await res.json();

                if (!json.successful) {
                    set({ weeks: prevWeeks });
                    return;
                }

                applyUpstreamWeeks(json.data?.weeks);
            } catch (err) {
                set({ weeks: prevWeeks });
                console.error("Failed to set feedback", err);
            } finally {
                setLoading(key, false);
            }
        },
    };
});