"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { PointsOfPurposeContentBlockType } from "@/features/content/domain/contentBlockType";
import { Chip } from "@/shared/components/Chip";
import { PurposeTitleButton } from "./PurposeTitleButton";

type Props = {
    block: PointsOfPurposeContentBlockType;
    index: number;
};

type PurposeItem = {
    title: string;
    detail: string;
};

export const PointsOfPurposeBlock = ({ block }: Props) => {
    const purposeItems = useMemo<PurposeItem[]>(() =>
        (block.points ?? [])
            .map((p) => ({
                title: (p.question ?? "").trim(),
                detail: (p.answer ?? "").trim(),
            }))
            .filter((p) => p.title.length > 0 || p.detail.length > 0),
        [block.points]);

    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    return (
        <section className="w-full content-pad">
            <div className="flex items-center justify-between gap-4 mb-2">
                <h2 className="text-[var(--primary-font)] text-lg font-display leading-snug">
                    Why this exists
                </h2>

                <Chip text={purposeItems.length.toString()}></Chip>
            </div>

            {purposeItems.length === 0 ? (
                <p className="text-sm md:text-base text-[var(--secondary-font)]">
                    No key points yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className={cn("lg:col-span-5 bg-[var(--secondary-bg)] overflow-hidden", UI_ELEMENT_ROUNDNESS)}>
                        <div className="p-2">
                            {purposeItems.map((item, index) => {
                                const isActive = activeIndex === index;
                                return (
                                    <PurposeTitleButton
                                        index={index}
                                        isActive={isActive}
                                        title={item.title}
                                        setActiveIndex={setActiveIndex}
                                    ></PurposeTitleButton>
                                );
                            })}
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className={cn(
                            "relative border border-white/10 bg-[var(--primary-bg)] overflow-hidden",
                            UI_ELEMENT_ROUNDNESS
                        )}>
                            <div className="relative p-5 sm:p-6">
                                {activeIndex === null ? (
                                    <div className="rounded-xl border border-white/10 bg-[var(--secondary-bg)] p-4">
                                        <p className="text-sm text-[var(--secondary-font)]">
                                            Select a point on the left to view its explanation.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-xs text-[var(--secondary-font)]">
                                                    Purpose point{" "}
                                                    <span className="text-[var(--primary-font)] font-semibold">
                                                        {activeIndex + 1}
                                                    </span>{" "}
                                                    of{" "}
                                                    <span className="text-[var(--primary-font)] font-semibold">
                                                        {purposeItems.length}
                                                    </span>
                                                </p>

                                                <h3 className="mt-2 font-display text-[var(--primary-font)] text-lg sm:text-xl leading-snug">
                                                    {purposeItems[activeIndex]?.title || "Untitled purpose"}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className={cn("mt-4 border border-white/10 bg-[var(--secondary-bg)] p-4 sm:p-5", UI_ELEMENT_ROUNDNESS)}>
                                            <p className="text-sm sm:text-base text-[var(--secondary-font)] leading-relaxed whitespace-pre-line">
                                                {purposeItems[activeIndex]?.detail
                                                    ? purposeItems[activeIndex].detail
                                                    : "No explanation provided."}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                                            <span className="text-xs text-[var(--secondary-font)] opacity-80">
                                                Tip: skim the titles first, then open the ones that matter.
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};