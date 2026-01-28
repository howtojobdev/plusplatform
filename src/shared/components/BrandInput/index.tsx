"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, Eye, EyeOff } from "lucide-react";
import BrandDropdown from "../BrandDropdown";
import { INPUT_BASE, INPUT_STATES, INPUT_TYPES, type BrandInputType } from "./config";

type DatePlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";
type YearRange = { start: number; end: number };
type Pos = { top: number; left: number; width: number };

type BrandInputProps = {
    label?: string;
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    type?: BrandInputType;
    onChange?: (value: string) => void;
    validate?: (value?: string) => string | undefined;
    datePlacement?: DatePlacement;
    yearRange?: YearRange;
};

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toDisplay = (d: Date) => `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;

const parseDateValue = (v?: string) => {
    if (!v) return undefined;
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.trim());
    if (iso) {
        const y = Number(iso[1]);
        const m = Number(iso[2]) - 1;
        const d = Number(iso[3]);
        const dt = new Date(y, m, d);
        if (dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d) return dt;
        return undefined;
    }
    const dt = new Date(v);
    if (isNaN(dt.getTime())) return undefined;
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
};

const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const buildMonthGrid = (monthStart: Date) => {
    const start = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
};

const getDefaultYearRange = (): YearRange => {
    const y = new Date().getFullYear();
    return { start: y - 100, end: y + 5 };
};

export default function BrandInput({
    label,
    value = "",
    placeholder,
    disabled = false,
    className = "",
    type = "text",
    onChange,
    validate,
    datePlacement = "bottom-start",
    yearRange = getDefaultYearRange()
}: BrandInputProps) {
    const cfg = INPUT_TYPES[type];
    const isDate = cfg.type === "date";
    const error = validate?.(value);
    const parsed = useMemo(() => (isDate ? parseDateValue(value) : undefined), [isDate, value]);

    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const calRef = useRef<HTMLDivElement | null>(null);

    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [monthCursor, setMonthCursor] = useState<Date>(() => {
        const d = parsed ?? new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });

    const [pos, setPos] = useState<Pos>({ top: 0, left: 0, width: 320 });
    const [posReady, setPosReady] = useState(false);

    useEffect(() => {
        if (!parsed) return;
        setMonthCursor(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
    }, [parsed?.getFullYear(), parsed?.getMonth()]);

    const days = useMemo(() => buildMonthGrid(monthCursor), [monthCursor]);

    const recomputePos = () => {
        const a = anchorRef.current;
        if (!a) return;
        const r = a.getBoundingClientRect();
        setPos({ top: r.bottom + 8, left: r.left, width: r.width });
        setPosReady(true);
    };

    useLayoutEffect(() => {
        if (!open) return;
        setPosReady(false);
        recomputePos();
    }, [open]);

    const selectDate = (d: Date) => {
        onChange?.(toISO(d));
        setOpen(false);
    };

    return (
        <div className={["flex flex-col gap-1.5", className].join(" ")}>
            {label && <label className="text-xs text-[var(--secondary-font)]">{label}</label>}

            <div className="relative flex items-center">
                {isDate ? (
                    <button
                        ref={anchorRef}
                        type="button"
                        disabled={disabled}
                        onClick={() => !disabled && setOpen(v => !v)}
                        className={[
                            INPUT_BASE,
                            disabled ? INPUT_STATES.disabled : "",
                            error ? INPUT_STATES.error : "",
                            "text-left"
                        ].join(" ")}
                    >
                        <span className={parsed ? "text-[var(--primary-font)]" : "text-[var(--secondary-font)]"}>
                            {parsed ? toDisplay(parsed) : placeholder || "dd-mm-yyyy"}
                        </span>
                        <Calendar size={18} className="absolute right-3 text-[var(--secondary-font)]" />
                    </button>
                ) : (
                    <>
                        <input
                            type={cfg.type === "password" ? (showPassword ? "text" : "password") : cfg.type}
                            value={value}
                            onChange={e => onChange?.(e.target.value)}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={[
                                INPUT_BASE,
                                disabled ? INPUT_STATES.disabled : "",
                                error ? INPUT_STATES.error : ""
                            ].join(" ")}
                        />
                        {cfg.toggleVisibility && (
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-3 text-[var(--secondary-font)]"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        )}
                    </>
                )}
            </div>

            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}