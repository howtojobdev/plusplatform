export const isValidISODate = (v: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.trim());
    if (!m) return false;
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const d = Number(m[3]);
    const dt = new Date(y, mo, d);
    return dt.getFullYear() === y && dt.getMonth() === mo && dt.getDate() === d;
};

export const ageYears = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    const dob = new Date(y, m - 1, d);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let age = today.getFullYear() - dob.getFullYear();
    const birthdayThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (today < birthdayThisYear) age -= 1;
    return age;
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function clampTextByWords(
    text: string,
    maxLength: number,
    ellipsis = "…"
): string {
    if (text.length <= maxLength) return text;

    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");

    if (lastSpace === -1) {
        return truncated + ellipsis;
    }

    return truncated.slice(0, lastSpace).trimEnd() + ellipsis;
}

export const parseDuration = (duration: string): number => {
    const minutes = parseInt(duration.replace("m", ""), 10);
    return isNaN(minutes) ? 0 : minutes;
}

export const formatTimeFromMinString = (mins: number) => {
    if (mins <= 0) return "0m";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}.${Math.round((m / 60) * 10)}h` : `${m}m`;
}

export const formatBrandDate = (date: Date) => {
    return `${date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    })}`;
};

export const toDDMMYYYY = (value: string): string => {
    const s = String(value ?? "").trim();
    if (!s) return "";

    let d: Date | null = null;

    const iso = /^(\d{4})-(\d{2})-(\d{2})$/;
    const m1 = s.match(iso);
    if (m1) {
        const y = Number(m1[1]);
        const m = Number(m1[2]);
        const day = Number(m1[3]);
        const dt = new Date(y, m - 1, day);
        if (dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === day) d = dt;
    }

    if (!d) {
        const t = Date.parse(s);
        if (!Number.isNaN(t)) d = new Date(t);
    }

    if (!d || Number.isNaN(d.getTime())) return "";

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = String(d.getFullYear());

    return `${dd} ${mm} ${yyyy}`;
};

export const clampFunc = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const getValidDateFromString = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? (new Date()) : date;
};

export const isInEnum = <T extends Record<string, string | number>>(
    value: string,
    enumData: T
) => {
    return Object.values(enumData).includes(value);
};

export function md5(input: string) {
    const crypto = require("crypto-js/md5");
    return crypto(input).toString();
}

export function gravatarUrl(email?: string | null, opts?: { size?: number; default?: string }) {
    const e = (email ?? "").trim().toLowerCase();
    const hash = e ? md5(e) : "";
    const size = opts?.size ?? 80;
    const d = opts?.default ?? "identicon";
    return hash ? `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${encodeURIComponent(d)}` : "";
}

export const greeting = (name?: string): string => {
    const h = new Date().getHours();
    const base =
        h < 12 ? "Good morning" :
            h < 17 ? "Good afternoon" :
                h < 21 ? "Good evening" :
                    "Good night";

    return name?.trim() ? `${base}, ${name.trim()}!` : `${base}!`;
};