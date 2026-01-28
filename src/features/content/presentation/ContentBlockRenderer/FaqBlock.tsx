"use client";

import React, { useMemo, useState } from "react";
import type { FaqContentBlockType } from "../../domain/contentBlockType";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { cn } from "@/shared/utils/cn";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
    block: FaqContentBlockType;
    index: number;
};

export const FaqBlock = ({ block }: Props) => {
    const items = useMemo(
        () =>
            (block.items ?? []).filter(
                (i) =>
                    (i.question?.trim()?.length ?? 0) > 0 ||
                    (i.answer?.trim()?.length ?? 0) > 0,
            ),
        [block.items],
    );

    const [open, setOpen] = useState<number | null>(null);
    const reduceMotion = useReducedMotion();

    if (!items.length) return null;

    const handleToggle = (idx: number) => {
        setOpen((current) => (current === idx ? null : idx));
    };

    return (
        <section className="colored-block">
            <div className="content-pad">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-black text-lg font-display font-bold">FAQ</h2>
                        <p className="text-black/70 text-sm">
                            Common questions, answered clearly.
                        </p>
                    </div>

                    <div
                        className={cn(
                            "bg-white/70 ring-1 ring-black/10 p-5 md:p-8",
                            UI_ELEMENT_ROUNDNESS,
                        )}
                    >
                        <div className="space-y-3 sm:space-y-4">
                            {items.map((item, idx) => {
                                const isOpen = open === idx;

                                return (
                                    <div
                                        key={`${idx}-${item.question}`}
                                        className={cn(
                                            "opacity-0 translate-y-2",
                                            "animate-in fade-in slide-in-from-bottom-2 duration-300",
                                            "motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
                                        )}
                                    >
                                        <motion.button
                                            type="button"
                                            onClick={() => handleToggle(idx)}
                                            className={cn(
                                                "group w-full text-left overflow-hidden bg-white ring-1 ring-black/15 shadow-sm",
                                                "transition-all duration-200",
                                                "hover:ring-black/25 hover:shadow-md hover:-translate-y-0.5",
                                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30",
                                                UI_ELEMENT_ROUNDNESS,
                                            )}
                                            animate={
                                                reduceMotion
                                                    ? undefined
                                                    : {
                                                        y: isOpen ? [0, -10, 0] : [0, -10, 0],
                                                    }
                                            }
                                            transition={
                                                reduceMotion
                                                    ? undefined
                                                    : {
                                                        duration: 0.22,
                                                        ease: "easeOut",
                                                        times: [0, 0.55, 1],
                                                    }
                                            }
                                        >
                                            <div className="px-5 py-4 border-b border-black/10">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="inline-flex h-2 w-2 rounded-full bg-black/55 transition-transform duration-200 group-hover:scale-110" />
                                                            <p className="text-black font-display text-base leading-snug pr-4">
                                                                {item.question?.trim() || "Untitled question"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span
                                                        className={cn(
                                                            "shrink-0 inline-flex h-8 w-8 items-center justify-center",
                                                            "bg-black/5 ring-1 ring-black/15 shadow-sm",
                                                            "text-black/70 text-sm transition-transform duration-200",
                                                            isOpen ? "rotate-45" : "rotate-0",
                                                            UI_ELEMENT_ROUNDNESS,
                                                        )}
                                                        aria-hidden="true"
                                                    >
                                                        +
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                                className={cn(
                                                    "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                                                    isOpen
                                                        ? "grid-rows-[1fr] opacity-100"
                                                        : "grid-rows-[0fr] opacity-80",
                                                )}
                                            >
                                                <div className="overflow-hidden">
                                                    <div className="px-5 py-4">
                                                        {item.answer?.trim() ? (
                                                            <p className="text-sm leading-6 text-black/85 whitespace-pre-line">
                                                                {item.answer}
                                                            </p>
                                                        ) : (
                                                            <p className="text-sm text-black/70">
                                                                No answer provided.
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="h-1 w-full bg-black/5">
                                                <div
                                                    className={cn(
                                                        "h-full w-0 bg-black/40 transition-all duration-300",
                                                        isOpen ? "w-full" : "group-hover:w-full",
                                                    )}
                                                />
                                            </div>
                                        </motion.button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};