"use client";

import React, { useState, useCallback } from "react";
import { ClassType } from "@/features/class/domain/classType";
import { ContentType } from "@/features/content/domain/contentType";
import { UserFeedItemType } from "../../domain/userFeedType";
import { Card } from "@/shared/components/Card";
import { InfiniteRowCarousel } from "./InfiniteRowCarousel";

type HydratedFeedItem = UserFeedItemType & { data: ClassType | ContentType };
type FinalUserFeedMap = Record<string, HydratedFeedItem[]>;

type Props = {
    feedData: FinalUserFeedMap;
};

export const FeedCarousel = ({ feedData }: Props) => {
    const [draggingCarousel, setDraggingCarousel] = useState<string | null>(null);

    const handleDragChange = useCallback((carouselTitle: string, isDragging: boolean) => {
        setDraggingCarousel(isDragging ? carouselTitle : null);
    }, []);

    return (
        <div className="relative z-30 flex flex-col gap-6 -mt-[25dvh] px-4 md:px-12">
            <div className="flex flex-col gap-4">
                {Object.keys(feedData).map((carouselTitle) => {
                    const items = feedData[carouselTitle] ?? [];
                    const isThisCarouselDragging = draggingCarousel === carouselTitle;

                    return (
                        <section key={carouselTitle} className="w-full flex flex-col gap-2">
                            <h1 className="relative z-20 text-lg font-semibold text-white">{carouselTitle}</h1>

                            <CarouselWrapper
                                carouselTitle={carouselTitle}
                                items={items}
                                isDragging={isThisCarouselDragging}
                                onDragChange={handleDragChange}
                            />
                        </section>
                    );
                })}
            </div>
        </div>
    );
};

type CarouselWrapperProps = {
    carouselTitle: string;
    items: HydratedFeedItem[];
    isDragging: boolean;
    onDragChange: (carouselTitle: string, isDragging: boolean) => void;
};

const CarouselWrapper = ({ carouselTitle, items, isDragging, onDragChange }: CarouselWrapperProps) => {
    return (
        <InfiniteRowCarousel
            items={items}
            itemWidthPx={230}
            itemHeightPx={129}
            gapPx={8}
            cycles={11}
            overscan={24}
            onDragChange={(dragging) => onDragChange(carouselTitle, dragging)}
            renderItem={(cardData) => (
                <Card
                    key={cardData.contentId}
                    id={cardData.contentId}
                    type={cardData.type}
                    contentType={(cardData.data as ContentType)?.type ?? undefined}
                    classItems={(cardData.data as ClassType)?.content ?? undefined}
                    previewImage={cardData.data.previewImage}
                    titleImage={cardData.data.titleImage}
                    title={cardData.data.title}
                    updatedAt={cardData.data.updatedAt}
                    status={cardData.data.status}
                    synopsis={cardData.data.synopsis}
                    estimatedDuration={(cardData.data as ContentType).estimatedDuration}
                    compact
                    isDragging={isDragging}
                />
            )}
        />
    );
};