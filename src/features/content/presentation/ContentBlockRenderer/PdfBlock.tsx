"use client";

import React, { useMemo } from "react";
import type { PdfContentBlockType } from "../../domain/contentBlockType";
import { cn } from "@/shared/utils/cn";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";

type Props = {
    block: PdfContentBlockType;
    index: number;
};

function getFileName(url: string) {
    try {
        const u = new URL(url);
        const last = u.pathname.split("/").filter(Boolean).pop();
        return last ? decodeURIComponent(last) : "PDF";
    } catch {
        const last = url.split("?")[0].split("/").filter(Boolean).pop();
        return last ? decodeURIComponent(last) : "PDF";
    }
}

export const PdfBlock = ({ block }: Props) => {
    const fileName = useMemo(() => getFileName(block.link || ""), [block.link]);

    const title = (block.title?.trim() || "PDF").trim();
    const hasLink = Boolean(block.link);

    return (
        <section className="w-full content-pad">
            <h2 className="mb-2 font-display text-[var(--primary-font)] text-lg leading-snug">
                {title}
            </h2>

            {!hasLink ? (
                <p className="text-sm md:text-base text-[var(--secondary-font)]">
                    No PDF link yet.
                </p>
            ) : (
                <div className={cn("overflow-hidden border border-white/10 bg-[var(--secondary-bg)] shadow-sm", UI_ELEMENT_ROUNDNESS)}>
                    <div className="relative h-[65vh] w-full bg-[var(--primary-bg)]">
                        <object
                            data={block.link}
                            type="application/pdf"
                            className="absolute inset-0 h-full w-full"
                        >
                            <p className="p-4 text-sm text-[var(--secondary-font)]">
                                Unable to display this PDF. Try opening it in a new tab.
                            </p>
                        </object>
                    </div>
                </div>
            )}
        </section>
    );
};