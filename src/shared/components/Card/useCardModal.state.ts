"use client";

import { create } from "zustand";
import type { ClassContentItemType, ClassType } from "@/features/class/domain/classType";
import type { ContentType } from "@/features/content/domain/contentType";
import { formatTimeFromMinString, parseDuration } from "@/shared/utils/helperFunctions";

export type CardModalOriginRect = {
    top: number;
    left: number;
    width: number;
    height: number;
};

export type CardModalItem =
    | { type: "class"; classData: ClassType }
    | { type: "content"; contentData: ContentType };

type CardModalPhase = "idle" | "opening" | "open" | "closing";

export type CardModalOpenArgs = {
    origin: CardModalOriginRect;
    item: CardModalItem;
    originId?: string;
    originKey?: string;
};

export type CardModalCloseArgs = {
    origin?: CardModalOriginRect;
    force?: boolean;
};

export type CardModalStateType = {
    isOpen: boolean;
    phase: CardModalPhase;

    origin: CardModalOriginRect | null;
    item: CardModalItem | null;

    originId?: string;
    originKey?: string;

    open: (args: CardModalOpenArgs) => void;

    startClose: (args?: CardModalCloseArgs) => void;
    finishClose: () => void;

    setOrigin: (origin: CardModalOriginRect | null) => void;
    setItem: (item: CardModalItem | null) => void;

    reset: () => void;

    isClassItem: (item: CardModalItem | null) => item is Extract<CardModalItem, { type: "class"; }>;
    isContentItem: (item: CardModalItem | null) => item is Extract<CardModalItem, { type: "content"; }>;

    getBaseContent: () => {
        id: string;
        published: boolean;
        title: string;
        synopsis: string;
        titleImage: string;
        typeLabel: string;
        releaseYear: string;
        duration: string;
        classItems: string;
        contentList: ClassContentItemType[];
    }
};

const initialState: Pick<CardModalStateType, "isOpen" | "phase" | "origin" | "item" | "originId" | "originKey"> = {
    isOpen: false,
    phase: "idle",
    origin: null,
    item: null,
    originId: undefined,
    originKey: undefined,
};

export const useCardModalState = create<CardModalStateType>((set, get) => ({
    ...initialState,

    open: ({ origin, item, originId, originKey }) => {
        set({
            isOpen: true,
            phase: "opening",
            origin,
            item,
            originId,
            originKey,
        });

        queueMicrotask(() => {
            if (get().phase === "opening") set({ phase: "open" });
        });
    },

    startClose: (args) => {
        const { force, origin } = args ?? {};
        if (force) {
            set({ ...initialState });
            return;
        }

        set((s) => ({
            ...s,
            phase: "closing",
            isOpen: true,
            origin: origin ?? s.origin,
        }));
    },

    finishClose: () => {
        set({ ...initialState });
    },

    setOrigin: (origin) => set({ origin }),
    setItem: (item) => set({ item }),

    reset: () => set({ ...initialState }),

    isClassItem: (item: CardModalItem | null): item is Extract<CardModalItem, { type: "class" }> =>
        !!item && item.type === "class",

    isContentItem: (item: CardModalItem | null): item is Extract<CardModalItem, { type: "content" }> =>
        !!item && item.type === "content",

    getBaseContent: () => {
        const { item, isClassItem, isContentItem } = get();

        let id = "";
        let published = false;
        let title = "";
        let synopsis = "";
        let titleImage = "";
        let typeLabel = "";
        let releaseYear = "";
        let duration = "";
        let classItems = "";
        let contentList: ClassContentItemType[] = [];

        if (isClassItem(item)) {
            id = item.classData.id;
            published = item.classData.status != "upcoming";
            title = item.classData.title;
            synopsis = item.classData.synopsis;
            titleImage = item.classData.titleImage;
            typeLabel = "class";
            releaseYear = (new Date(item.classData.updatedAt).getFullYear()).toString();
            let classDuration = 0;
            item.classData.content.map(item => classDuration += parseDuration(item.estimatedDuration));
            duration = formatTimeFromMinString(classDuration);
            classItems = `${item.classData.content.length} Items`;
            contentList = item.classData.content;
        }
        if (isContentItem(item)) {
            id = item.contentData.id;
            published = item.contentData.status != "upcoming";
            title = item.contentData.title;
            synopsis = item.contentData.synopsis;
            titleImage = item.contentData.titleImage;
            typeLabel = item.contentData.type;
            releaseYear = (new Date(item.contentData.updatedAt).getFullYear()).toString();
            duration = item.contentData.estimatedDuration;
            classItems = "";
            contentList = [];
        }

        return {
            id,
            published,
            title,
            synopsis,
            titleImage,
            typeLabel,
            releaseYear,
            duration,
            classItems,
            contentList
        }
    }
}));