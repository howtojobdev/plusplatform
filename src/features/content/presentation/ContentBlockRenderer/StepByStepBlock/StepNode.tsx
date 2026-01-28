"use client";

import React from "react";
import type { StepContentBlockItemType } from "../../../domain/contentBlockType";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { cn } from "@/shared/utils/cn";

const norm = (s?: string) => (s ?? "").trim().toLowerCase();

type StepNodeProps = {
    step: StepContentBlockItemType;
    i: number;
    isLast: boolean;
};

export const StepNode = ({ step, i, isLast }: StepNodeProps) => {
    const title = step.question?.trim() ? step.question : `Step ${i + 1}`;
    const preInfo = step.preInfo?.trim() ? step.preInfo : "";
    const showPreInfo = !!preInfo && norm(preInfo) !== norm(title);

    return (
        <div className="group relative grid grid-cols-[44px_1fr] gap-4">
            <div className="relative flex flex-col items-center">
                <div
                    className={cn(
                        "h-10 w-10 bg-black/5 ring-1 ring-black/15 flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md",
                        UI_ELEMENT_ROUNDNESS,
                    )}
                >
                    <span className="text-sm font-semibold text-black">{i + 1}</span>
                </div>

                {!isLast && (
                    <div className="mt-3 w-[2px] flex-1 rounded-full bg-black/15 transition-colors duration-200 group-hover:bg-black/25" />
                )}
            </div>

            <div className="min-w-0 pb-8 cursor-pointer">
                <div
                    className={cn(
                        "bg-white ring-1 ring-black/15 shadow-sm overflow-hidden transition-all duration-200 group-hover:ring-black/25 group-hover:shadow-md group-hover:-translate-y-0.5",
                        UI_ELEMENT_ROUNDNESS,
                    )}
                >
                    <div className="px-5 py-4 border-b border-black/10">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-2 w-2 rounded-full bg-black/55 transition-transform duration-200 group-hover:scale-110" />
                            <h3 className="text-black text-sm truncate">
                                {title}
                            </h3>
                        </div>

                        {showPreInfo ? (
                            <p className="mt-2 text-sm text-black/70">{preInfo}</p>
                        ) : null}
                    </div>

                    {step.answer?.trim() ? (
                        <div className="px-5 py-4">
                            <p className="text-sm leading-6 text-black/85 whitespace-pre-wrap">
                                {step.answer}
                            </p>
                        </div>
                    ) : null}

                    <div className="h-1 w-full bg-black/5">
                        <div className="h-full w-0 bg-black/40 transition-all duration-300 group-hover:w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};