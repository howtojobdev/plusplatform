"use client";

import React from "react";
import type { ConclusionContentBlockType } from "../../domain/contentBlockType";

type Props = {
    block: ConclusionContentBlockType;
    index: number;
};

export const ConclusionBlock = ({ block }: Props) => {
    const html = block.content?.trim();

    if (!html) return null;

    return (
        <section className="w-full -mt-[1.55rem]">
            <div className="content-pad conclusion_block">
                <div className="mx-auto max-w-4xl">
                    <div
                        className="prose prose-invert prose-p:leading-relaxed prose-headings:font-display prose-headings:text-[var(--primary-font)] prose-p:text-[var(--secondary-font)] prose-strong:text-[var(--primary-font)]"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </div>
            </div>
        </section>
    );
};