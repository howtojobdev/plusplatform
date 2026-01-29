"use client";

import React, { PropsWithChildren, useRef, useState } from "react";

type Props = PropsWithChildren<{
    className?: string;
}>;

export const DraggableCarousel = ({ children, className }: Props) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const pointerDownRef = useRef(false);
    const startXRef = useRef(0);
    const startScrollLeftRef = useRef(0);

    const [isDragging, setIsDragging] = useState(false);

    const DRAG_THRESHOLD_PX = 8;

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
            el.scrollLeft = startScrollLeftRef.current - dx;
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
    };

    const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;

        const absX = Math.abs(e.deltaX);
        const absY = Math.abs(e.deltaY);

        if (absY > absX) {
            el.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    };

    return (
        <div
            ref={ref}
            className={[
                "w-full overflow-x-auto overflow-y-hidden",
                "cursor-grab active:cursor-grabbing",
                "select-none",
                "[-ms-overflow-style:none] [scrollbar-width:none]",
                "[&::-webkit-scrollbar]:hidden",
                "touch-pan-y",
                className ?? "",
            ].join(" ")}
            style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
            }}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={endDrag}
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
            <div className={`flex gap-2 w-max pr-2 ${isDragging ? "pointer-events-none" : ""}`}>
                {children}
            </div>
        </div>
    );
};