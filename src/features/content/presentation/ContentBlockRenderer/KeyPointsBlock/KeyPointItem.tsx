"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { Chip } from "@/shared/components/Chip";
import { motion, type Variants } from "framer-motion";

export type KeyPointItemData = {
    question: string;
    answer: string;
};

type Props = {
    point: KeyPointItemData;
    index: number;
    total: number;
    isOpen: boolean;
    onToggle: (index: number) => void;
};

export const KeyPointItem = ({ point, index, total, isOpen, onToggle }: Props) => {
    const label = `#${index + 1} of ${total}`;

    const faceStyle: React.CSSProperties = {
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "geometricPrecision",
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 14 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                y: {
                    type: "spring",
                    stiffness: 380,
                    damping: 28,
                    delay: index * 0.08,
                },
                opacity: {
                    duration: 0.35,
                    ease: "easeOut",
                    delay: index * 0.08,
                },
            }
        },
    };

    return (
        <motion.button
            type="button"
            onClick={() => onToggle(index)}
            className={cn(
                "group w-full text-left focus:outline-none bg-[var(--secondary-bg)]",
                UI_ELEMENT_ROUNDNESS,
            )}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
        >
            <div
                className={cn(
                    "relative shadow-sm overflow-hidden",
                    "h-[220px] sm:h-[240px]",
                    "transition-colors duration-200",
                    "focus-visible:ring-2 focus-visible:ring-[var(--secondary-accent)]",
                )}
                style={{
                    perspective: "1200px",
                    WebkitPerspective: "1200px",
                }}
            >
                <div
                    className={cn(
                        "absolute inset-0 transition-transform duration-500 transform-gpu",
                        "[transform-style:preserve-3d]",
                        isOpen ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]",
                    )}
                    style={{
                        transformStyle: "preserve-3d",
                        WebkitTransformStyle: "preserve-3d",
                    }}
                >
                    <div className="absolute inset-0 p-6" style={faceStyle}>
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="min-w-0 text-[var(--primary-font)] leading-snug break-words">
                                {point.question || "Untitled point"}
                            </h3>

                            <Chip text="Flip"></Chip>
                        </div>

                        <p className="mt-2 text-sm text-[var(--secondary-font)] opacity-80">
                            Click to reveal details.
                        </p>

                        <div className="absolute inset-x-6 bottom-6 h-px bg-white/10" />
                    </div>

                    <div
                        className="absolute inset-0 p-6"
                        style={{
                            ...faceStyle,
                            transform: "rotateY(180deg) translateZ(0)",
                            WebkitTransform: "rotateY(180deg) translateZ(0)",
                        }}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="min-w-0 text-[var(--primary-font)] leading-snug break-words">
                                {point.question || "Untitled point"}
                            </h3>

                            <Chip text="Details"></Chip>
                        </div>

                        <div className="mt-2 pr-1 text-sm text-[var(--secondary-font)] leading-relaxed whitespace-pre-line max-h-[120px] sm:max-h-[130px] overflow-y-auto scrollbar">
                            {point.answer ? point.answer : "No details provided."}
                        </div>

                        <div className="absolute inset-x-6 bottom-6 flex items-center justify-between">
                            <span className="text-xs text-[var(--secondary-font)] opacity-80">
                                {label}
                            </span>
                            <span className="text-xs text-[var(--secondary-font)] opacity-80">
                                Click to flip back
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.button>
    );
};