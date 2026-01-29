"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { useViewport } from "@/shared/hooks/useViewport";
import { NETFLIX_CARD_HOVER_CLOSE_DELAY_MS, NETFLIX_CARD_HOVER_OPEN_DELAY_MS } from "./config";
import { NetflixCardHoverView } from "./NetflixCardHoverView";
import { NetflixCardModal } from "./NetflixCardModal";

export type NetflixCardGetters<T> = {
    getId: (item: T) => string;
    getTitle: (item: T) => string;
    getTitleImage: (item: T) => string;
    getPreviewImage: (item: T) => string;
};

type RenderCtx<T> = {
    item: T;
    compact: boolean;
};

type Props<T> = {
    item: T;
    getters: NetflixCardGetters<T>;
    instanceId?: string;

    compact?: boolean;
    enableHoverPreview?: boolean;

    onOpen?: (item: T) => void;

    renderHoverBottomOverlay?: (ctx: RenderCtx<T>) => ReactNode;
    renderHoverDetails?: (ctx: RenderCtx<T>) => ReactNode;

    renderNormalOverlay?: (ctx: RenderCtx<T>) => ReactNode;

    modalOpen?: boolean;
    onModalClose?: () => void;
    renderModal?: (ctx: RenderCtx<T> & { layoutId: string; close: () => void }) => ReactNode;

    cardWidthPx?: number;
    cardHeightPx?: number;
    aspectRatio?: string;

    containerClassName?: string;

    prefetch?: boolean;
    prefetchMarginPx?: number;

    showSkeleton?: boolean;
    skeletonClassName?: string;
};

type NetflixCardComponent = (<T, >(props: Props<T>) => ReactNode) & {
    Modal: typeof NetflixCardModal;
};

function safeSrc(s: any) {
    return String(s ?? "").trim();
}

function prefetchSrc(src: string) {
    if (!src) return;
    const img = new Image();
    img.decoding = "async";
    img.src = src;
}

export const NetflixCard = (<T,>({
    item,
    getters,
    instanceId,
    compact = false,
    enableHoverPreview = true,
    onOpen,
    renderHoverBottomOverlay,
    renderHoverDetails,
    renderNormalOverlay,
    modalOpen,
    onModalClose,
    renderModal,
    cardWidthPx,
    cardHeightPx,
    aspectRatio,
    containerClassName,
    prefetch = true,
    prefetchMarginPx = 1200,
    showSkeleton = true,
    skeletonClassName,
}: Props<T>) => {
    const id = getters.getId(item);
    const title = getters.getTitle(item);

    const previewImage = safeSrc(getters.getPreviewImage(item));
    const titleImage = safeSrc(getters.getTitleImage(item));

    const normalImg = compact ? previewImage : titleImage;
    const hoverImg = titleImage;

    const layoutId = useMemo(() => {
        const suffix = (instanceId ?? "0").replace(/[^a-zA-Z0-9_-]/g, "");
        return `netflix-card-${id}-${suffix}`;
    }, [id, instanceId]);

    const { isMobile } = useViewport();

    const [isCardHovering, setIsCardHovering] = useState(false);
    const [isPreviewHovering, setIsPreviewHovering] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    const [imgReady, setImgReady] = useState(false);

    const cardRef = useRef<HTMLDivElement | null>(null);
    const openTimer = useRef<number | null>(null);
    const closeTimer = useRef<number | null>(null);

    const hovering = isCardHovering || isPreviewHovering;

    const open = () => onOpen?.(item);

    const setHoverView = (status: boolean) => {
        if (isMobile || !enableHoverPreview) {
            setIsPreviewHovering(false);
            return;
        }
        setIsPreviewHovering(status);
    };

    const containerStyle: React.CSSProperties = useMemo(() => {
        if (typeof cardWidthPx === "number" && typeof cardHeightPx === "number") {
            return { width: cardWidthPx, height: cardHeightPx };
        }

        const s: React.CSSProperties = { width: "100%" };

        if (aspectRatio) {
            s.aspectRatio = aspectRatio;
        }

        return s;
    }, [cardWidthPx, cardHeightPx, aspectRatio]);

    useEffect(() => {
        setImgReady(false);
        if (!normalImg) return;

        const img = new Image();
        img.decoding = "async";
        img.src = normalImg;

        const done = () => setImgReady(true);

        if ((img as any).complete) {
            done();
            return;
        }

        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });

        return () => {
            img.removeEventListener("load", done);
            img.removeEventListener("error", done);
        };
    }, [normalImg]);

    useEffect(() => {
        if (!prefetch) return;
        const el = cardRef.current;
        if (!el) return;

        let done = false;
        const run = () => {
            if (done) return;
            done = true;
            if (normalImg) prefetchSrc(normalImg);
            if (hoverImg && hoverImg !== normalImg) prefetchSrc(hoverImg);
        };

        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    run();
                    io.disconnect();
                }
            },
            { root: null, rootMargin: `${prefetchMarginPx}px`, threshold: 0.01 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [prefetch, normalImg, hoverImg, prefetchMarginPx]);

    useEffect(() => {
        if (isMobile || !enableHoverPreview) return;

        if (modalOpen) {
            setPreviewOpen(false);
            return;
        }

        if (hovering) {
            if (closeTimer.current) window.clearTimeout(closeTimer.current);
            closeTimer.current = null;

            if (!previewOpen) {
                if (openTimer.current) window.clearTimeout(openTimer.current);
                openTimer.current = window.setTimeout(() => setPreviewOpen(true), NETFLIX_CARD_HOVER_OPEN_DELAY_MS);
            }
        } else {
            if (openTimer.current) window.clearTimeout(openTimer.current);
            openTimer.current = null;

            if (previewOpen) {
                if (closeTimer.current) window.clearTimeout(closeTimer.current);
                closeTimer.current = window.setTimeout(() => setPreviewOpen(false), NETFLIX_CARD_HOVER_CLOSE_DELAY_MS);
            }
        }

        return () => {
            if (openTimer.current) window.clearTimeout(openTimer.current);
            if (closeTimer.current) window.clearTimeout(closeTimer.current);
        };
    }, [hovering, previewOpen, modalOpen, isMobile, enableHoverPreview]);

    return (
        <LayoutGroup>
            <div className={cn("relative", containerClassName ?? "")} style={containerStyle}>
                <div
                    ref={cardRef}
                    className={cn("min-w-0 relative", "bg-[var(--secondary-bg)]", UI_ELEMENT_ROUNDNESS)}
                    style={{ width: "100%", height: "100%" }}
                    onPointerEnter={() => setIsCardHovering(true)}
                    onPointerLeave={() => setIsCardHovering(false)}
                >
                    <motion.div
                        layoutId={layoutId}
                        className={cn("relative bg-[var(--secondary-bg)]", UI_ELEMENT_ROUNDNESS)}
                        style={{ width: "100%", height: "100%" }}
                        animate={previewOpen && !modalOpen ? { scale: 1.02, y: -4 } : { scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    >
                        {showSkeleton && !imgReady ? (
                            <div
                                className={cn(
                                    "absolute inset-0 z-10 overflow-hidden pointer-events-none",
                                    UI_ELEMENT_ROUNDNESS,
                                    skeletonClassName ?? ""
                                )}
                            >
                                <div className="absolute inset-0 bg-white/5" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                            </div>
                        ) : null}

                        <img
                            src={normalImg}
                            alt={title}
                            className={cn(
                                "w-full h-full relative z-20 object-cover block pointer-events-none",
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

                        {renderNormalOverlay ? (
                            <div className="absolute inset-0 z-30 pointer-events-none">{renderNormalOverlay({ item, compact })}</div>
                        ) : null}

                        <button
                            className="absolute inset-0 z-50 pointer-events-auto"
                            aria-label={`Open ${title}`}
                            onClick={open}
                            type="button"
                        />
                    </motion.div>
                </div>

                <NetflixCardHoverView
                    open={enableHoverPreview && previewOpen && !modalOpen}
                    anchorRef={cardRef}
                    layoutId={layoutId}
                    onPointerEnter={() => setHoverView(true)}
                    onPointerLeave={() => setHoverView(false)}
                    onClick={open}
                    imageSrc={hoverImg}
                    title={title}
                    bottomOverlay={renderHoverBottomOverlay?.({ item, compact })}
                    details={renderHoverDetails?.({ item, compact })}
                />

                {renderModal && typeof modalOpen === "boolean" && onModalClose ? (
                    <NetflixCardModal open={modalOpen} layoutId={layoutId} onClose={onModalClose}>
                        {renderModal({
                            item,
                            compact,
                            layoutId,
                            close: onModalClose,
                        })}
                    </NetflixCardModal>
                ) : null}
            </div>
        </LayoutGroup>
    );
}) as NetflixCardComponent;

NetflixCard.Modal = NetflixCardModal;