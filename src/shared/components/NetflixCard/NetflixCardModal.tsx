"use client";

import React, { PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type Props = PropsWithChildren<{
    open: boolean;
    layoutId: string;
    onClose: () => void;
}>;

export const NetflixCardModal = ({ open, layoutId, onClose, children }: Props) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", onKeyDown);

        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open ? (
                <motion.div
                    className="fixed inset-0 z-[1000] flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/70"
                        aria-label="Close modal"
                        onClick={onClose}
                    />
                    <motion.div
                        layoutId={layoutId}
                        className="relative overflow-hidden shadow-2xl bg-[var(--secondary-bg)] rounded-2xl"
                        style={{ width: "min(920px, 92vw)", height: "min(560px, 82vh)" }}
                        transition={{ type: "spring", stiffness: 360, damping: 36 }}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>,
        document.body
    );
};