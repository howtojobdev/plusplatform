"use client";

import React, { useMemo } from "react";
import type { StepByStepContentBlockType } from "../../../domain/contentBlockType";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { cn } from "@/shared/utils/cn";
import { StepNode } from "./StepNode";
import { motion, type Variants } from "framer-motion";

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

    const itemVariants = (i: number): Variants => ({
        hidden: { opacity: 0, y: 10 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                y: { type: "spring", stiffness: 420, damping: 34, delay: i * 0.06 },
                opacity: { duration: 0.28, ease: "easeOut", delay: i * 0.06 },
            },
        },
    });

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
                                <motion.div
                                    key={`${i}-${step.question}-${step.answer}`}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.15, margin: "200px 0px" }}
                                    variants={itemVariants(i)}
                                >
                                    <StepNode
                                        step={step}
                                        i={i}
                                        isLast={i === steps.length - 1}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};