"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/shared/utils/cn";

type Props<T> = {
    items: T[];
    renderItem: (item: T, baseIndex: number, virtualIndex: number) => React.ReactNode;

    className?: string;

    itemWidthPx?: number;
    itemHeightPx?: number;
    gapPx?: number;

    cycles?: number;
    overscan?: number;
};

export const InfiniteDraggableCarousel = <T,>({
    items,
    renderItem,
    className,
    itemWidthPx = 260,
    itemHeightPx = 152,
    gapPx = 12,
    cycles = 11,
    overscan = 20,
}: Props<T>) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const pointerDownRef = useRef(false);
    const startXRef = useRef(0);
    const startScrollLeftRef = useRef(0);

    const rafRef = useRef<number | null>(null);
    const lastTargetRef = useRef<number>(0);

    const [isDragging, setIsDragging] = useState(false);

    const DRAG_THRESHOLD_PX = 6;

    const safeCycles = useMemo(() => {
        const n = Math.max(7, Math.floor(cycles));
        return n % 2 === 0 ? n + 1 : n;
    }, [cycles]);

    const baseCount = items.length || 1;
    const totalCount = baseCount * safeCycles;

    const itemSize = itemWidthPx + gapPx;

    const rowVirtualizer = useVirtualizer({
        count: totalCount,
        getScrollElement: () => ref.current,
        estimateSize: () => itemSize,
        horizontal: true,
        overscan,
    });

    const baseWidth = baseCount * itemSize;

    const normalizeScrollSoft = () => {
        const el = ref.current;
        if (!el) return;
        if (!baseWidth) return;

        const mid = Math.floor(safeCycles / 2);
        const min = baseWidth * (mid - 2);
        const max = baseWidth * (mid + 2);

        if (el.scrollLeft < min) el.scrollLeft += baseWidth;
        else if (el.scrollLeft > max) el.scrollLeft -= baseWidth;
    };

    const scheduleScrollLeft = (nextLeft: number) => {
        const el = ref.current;
        if (!el) return;
        lastTargetRef.current = nextLeft;

        if (rafRef.current) return;

        rafRef.current = window.requestAnimationFrame(() => {
            rafRef.current = null;
            el.scrollLeft = lastTargetRef.current;
            normalizeScrollSoft();
        });
    };

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const mid = Math.floor(safeCycles / 2);
        el.scrollLeft = baseWidth * mid;

        const onResize = () => {
            normalizeScrollSoft();
            rowVirtualizer.measure();
        };

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [baseWidth, safeCycles, rowVirtualizer]);

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;

        if (e.pointerType === "mouse" && e.button !== 0) return;

        pointerDownRef.current = true;
        startXRef.current = e.clientX;
        startScrollLeftRef.current = el.scrollLeft;

        setIsDragging(false);
        el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el || !pointerDownRef.current) return;

        const dx = e.clientX - startXRef.current;

        if (!isDragging && Math.abs(dx) >= DRAG_THRESHOLD_PX) {
            setIsDragging(true);
        }

        if (isDragging) {
            e.preventDefault();
            scheduleScrollLeft(startScrollLeftRef.current - dx);
        }
    };

    const endDrag = () => {
        pointerDownRef.current = false;

        if (isDragging) {
            window.setTimeout(() => setIsDragging(false), 0);
        } else {
            setIsDragging(false);
        }
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;

        try {
            el.releasePointerCapture(e.pointerId);
        } catch { }

        endDrag();
        normalizeScrollSoft();
    };

    const onPointerCancel = () => endDrag();

    const virtualItems = rowVirtualizer.getVirtualItems();

    return (
        <div
            ref={ref}
            className={cn(
                "w-full overflow-x-auto overflow-y-hidden",
                "cursor-grab active:cursor-grabbing",
                "select-none",
                "[-ms-overflow-style:none] [scrollbar-width:none]",
                "[&::-webkit-scrollbar]:hidden",
                "touch-pan-y",
                className ?? ""
            )}
            style={{ height: itemHeightPx }}
            onScroll={() => normalizeScrollSoft()}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onPointerLeave={() => {
                if (pointerDownRef.current) endDrag();
            }}
            onClickCapture={(e) => {
                if (isDragging) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
        >
            <div
                className={cn(isDragging ? "pointer-events-none" : "")}
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