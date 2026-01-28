"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FeedSectionCarousel } from "./FeedSectionCarousel";
import { ClassType } from "@/features/class/domain/classType";
import { ContentType } from "@/features/content/domain/contentType";
import { UserFeedItemType } from "../../domain/userFeedType";

type HydratedFeedItem = UserFeedItemType & { data: ClassType | ContentType };
type FinalUserFeedMap = Record<string, HydratedFeedItem[]>;

type Page = {
    id: string;
    seed: number;
};

type Props = {
    feedData: FinalUserFeedMap;
};

const hashString = (s: string) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};

export const ClientFeedRenderer = ({ feedData }: Props) => {
    const entries = useMemo(() => Object.entries(feedData), [feedData]);

    const [pages, setPages] = useState<Page[]>(() => [
        {
            id: "p0",
            seed: (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0,
        },
    ]);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            (rows) => {
                const hit = rows.some((r) => r.isIntersecting);
                if (!hit) return;

                setPages((prev) => {
                    const nextIndex = prev.length;
                    const base = prev[0]?.seed ?? 1;
                    const seed = (base ^ (nextIndex * 2654435761)) >>> 0;
                    return [...prev, { id: `p${nextIndex}`, seed }];
                });
            },
            { root: null, rootMargin: "1200px 0px 1200px 0px", threshold: 0.01 }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div className="relative z-30 flex flex-col gap-6 -mt-[25dvh] px-4 md:px-12">
            {pages.map((page) => (
                <div key={page.id} className="flex flex-col gap-6">
                    {entries.map(([sectionTitle, items]) => (
                        <section key={`${page.id}-${sectionTitle}`} className="w-full flex flex-col gap-3">
                            <h1 className="relative z-20 text-lg font-semibold text-white">{sectionTitle}</h1>
                            <div className="relative z-10">
                                <FeedSectionCarousel
                                    pageKey={page.id}
                                    seed={(page.seed ^ hashString(sectionTitle)) >>> 0}
                                    items={items ?? []}
                                />
                            </div>
                        </section>
                    ))}
                </div>
            ))}

            <div ref={sentinelRef} className="h-1 w-full" />
        </div>
    );
};