"use client";

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import {
    DROPDOWN_BASE,
    DROPDOWN_LABEL,
    DROPDOWN_SIZES,
    DROPDOWN_STATES,
    DROPDOWN_TEXT,
    MENU_BASE,
    MENU_INNER,
    OPTION_BASE,
    OPTION_STATES,
    SEARCH_INPUT,
    SEARCH_WRAP,
    type BrandDropdownSize
} from "./config";

export type BrandDropdownOption = {
    label: string;
    value: string;
    disabled?: boolean;
};

export type BrandDropdownPlacement = "auto" | "bottom" | "top";

type BrandDropdownProps = {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    options: BrandDropdownOption[];
    placeholder?: string;
    disabled?: boolean;
    size?: BrandDropdownSize;
    className?: string;
    iconLeft?: React.ReactNode;
    validate?: (value?: string) => string | undefined;
    searchable?: boolean;
    searchPlaceholder?: string;
    noResultsText?: string;
    closeOnSelect?: boolean;
    placement?: BrandDropdownPlacement;
    menuGap?: number;
    maxMenuHeight?: number;
};

type MenuPos = { top: number; left: number; width: number };

export default function BrandDropdown({
    label,
    value,
    onChange,
    options,
    placeholder = "Select…",
    disabled = false,
    size = "md",
    className = "",
    iconLeft,
    validate,
    searchable = true,
    searchPlaceholder = "Search…",
    noResultsText = "No results",
    closeOnSelect = true,
    placement = "auto",
    menuGap = 8,
    maxMenuHeight = 360
}: BrandDropdownProps) {
    const id = useId();
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const searchRef = useRef<HTMLInputElement | null>(null);

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [pos, setPos] = useState<MenuPos>({ top: 0, left: 0, width: 0 });
    const [posReady, setPosReady] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [menuMaxHeightPx, setMenuMaxHeightPx] = useState(maxMenuHeight);

    const error = validate?.(value);

    const selected = useMemo(() => options.find(o => o.value === value), [options, value]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!searchable || !q) return options;
        return options.filter(o => o.label.toLowerCase().includes(q));
    }, [options, query, searchable]);

    const getViewport = () => {
        const vv = typeof window !== "undefined" ? window.visualViewport : null;
        if (vv) {
            const top = vv.offsetTop ?? 0;
            const left = vv.offsetLeft ?? 0;
            const width = vv.width ?? window.innerWidth;
            const height = vv.height ?? window.innerHeight;
            return { top, left, right: left + width, bottom: top + height, width, height };
        }
        return { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight, width: window.innerWidth, height: window.innerHeight };
    };

    const computePos = () => {
        const btn = btnRef.current;
        if (!btn) return;

        const r = btn.getBoundingClientRect();
        const gap = menuGap;
        const width = r.width;

        const vp = getViewport();
        const safePad = 12;

        const spaceBelow = vp.bottom - r.bottom;
        const spaceAbove = r.top - vp.top;

        let dir: "bottom" | "top" = "bottom";
        if (placement === "top") dir = "top";
        if (placement === "bottom") dir = "bottom";
        if (placement === "auto") dir = spaceBelow >= spaceAbove ? "bottom" : "top";

        const availableInDir = dir === "bottom" ? spaceBelow : spaceAbove;
        const computedMax = Math.max(120, Math.min(maxMenuHeight, availableInDir - gap - safePad));
        setMenuMaxHeightPx(computedMax);

        const measuredHeight = menuRef.current?.getBoundingClientRect().height;
        const naturalHeight = measuredHeight && measuredHeight > 0 ? measuredHeight : maxMenuHeight;
        const heightForPlacement = Math.min(naturalHeight, computedMax + 48);

        const rawTop = dir === "bottom" ? r.bottom + gap : r.top - gap - heightForPlacement;
        const rawLeft = r.left;

        const topMin = vp.top + safePad;
        const topMax = vp.bottom - heightForPlacement - safePad;
        const leftMin = vp.left + safePad;
        const leftMax = vp.right - width - safePad;

        const top = Math.max(topMin, Math.min(rawTop, topMax));
        const left = Math.max(leftMin, Math.min(rawLeft, leftMax));

        setPos({ top, left, width });
        setPosReady(true);
    };

    useLayoutEffect(() => {
        if (!open) return;
        setPosReady(false);
        requestAnimationFrame(() => computePos());
    }, [open, placement, menuGap, maxMenuHeight]);

    useEffect(() => {
        if (!open) return;

        const onScrollOrResize = () => computePos();

        const onDown = (e: PointerEvent) => {
            const t = e.target as Node | null;
            if (!t) return;
            if (btnRef.current?.contains(t)) return;
            if (menuRef.current?.contains(t)) return;
            setOpen(false);
        };

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        window.addEventListener("scroll", onScrollOrResize, true);
        window.addEventListener("resize", onScrollOrResize);
        window.addEventListener("pointerdown", onDown);
        window.addEventListener("keydown", onKey);

        const vv = window.visualViewport;
        vv?.addEventListener("resize", onScrollOrResize);
        vv?.addEventListener("scroll", onScrollOrResize);

        return () => {
            window.removeEventListener("scroll", onScrollOrResize, true);
            window.removeEventListener("resize", onScrollOrResize);
            window.removeEventListener("pointerdown", onDown);
            window.removeEventListener("keydown", onKey);
            vv?.removeEventListener("resize", onScrollOrResize);
            vv?.removeEventListener("scroll", onScrollOrResize);
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        if (!posReady) return;

        requestAnimationFrame(() => {
            if (searchable) searchRef.current?.focus();
            else menuRef.current?.focus();
        });
    }, [open, posReady, searchable]);

    useEffect(() => {
        if (!open) return;

        const preferred = filtered.findIndex(o => o.value === value && !o.disabled);
        if (preferred >= 0) setActiveIndex(preferred);
        else {
            const firstEnabled = filtered.findIndex(o => !o.disabled);
            setActiveIndex(firstEnabled >= 0 ? firstEnabled : 0);
        }

        requestAnimationFrame(() => computePos());
    }, [filtered, open, value]);

    const moveActive = (dir: 1 | -1) => {
        if (!filtered.length) return;
        let i = activeIndex;

        for (let step = 0; step < filtered.length; step++) {
            i = (i + dir + filtered.length) % filtered.length;
            if (!filtered[i]?.disabled) {
                setActiveIndex(i);
                return;
            }
        }
    };

    const choose = (idx: number) => {
        const opt = filtered[idx];
        if (!opt || opt.disabled) return;

        onChange?.(opt.value);

        if (closeOnSelect) {
            setOpen(false);
            requestAnimationFrame(() => btnRef.current?.focus());
        }
    };

    const handleSearchClick = () => {
        if (disabled) return;
        setOpen(o => !o);
    };

    const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            moveActive(1);
            return;
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            moveActive(-1);
            return;
        }
        if (e.key === "Enter") {
            e.preventDefault();
            choose(activeIndex);
            return;
        }
        if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
            requestAnimationFrame(() => btnRef.current?.focus());
        }
    };

    const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            moveActive(1);
            return;
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            moveActive(-1);
            return;
        }
        if (e.key === "Enter") {
            e.preventDefault();
            choose(activeIndex);
            return;
        }
        if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
            requestAnimationFrame(() => btnRef.current?.focus());
        }
    };

    const menu = open
        ? createPortal(
            <div
                ref={menuRef}
                data-brand-dropdown-menu="true"
                role="listbox"
                tabIndex={-1}
                aria-activedescendant={`${id}-opt-${activeIndex}`}
                onKeyDown={onMenuKeyDown}
                className={MENU_BASE}
                style={{
                    position: "fixed",
                    top: pos.top,
                    left: pos.left,
                    width: pos.width,
                    visibility: posReady ? "visible" : "hidden"
                }}
            >
                {searchable && (
                    <div className={SEARCH_WRAP}>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary-font)]">
                                <Search size={16} />
                            </span>
                            <input
                                ref={searchRef}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={onSearchKeyDown}
                                placeholder={searchPlaceholder}
                                className={`${SEARCH_INPUT} pl-9`}
                            />
                        </div>
                    </div>
                )}

                <div className={MENU_INNER} style={{ maxHeight: menuMaxHeightPx }}>
                    {filtered.length === 0 ? (
                        <div className="px-3 py-2 text-sm font-sans text-[var(--secondary-font)]">{noResultsText}</div>
                    ) : (
                        filtered.map((opt, idx) => {
                            const isSelected = opt.value === value;
                            const isActive = idx === activeIndex;
                            const isDisabled = !!opt.disabled;

                            return (
                                <button
                                    key={opt.value}
                                    id={`${id}-opt-${idx}`}
                                    role="option"
                                    type="button"
                                    aria-selected={isSelected}
                                    disabled={isDisabled}
                                    onMouseEnter={() => !isDisabled && setActiveIndex(idx)}
                                    onClick={() => choose(idx)}
                                    className={[
                                        OPTION_BASE,
                                        isDisabled
                                            ? OPTION_STATES.disabled
                                            : isSelected
                                                ? OPTION_STATES.selected
                                                : isActive
                                                    ? OPTION_STATES.active
                                                    : OPTION_STATES.idle,
                                        "flex items-center justify-between gap-3"
                                    ].join(" ")}
                                >
                                    <span className="min-w-0 truncate">{opt.label}</span>
                                    {isSelected && (
                                        <span className="shrink-0 text-[var(--primary-font)]">
                                            <Check size={16} />
                                        </span>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>,
            document.body
        )
        : null;

    return (
        <div className={["flex flex-col gap-1.5", className].join(" ")}>
            {label && (
                <label htmlFor={id} className={DROPDOWN_LABEL}>
                    {label}
                </label>
            )}

            <button
                id={id}
                ref={btnRef}
                type="button"
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={handleSearchClick}
                className={[
                    DROPDOWN_BASE,
                    DROPDOWN_TEXT,
                    DROPDOWN_SIZES[size],
                    disabled ? DROPDOWN_STATES.disabled : DROPDOWN_STATES.default,
                    error ? DROPDOWN_STATES.error : "",
                    "flex items-center justify-between gap-3"
                ].join(" ")}
            >
                <span className="flex min-w-0 items-center gap-2">
                    {iconLeft && <span className="shrink-0 text-[var(--secondary-font)]">{iconLeft}</span>}
                    <span className={["min-w-0 truncate", selected ? "text-[var(--primary-font)]" : "text-[var(--secondary-font)]"].join(" ")}>
                        {selected ? selected.label : placeholder}
                    </span>
                </span>

                <span className="shrink-0 text-[var(--secondary-font)]">
                    <ChevronDown size={18} className={open ? "rotate-180 transition" : "transition"} />
                </span>
            </button>

            {menu}

            {error && <span className="text-xs tracking-wide text-red-500 font-sans">{error}</span>}
        </div>
    );
};