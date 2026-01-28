import React from "react";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { Calendar, Hash, Lock, Mail, type LucideIcon } from "lucide-react";

type InputConfig = {
    type: React.HTMLInputTypeAttribute;
    icon: LucideIcon | null;
    toggleVisibility: boolean;
};

export const INPUT_TYPES = {
    text: { type: "text", icon: null, toggleVisibility: false },
    email: { type: "email", icon: Mail, toggleVisibility: false },
    password: { type: "password", icon: Lock, toggleVisibility: true },
    date: { type: "date", icon: Calendar, toggleVisibility: false },
    number: { type: "number", icon: Hash, toggleVisibility: false }
} satisfies Record<string, InputConfig>;

export type BrandInputType = keyof typeof INPUT_TYPES;

export const INPUT_BASE = [
    "w-full font-sans",
    "bg-[var(--secondary-bg)] text-[var(--primary-font)]",
    "px-4 py-3",
    "border-0 outline-none",
    "ring-0 ring-offset-0",
    "focus:outline-none focus:ring-0 focus-visible:ring-0",
    "shadow-none focus:shadow-none",
    "appearance-none",
    UI_ELEMENT_ROUNDNESS
].join(" ");

export const INPUT_STATES = {
    disabled: "opacity-60 cursor-not-allowed",
    error: ""
} as const;