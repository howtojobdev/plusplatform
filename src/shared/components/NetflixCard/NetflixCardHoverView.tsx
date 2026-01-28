"use client";

import { MutableRefObject, ReactNode, useLayoutEffect, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { clampFunc } from "@/shared/utils/helperFunctions";
import { NETFLIX_CARD_HOVER_EXPANDED_CONFIG } from "./config";

type Placement = {
    left: number;
    top: number;
    width: number;
    height: number;
    align: "left" | "right" | "center";
};

type Props = {
    open: boolean;
    anchorRef: MutableRefObject<HTMLDivElement | null>;
    layoutId: string;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onClick: () => void;

    imageSrc: string;
    title: string;

    bottomOverlay?: ReactNode;
    details?: ReactNode;

    maxWidth?: number;
    maxHeight?: number;

    showSkeleton?: boolean;
};

function prefetchSrc(src: string) {
    if (!src) return;
    const img = new Image();
    img.decoding = "async";
    img.src = src;
}

export const NetflixCardHoverView = ({
    open,
    anchorRef,
    layoutId,
    onPointerEnter,
    onPointerLeave,
    onClick,
    imageSrc,
    title,
    bottomOverlay,
    details,
    maxWidth = 520,
    maxHeight = 300,
    showSkeleton = true,
}: Props) => {
    const [placement, setPlacement] = useState<Placement | null>(null);
    const [mounted, setMounted] = useState(false);
    const [imgReady, setImgReady] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;
        setImgReady(false);
        if (!imageSrc) {
            setImgReady(true);
            return;
        }
        prefetchSrc(imageSrc);
    }, [open, imageSrc]);

    useLayoutEffect(() => {
        if (!open) return;

        const el = anchorRef.current;
        if (!el) return;

        const compute = () => {
            const r = el.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            const width = Math.min(r.width * NETFLIX_CARD_HOVER_EXPANDED_CONFIG.scale, maxWidth);
            const height = Math.min(r.height * NETFLIX_CARD_HOVER_EXPANDED_CONFIG.scale, maxHeight);

            const idealLeft = r.left + r.width / 2 - width / 2;
            const idealTop = r.top - NETFLIX_CARD_HOVER_EXPANDED_CONFIG.lift;

            const left = clampFunc(idealLeft, 12, vw - width - 12);
            const top = clampFunc(
                idealTop,
                12,
                vh - (height + NETFLIX_CARD_HOVER_EXPANDED_CONFIG.extraDetailsHeight) - 12
            );

            let align: Placement["align"] = "center";
            if (left <= 14) align = "left";
            else if (left >= vw - width - 14) align = "right";

            setPlacement({ left, top, width, height, align });
        };

        compute();
        window.addEventListener("resize", compute);
        window.addEventListener("scroll", compute, true);

        return () => {
            window.removeEventListener("resize", compute);
            window.removeEventListener("scroll", compute, true);
        };
    }, [open, anchorRef, maxWidth, maxHeight]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open && placement ? (
                <motion.div
                    className="z-[1100]"
                    style={{
                        position: "fixed",
                        left: placement.left,
                        top: placement.top,
                        width: placement.width,
                    }}
                    initial={{ opacity: 0, scale: 0.98, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 6 }}
                    transition={{ duration: 0.14 }}
                    onPointerEnter={onPointerEnter}
                    onPointerLeave={onPointerLeave}
                >
                    <motion.div
                        layoutId={layoutId}
                        className={cn(
                            "relative overflow-hidden shadow-2xl",
                            "bg-[var(--secondary-bg)]",
                            UI_ELEMENT_ROUNDNESS
                        )}
                        style={{
                            transformOrigin:
                                placement.align === "left"
                                    ? "left center"
                                    : placement.align === "right"
                                        ? "right center"
                                        : "center center",
                        }}
                        transition={{ type: "spring", stiffness: 520, damping: 40 }}
                    >
                        <div style={{ height: placement.height }} className="relative">
                            {showSkeleton && !imgReady ? (
                                <div className={cn("absolute inset-0 z-10 overflow-hidden", UI_ELEMENT_ROUNDNESS)}>
                                    <div className="absolute inset-0 bg-white/5" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                                </div>
                            ) : null}

                            <img
                                src={imageSrc}
                                alt={title}
                                className={cn(
                                    "w-full h-full object-cover block relative z-20",
                                    UI_ELEMENT_ROUNDNESS,
                                    imgReady ? "opacity-100" : "opacity-0"
                                )}
                                style={{ transition: "opacity 140ms ease" }}
                                draggable={false}
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                                onLoad={() => setImgReady(true)}
                                onError={() => setImgReady(true)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                            {bottomOverlay ? (
                                <div className="absolute bottom-3 left-3 right-3 z-30">{bottomOverlay}</div>
                            ) : null}

                            <button
                                type="button"
                                className="absolute inset-0 z-20"
                                aria-label={`Open ${title}`}
                                onClick={onClick}
                            />
                        </div>

                        {details ? <div className="p-3 bg-[var(--secondary-bg)]">{details}</div> : null}
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>,
        document.body
    );
};