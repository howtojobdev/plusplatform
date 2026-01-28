"use client";

import { VideoContentBlockType } from "@/features/content/domain/contentBlockType";
import React, { Suspense } from "react";
import { VideoBlock } from "./VideoBlock";

type Props = {
    block: VideoContentBlockType;
    index: number;
};

export const VideoBlockEntry = ({ block }: Props) => {

    return (
        <Suspense fallback={null}>
            <VideoBlock block={block}></VideoBlock>
        </Suspense>
    );
};