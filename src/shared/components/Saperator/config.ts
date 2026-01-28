export const SEPARATOR_SIZES = {
    "2xs": "0.125rem",
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    "4xl": "6rem",
    "5xl": "8rem"
} as const;

export const SEPARATOR_DIRECTIONS = {
    x: "x",
    y: "y",
    both: "both"
} as const;

export type SeparatorSize = keyof typeof SEPARATOR_SIZES;
export type SeparatorDirection = keyof typeof SEPARATOR_DIRECTIONS;