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
    const link = block.link || "";

    const googleViewer = useMemo(() => {
        if (!link) return "";
        try {
            return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(link)}`;
        } catch {
            return "";
        }
    }, [link]);

    return (
        <section className="w-full content-pad">
            <div className="flex items-center justify-between gap-3 mb-2">
                <h2 className="font-display text-[var(--primary-font)] text-lg leading-snug">
                    {title}
                </h2>

                {hasLink ? (
                    <div className="flex items-center gap-2">
                        <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-[var(--secondary-font)] underline underline-offset-4"
                        >
                            Open
                        </a>
                        <a
                            href={link}
                            download={fileName}
                            className="text-sm text-[var(--secondary-font)] underline underline-offset-4"
                        >
                            Download
                        </a>
                    </div>
                ) : null}
            </div>

            {!hasLink ? (
                <p className="text-sm md:text-base text-[var(--secondary-font)]">
                    No PDF link yet.
                </p>
            ) : (
                <div
                    className={cn(
                        "overflow-hidden border border-white/10 bg-[var(--secondary-bg)] shadow-sm",
                        UI_ELEMENT_ROUNDNESS,
                    )}
                >
                    <div className="relative h-[65vh] w-full bg-[var(--primary-bg)]">
                        <iframe
                            src={link}
                            className="absolute inset-0 h-full w-full"
                            title={title}
                            loading="lazy"
                        />
                    </div>

                    {googleViewer ? (
                        <div className="px-4 py-3 border-t border-white/10 text-sm text-[var(--secondary-font)]">
                            If the embed is blank on your device,{" "}
                            <a
                                href={googleViewer}
                                target="_blank"
                                rel="noreferrer"
                                className="underline underline-offset-4"
                            >
                                open with Google Viewer
                            </a>
                            .
                        </div>
                    ) : null}
                </div>
            )}
        </section>
    );
};