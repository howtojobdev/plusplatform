"use client";

import React from "react";
import { SEPARATOR_SIZES, SEPARATOR_DIRECTIONS } from "./config";

type SeparatorProps = {
    size?: keyof typeof SEPARATOR_SIZES;
    x?: boolean;
    y?: boolean;
    className?: string;
};

export default function Separator({
    size = "md",
    x,
    y,
    className = ""
}: SeparatorProps) {
    const space = SEPARATOR_SIZES[size];

    const style: React.CSSProperties = {
        width: x ? space : undefined,
        height: y ? space : undefined
    };

    if (!x && !y) {
        style.height = space;
        style.width = "100%";
    }

    return (
        <div
            aria-hidden
            style={style}
            className={`shrink-0 ${className}`}
        />
    );
};