"use client";

import React from "react";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { BUTTON_SIZES, BUTTON_VARIANTS, type BrandButtonSize, type BrandButtonVariant } from "./config";

type BrandButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    size?: BrandButtonSize;
    variant?: BrandButtonVariant;
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    className?: string;
    type?: "button" | "submit";
};

export default function BrandButton({
    children,
    onClick,
    size = "md",
    variant = "cta",
    fullWidth = false,
    disabled = false,
    loading = false,
    iconLeft,
    iconRight,
    className = "",
    type = "button"

}: BrandButtonProps) {
    const isBlocked = disabled || loading;

    const base = [
        "tracking-[0.02em] inline-flex items-center justify-center",
        "gap-2 select-none transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-accent)]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary-bg)]",
        "relative overflow-hidden",
        UI_ELEMENT_ROUNDNESS
    ].join(" ");

    const spinnerTone =
        variant === "cta" || variant === "pill"
            ? "text-[var(--primary-bg)]"
            : "text-[var(--primary-font)]";

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
        if (isBlocked) return;

        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const d = Math.max(rect.width, rect.height) * 1.8;
        const x = e.clientX - rect.left - d / 2;
        const y = e.clientY - rect.top - d / 2;

        const r = document.createElement("span");
        r.style.cssText = `
            position:absolute;
            left:${x}px; top:${y}px;
            width:${d}px; height:${d}px;
            border-radius:9999px;
            pointer-events:none;
            background: currentColor;
            opacity:.18;
            transform: scale(.2);
            transition: transform 520ms cubic-bezier(.2,.8,.2,1), opacity 700ms ease;
        `;

        btn.appendChild(r);
        requestAnimationFrame(() => {
            r.style.transform = "scale(1)";
            r.style.opacity = "0";
        });
        r.addEventListener("transitionend", () => r.remove(), { once: true });

        onClick?.();
    };

    return (
        <button
            type={type}
            onPointerDown={handlePointerDown}
            disabled={isBlocked}
            className={[
                base,
                BUTTON_VARIANTS[variant],
                BUTTON_SIZES[size],
                fullWidth ? "w-full" : "",
                isBlocked ? "opacity-60 cursor-not-allowed" : "",
                className
            ].join(" ")}
        >
            {loading && (
                <span
                    aria-hidden
                    className={`h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin ${spinnerTone}`}
                />
            )}
            {iconLeft && <span className="shrink-0">{iconLeft}</span>}
            <span className="leading-none">{children}</span>
            {iconRight && <span className="shrink-0">{iconRight}</span>}
        </button>
    );
};