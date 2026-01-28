import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";

export const DROPDOWN_SIZES = {
    sm: "px-4 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-3.5 text-lg"
} as const;

export const DROPDOWN_LABEL = ["text-sm tracking-[0.02em]", "text-[var(--secondary-font)] select-none"].join(" ");

export const DROPDOWN_TEXT = ["leading-none text-left", "placeholder:text-[var(--secondary-font)]"].join(" ");

export const DROPDOWN_BASE = [
    "tracking-[0.02em] w-full border border-[color-mix(in_srgb,var(--secondary-font)_18%,transparent)]",
    "bg-[var(--secondary-bg)] text-[var(--primary-font)]",
    "transition-colors duration-200 select-none",
    "focus:outline-none focus-visible:ring-2",
    "focus-visible:ring-[var(--primary-accent)]",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary-bg)]",
    UI_ELEMENT_ROUNDNESS
].join(" ");

export const DROPDOWN_STATES = {
    default: "hover:bg-[color-mix(in_srgb,var(--secondary-bg)_94%,transparent)]",
    disabled: "opacity-60 cursor-not-allowed",
    error: "ring-2 ring-red-500 ring-offset-2 ring-offset-[var(--primary-bg)]"
} as const;

export const MENU_BASE = [
    "z-50 overflow-hidden",
    "bg-[var(--primary-bg)] border",
    "border-[color-mix(in_srgb,var(--secondary-font)_22%,transparent)]",
    "shadow-lg",
    UI_ELEMENT_ROUNDNESS
].join(" ");

export const MENU_INNER = [
    "overflow-auto p-2",
    "[scrollbar-width:thin]",
    "[scrollbar-color:color-mix(in_srgb,var(--secondary-font)_35%,transparent)_transparent]"
].join(" ");

export const OPTION_BASE = [
    "w-full text-left px-3 py-2",
    "transition-colors duration-150",
    "text-[var(--primary-font)]",
    "focus:outline-none focus-visible:ring-2",
    "focus-visible:ring-[var(--primary-accent)]",
    UI_ELEMENT_ROUNDNESS
].join(" ");

export const OPTION_STATES = {
    idle: "hover:bg-[color-mix(in_srgb,var(--secondary-bg)_70%,transparent)]",
    active: "bg-[color-mix(in_srgb,var(--secondary-bg)_78%,transparent)]",
    selected: "bg-[color-mix(in_srgb,var(--secondary-bg)_86%,transparent)]",
    disabled: "opacity-50 cursor-not-allowed"
} as const;

export const SEARCH_WRAP = [
    "border-b border-[color-mix(in_srgb,var(--secondary-font)_18%,transparent)]",
    "p-2 bg-[var(--primary-bg)]"
].join(" ");

export const SEARCH_INPUT = [
    "w-full px-3 py-2 text-sm font-sans",
    "bg-[var(--secondary-bg)] text-[var(--primary-font)]",
    "placeholder:text-[var(--secondary-font)]",
    "focus:outline-none focus-visible:ring-2",
    "focus-visible:ring-[var(--primary-accent)]",
    UI_ELEMENT_ROUNDNESS
].join(" ");

export type BrandDropdownSize = keyof typeof DROPDOWN_SIZES;