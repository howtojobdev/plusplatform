import type { ComponentType } from "react";
import type { ContentBlockKindType, ContentBlockType } from "../../domain/contentBlockType";
import { VideoBlockEntry } from "./VideoBlock";
import { PointsOfGoalsBlock } from "./PointsOfGoalsBlock";
import { StepByStepBlock } from "./StepByStepBlock";
import { PdfBlock } from "./PdfBlock";
import { PointsOfPurposeBlock } from "./PointsOfPurposeBlock";
import { FaqBlock } from "./FaqBlock";
import { ConclusionBlock } from "./ConclusionBlock";
import { KeyPointsBlock } from "./KeyPointsBlock";
import { SourceBlock } from "./SourceBlock";

export type BlockComponentProps<K extends ContentBlockKindType> = {
    block: Extract<ContentBlockType, { type: K }>;
    index: number;
};

export type ContentBlockMapType = {
    [K in ContentBlockKindType]: ComponentType<BlockComponentProps<K>>;
};

export const CONTENT_BLOCK_MAP: ContentBlockMapType = {
    video: VideoBlockEntry,
    keyPoints: KeyPointsBlock,
    pointsOfGoals: PointsOfGoalsBlock,
    stepByStep: StepByStepBlock,
    pdf: PdfBlock,
    pointsOfPurpose: PointsOfPurposeBlock,
    faq: FaqBlock,
    conclusion: ConclusionBlock,
    source: SourceBlock
};