"use client";

import React, { useMemo } from "react";
import { InfiniteDraggableCarousel } from "./InfiniteDraggableCarousel";
import { FeedItemCard } from "./FeedItemCard";
import { ClassType } from "@/features/class/domain/classType";
import { ContentType } from "@/features/content/domain/contentType";
import { UserFeedItemType } from "../../domain/userFeedType";
import { NETFLIX_COMPACT_CARD_HEIGHT, NETFLIX_COMPACT_CARD_WIDTH } from "@/shared/components/NetflixCard/config";

type HydratedFeedItem = UserFeedItemType & { data: ClassType | ContentType };

type Props = {
    items: HydratedFeedItem[];
    seed: number;
    pageKey: string;
};

function shuffle<T>(arr: T[], seed: number) {
    const a = arr.slice();
    let t = seed >>> 0;

    const rnd = () => {
        t += 0x6d2b79f5;
        let x = t;
        x = Math.imul(x ^ (x >>> 15), x | 1);
        x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };

    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export const FeedSectionCarousel = ({ items, seed, pageKey }: Props) => {
    const finalItems = useMemo(() => {
        const list = items ?? [];
        const firstTwo = list.slice(0, 2);
        const rest = list.slice(2);
        const shuffled = rest.length ? shuffle(rest, seed) : rest;
        return [...firstTwo, ...shuffled];
    }, [items, seed]);

    return (
        <InfiniteDraggableCarousel
            items={finalItems}
            itemWidthPx={NETFLIX_COMPACT_CARD_WIDTH}
            itemHeightPx={NETFLIX_COMPACT_CARD_HEIGHT}
            gapPx={4}
            cycles={11}
            overscan={16}
            renderItem={(item, baseIndex, virtualIndex) => (
                <div className="h-full">
                    <FeedItemCard
                        key={`${pageKey}-${item.type}-${item.contentId}-${virtualIndex}`}
                        item={item}
                        instanceId={`${pageKey}-${virtualIndex}`}
                    />
                </div>
            )}
        />
    );
};