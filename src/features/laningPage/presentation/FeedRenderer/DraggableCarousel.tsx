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

        // Only left mouse button drags; touch/pen always ok
        if (e.pointerType === "mouse" && e.button !== 0) return;

        pointerDownRef.current = true;
        startXRef.current = e.clientX;
        startScrollLeftRef.current = el.scrollLeft;

        setIsDragging(false);

        // This is the key: capture pointer so move/up keep coming even over children
        el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el || !pointerDownRef.current) return;

        const dx = e.clientX - startXRef.current;

        // Enter dragging only after user commits (threshold)
        if (!isDragging && Math.abs(dx) >= DRAG_THRESHOLD_PX) {
            setIsDragging(true);
        }

        // Only prevent default once we are dragging
        if (isDragging) {
            e.preventDefault();
            el.scrollLeft = startScrollLeftRef.current - dx;
        }
    };

    const endDrag = () => {
        pointerDownRef.current = false;

        // If we dragged, we keep isDragging true for this tick to kill the click
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
        } catch {
            // ignore if not captured
        }
        endDrag();
    };

    const onPointerCancel = () => endDrag();

    return (
        <div
            ref={ref}
            className={[
                "w-full overflow-x-auto overflow-y-hidden",
                "cursor-grab active:cursor-grabbing",
                "select-none",
                "[-ms-overflow-style:none] [scrollbar-width:none]",
                "[&::-webkit-scrollbar]:hidden",
                // Important for touch: allow vertical page scroll, we handle horizontal when dragging
                "touch-pan-y",
                className ?? "",
            ].join(" ")}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onPointerLeave={() => {
                // pointer capture should handle this, but keep it safe
                if (pointerDownRef.current) endDrag();
            }}
            // Kill clicks that happen after a drag gesture
            onClickCapture={(e) => {
                if (isDragging) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
        >
            {/* While dragging: children cannot receive pointer events -> no hover/click reactions */}
            <div className={`flex gap-3 w-max pr-2 ${isDragging ? "pointer-events-none" : ""}`}>
                {children}
            </div>
        </div>
    );
};
