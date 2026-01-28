export const BUTTON_SIZES = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
} as const;

export const BUTTON_VARIANTS = {
    cta: [
        "bg-[var(--primary-accent)]",
        "text-[var(--primary-bg)]",
        "hover:bg-[var(--secondary-accent)]"
    ].join(" "),
    neutral: [
        "bg-[var(--secondary-bg)]",
        "text-[var(--primary-font)]",
        "hover:bg-[var(--primary-bg)]"
    ].join(" "),
    outline: [
        "bg-transparent",
        "text-[var(--primary-font)]",
        "border",
        "border-[color-mix(in_srgb,var(--secondary-font)_80%,transparent)]",
        "hover:border-[var(--secondary-font)]",
        "hover:bg-white/5"
    ].join(" "),
    pill: [
        "rounded-full",
        "bg-[var(--secondary-bg)]",
        "text-[var(--primary-font)]",
        "hover:bg-[color-mix(in_srgb,var(--secondary-bg)_92%,transparent)]"
    ].join(" "),
    ghost: [
        "bg-transparent"
    ]
} as const;

export type BrandButtonSize = keyof typeof BUTTON_SIZES;
export type BrandButtonVariant = keyof typeof BUTTON_VARIANTS;