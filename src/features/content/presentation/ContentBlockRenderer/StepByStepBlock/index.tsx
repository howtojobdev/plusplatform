"use client";

import React, { useMemo } from "react";
import type { StepByStepContentBlockType } from "../../../domain/contentBlockType";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { cn } from "@/shared/utils/cn";
import { StepNode } from "./StepNode";

type Props = {
    block: StepByStepContentBlockType;
    index: number;
};

export const StepByStepBlock = ({ block }: Props) => {
    const steps = useMemo(
        () =>
            (block.steps ?? []).filter(
                (s) =>
                    (s.preInfo?.trim()?.length ?? 0) > 0 ||
                    (s.question?.trim()?.length ?? 0) > 0 ||
                    (s.answer?.trim()?.length ?? 0) > 0,
            ),
        [block.steps],
    );

    if (!steps.length) return null;

    return (
        <section className="colored-block">
            <div className="content-pad">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-black text-lg font-display font-bold">
                            {block.title}
                        </h2>
                        {block.description?.trim() ? (
                            <p className="mt-2 text-black/70 text-sm">
                                {block.description}
                            </p>
                        ) : null}
                    </div>

                    <div
                        className={cn(
                            "bg-white/70 ring-1 ring-black/10 p-5 md:p-8",
                            UI_ELEMENT_ROUNDNESS,
                        )}
                    >
                        <div className="space-y-0">
                            {steps.map((step, i) => (
                                <div
                                    key={`${i}-${step.question}-${step.answer}`}
                                    className={cn(
                                        "opacity-0 translate-y-2",
                                        "animate-in fade-in slide-in-from-bottom-2 duration-300",
                                        "motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
                                    )}
                                >
                                    <StepNode
                                        step={step}
                                        i={i}
                                        isLast={i === steps.length - 1}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};