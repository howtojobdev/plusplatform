"use client";

import React, { useMemo } from "react";
import type { PointsOfGoalsContentBlockType } from "../../domain/contentBlockType";
import { MotionConfig, motion, useReducedMotion, type Variants } from "framer-motion";

type Props = {
    block: PointsOfGoalsContentBlockType;
    index: number;
};

type GoalCardData = {
    title: string;
    description: string;
};

const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 14,
    },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            y: {
                type: "spring",
                stiffness: 380,
                damping: 28,
                delay: i * 0.18,
            },
            opacity: {
                duration: 0.35,
                ease: "easeOut",
                delay: i * 0.18,
            },
        },
    }),
};

export const PointsOfGoalsBlock = ({ block }: Props) => {
    const goals = useMemo<GoalCardData[]>(() => {
        return (block.items ?? [])
            .map((item) => ({
                title: (item.title ?? "").trim(),
                description: (item.description ?? "").trim(),
            }))
            .filter((goal) => goal.title.length > 0 || goal.description.length > 0);
    }, [block.items]);

    const reduceMotion = useReducedMotion();

    return (
        <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
            <section className="w-full content-pad">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="mb-1 font-display text-[var(--primary-font)] text-xl leading-snug">
                            Goals
                        </h2>
                        <p className="text-sm text-[var(--secondary-font)]">
                            A quick overview of what you’ll get out of this.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.7 }}
                        transition={{
                            y: { type: "spring", stiffness: 380, damping: 28 },
                            opacity: { duration: 0.35, ease: "easeOut" },
                        }}
                        className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[var(--primary-bg)] px-3 py-1.5"
                    >
                        <span className="h-2 w-2 rounded-full bg-[var(--primary-accent)]" />
                        <span className="text-xs text-[var(--secondary-font)]">{goals.length}</span>
                    </motion.div>
                </div>

                {goals.length === 0 ? (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-[var(--primary-bg)] p-4">
                        <p className="text-sm md:text-base text-[var(--secondary-font)]">
                            No goals added yet.
                        </p>
                    </div>
                ) : (
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {goals.map((goal, goalIndex) => (
                            <motion.div
                                key={`${goalIndex}-${goal.title}`}
                                custom={goalIndex}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}
                                whileHover={
                                    reduceMotion
                                        ? undefined
                                        : {
                                            y: -8,
                                            scale: 1.015,
                                            transition: { duration: 0.25, ease: "easeOut" },
                                        }
                                }
                                whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                                className={[
                                    "group cursor-pointer select-none",
                                    "relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--primary-bg)] p-4",
                                    "transition-[border-color,box-shadow,background-color] duration-300 ease-out",
                                    "hover:border-white/25 hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)]",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary-accent)]",
                                ].join(" ")}
                                tabIndex={0}
                                role="button"
                            >
                                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/0 to-white/0" />
                                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/6 blur-2xl" />
                                </div>

                                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[var(--primary-accent)] opacity-50 transition-opacity duration-300 group-hover:opacity-90" />

                                <div className="relative flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="inline-flex items-center gap-2">
                                            <span className="inline-flex items-center rounded-full border border-white/10 bg-[var(--secondary-bg)] px-2 py-0.5 text-[11px] text-[var(--secondary-font)] transition-colors duration-300 group-hover:border-white/20">
                                                Goal {String(goalIndex + 1).padStart(2, "0")}
                                            </span>
                                            <span className="h-1 w-1 rounded-full bg-white/20" />
                                            <span className="text-[11px] text-[var(--secondary-font)]">Outcome</span>
                                        </div>

                                        <h3 className="mt-2 text-[var(--primary-font)] font-display font-semibold leading-snug">
                                            {goal.title.length > 0 ? goal.title : `Goal ${goalIndex + 1}`}
                                        </h3>
                                    </div>

                                    <div className="shrink-0 h-9 w-9 rounded-xl border border-white/10 bg-[var(--secondary-bg)] grid place-items-center transition-colors duration-300 group-hover:border-white/20">
                                        <span className="text-sm font-semibold text-[var(--primary-font)]">
                                            {goalIndex + 1}
                                        </span>
                                    </div>
                                </div>

                                {goal.description.length > 0 ? (
                                    <p className="relative mt-3 text-sm text-[var(--secondary-font)] leading-relaxed whitespace-pre-line">
                                        {goal.description}
                                    </p>
                                ) : (
                                    <p className="relative mt-3 text-sm text-[var(--secondary-font)]">
                                        No description provided.
                                    </p>
                                )}

                                <div className="relative mt-4 flex items-center gap-2 text-xs text-[var(--secondary-font)]">
                                    <span className="h-2 w-2 rounded-full bg-[var(--secondary-accent)] opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110" />
                                    <span className="truncate">
                                        {goal.description.length > 0 ? "Details included" : "Add details later"}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </MotionConfig>
    );
};