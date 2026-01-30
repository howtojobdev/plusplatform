"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/shared/utils/cn";

type Props<T> = {
    items: T[];
    renderItem: (item: T, baseIndex: number, virtualIndex: number) => React.ReactNode;

    className?: string;

    itemWidthPx: number;
    itemHeightPx: number;
    gapPx?: number;

    cycles?: number;
    overscan?: number;
    onDragChange?: (isDragging: boolean) => void;
};

export const InfiniteRowCarousel = <T,>({
    items,
    renderItem,
    className,
    itemWidthPx,
    itemHeightPx,
    gapPx = 8,
    cycles = 11,
    overscan = 24,
    onDragChange,
}: Props<T>) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const pointerDownRef = useRef(false);
    const isDraggingRef = useRef(false);
    const didDragRef = useRef(false);

    const pointerIdRef = useRef<number | null>(null);
    const capturedRef = useRef(false);

    const startXRef = useRef(0);
    const startScrollLeftRef = useRef(0);
    const lastMoveXRef = useRef(0);
    const lastMoveTimeRef = useRef(0);

    const velocityRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);

    const [isDragging, setIsDragging] = useState(false);

    const DRAG_THRESHOLD_PX = 7;
    const MOMENTUM_FRICTION = 0.93;
    const MIN_VELOCITY = 0.05;

    const safeCycles = useMemo(() => {
        const n = Math.max(7, Math.floor(cycles));
        return n % 2 === 0 ? n + 1 : n;
    }, [cycles]);

    const baseCount = items.length || 1;
    const totalCount = baseCount * safeCycles;

    const itemSize = itemWidthPx + gapPx;
    const baseWidth = baseCount * itemSize;

    const rowVirtualizer = useVirtualizer({
        count: totalCount,
        getScrollElement: () => ref.current,
        estimateSize: () => itemSize,
        horizontal: true,
        overscan,
    });

    const normalizeScroll = () => {
        const el = ref.current;
        if (!el || !baseWidth) return;

        const mid = Math.floor(safeCycles / 2);
        const min = baseWidth * (mid - 2);
        const max = baseWidth * (mid + 2);

        if (el.scrollLeft < min) el.scrollLeft += baseWidth;
        else if (el.scrollLeft > max) el.scrollLeft -= baseWidth;
    };

    const applyMomentum = () => {
        const el = ref.current;
        if (!el || Math.abs(velocityRef.current) < MIN_VELOCITY) {
            animationFrameRef.current = null;
            return;
        }

        el.scrollLeft += velocityRef.current;
        velocityRef.current *= MOMENTUM_FRICTION;
        normalizeScroll();

        animationFrameRef.current = requestAnimationFrame(applyMomentum);
    };

    const stopMomentum = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        velocityRef.current = 0;
    };

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const mid = Math.floor(safeCycles / 2);
        el.scrollLeft = baseWidth * mid;

        const onResize = () => {
            normalizeScroll();
            rowVirtualizer.measure();
        };

        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
            stopMomentum();
        };
    }, [baseWidth, safeCycles, rowVirtualizer]);

    const startCaptureIfNeeded = () => {
        const el = ref.current;
        const pid = pointerIdRef.current;
        if (!el || pid == null || capturedRef.current) return;

        try {
            el.setPointerCapture(pid);
            capturedRef.current = true;
        } catch {}
    };

    const releaseCaptureIfNeeded = () => {
        const el = ref.current;
        const pid = pointerIdRef.current;
        if (!el || pid == null || !capturedRef.current) return;

        try {
            el.releasePointerCapture(pid);
        } catch {}

        capturedRef.current = false;
    };

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;

        if (e.pointerType === "mouse" && e.button !== 0) return;

        stopMomentum();

        pointerDownRef.current = true;
        isDraggingRef.current = false;
        didDragRef.current = false;

        pointerIdRef.current = e.pointerId;
        capturedRef.current = false;

        startXRef.current = e.clientX;
        lastMoveXRef.current = e.clientX;
        lastMoveTimeRef.current = Date.now();
        startScrollLeftRef.current = el.scrollLeft;

        setIsDragging(false);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el || !pointerDownRef.current) return;

        const now = Date.now();
        const dx = e.clientX - startXRef.current;
        const dt = now - lastMoveTimeRef.current;

        if (!isDraggingRef.current && Math.abs(dx) >= DRAG_THRESHOLD_PX) {
            isDraggingRef.current = true;
            didDragRef.current = true;

            startCaptureIfNeeded();

            setIsDragging(true);
            onDragChange?.(true);
        }

        if (isDraggingRef.current) {
            e.preventDefault();

            const moveDelta = lastMoveXRef.current - e.clientX;
            el.scrollLeft = startScrollLeftRef.current - dx;

            if (dt > 0) velocityRef.current = (moveDelta / Math.max(dt, 1)) * 16;

            lastMoveXRef.current = e.clientX;
            lastMoveTimeRef.current = now;

            normalizeScroll();
        }
    };

    const endDrag = () => {
        const wasDragging = isDraggingRef.current;

        pointerDownRef.current = false;
        isDraggingRef.current = false;

        releaseCaptureIfNeeded();

        if (wasDragging) {
            if (Math.abs(velocityRef.current) >= MIN_VELOCITY) applyMomentum();

            setIsDragging(false);
            onDragChange?.(false);

            window.setTimeout(() => {
                didDragRef.current = false;
            }, 0);
        } else {
            setIsDragging(false);
            onDragChange?.(false);
            didDragRef.current = false;
        }

        pointerIdRef.current = null;
        normalizeScroll();
    };

    const onPointerUp = () => {
        endDrag();
    };

    const onPointerCancel = () => {
        stopMomentum();

        pointerDownRef.current = false;
        isDraggingRef.current = false;

        releaseCaptureIfNeeded();
        pointerIdRef.current = null;

        setIsDragging(false);
        onDragChange?.(false);
        didDragRef.current = false;
    };

    const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;

        const absX = Math.abs(e.deltaX);
        const absY = Math.abs(e.deltaY);

        if (absY > absX) {
            e.preventDefault();
            stopMomentum();
            el.scrollLeft += e.deltaY;
            normalizeScroll();
        }
    };

    const virtualItems = rowVirtualizer.getVirtualItems();

    if (!items.length) return null;

    return (
        <div
            ref={ref}
            className={cn(
                "w-full overflow-x-auto overflow-y-visible",
                isDragging ? "cursor-grabbing" : "cursor-grab",
                "select-none",
                "[-ms-overflow-style:none] [scrollbar-width:none]",
                "[&::-webkit-scrollbar]:hidden",
                "touch-pan-y",
                className ?? ""
            )}
            style={{
                height: itemHeightPx,
                scrollBehavior: "auto",
                WebkitOverflowScrolling: "touch",
                touchAction: "pan-y",
            }}
            onWheel={onWheel}
            onScroll={normalizeScroll}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onDragStartCapture={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onClickCapture={(e) => {
                if (didDragRef.current) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
        >
            <div
                style={{
                    width: rowVirtualizer.getTotalSize(),
                    height: "100%",
                    position: "relative",
                    paddingBottom: 1,
                }}
            >
                {virtualItems.map((v) => {
                    const baseIndex = baseCount ? v.index % baseCount : 0;
                    const item = items[baseIndex];

                    return (
                        <div
                            key={v.key}
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                height: "100%",
                                width: itemSize,
                                transform: `translateX(${v.start}px)`,
                                willChange: "transform",
                            }}
                        >
                            <div style={{ width: itemWidthPx, height: "100%", boxSizing: "border-box" }}>
                                <div style={{ width: "100%", height: "100%" }}>{renderItem(item, baseIndex, v.index)}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};