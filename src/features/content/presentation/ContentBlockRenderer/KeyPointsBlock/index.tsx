"use client";

import { KeyPointsContentBlockType } from "@/features/content/domain/contentBlockType";
import React, { useMemo, useState } from "react";
import { KeyPointItem, KeyPointItemData } from "./KeyPointItem";

type Props = {
    block: KeyPointsContentBlockType;
    index: number;
};

export const KeyPointsBlock = ({ block }: Props) => {
    const keyPoints = useMemo<KeyPointItemData[]>(
        () =>
            (block.points ?? [])
                .map((point) => ({
                    question: (point.question ?? "").trim(),
                    answer: (point.answer ?? "").trim(),
                }))
                .filter((point) => point.question.length > 0 || point.answer.length > 0),
        [block.points],
    );

    const [openCardIndex, setOpenCardIndex] = useState<number | null>(null);

    const handleToggleCard = (cardIndex: number) => {
        setOpenCardIndex((current) => (current === cardIndex ? null : cardIndex));
    };

    return (
        <section className="w-full content-pad">
            <h2 className="mb-2 font-display text-[var(--primary-font)] text-xl leading-snug">
                {block.title ? block.title : "Key points"}
            </h2>

            {keyPoints.length === 0 ? (
                <p className="text-sm md:text-base text-[var(--secondary-font)]">
                    No key points yet.
                </p>
            ) : (
                <div
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {keyPoints.map((point, cardIndex) => (
                        <KeyPointItem
                            key={`${cardIndex}-${point.question}`}
                            point={point}
                            index={cardIndex}
                            total={keyPoints.length}
                            isOpen={openCardIndex === cardIndex}
                            onToggle={handleToggleCard}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};