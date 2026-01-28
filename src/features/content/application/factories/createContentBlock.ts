import {
    ContentBlockKindType,
    ContentBlockType,
    VideoContentBlockType,
    KeyPointsContentBlockType,
    PointsOfPurposeContentBlockType,
    StepByStepContentBlockType,
    PointsOfGoalsContentBlockType,
    FaqContentBlockType,
    ConclusionContentBlockType,
    PdfContentBlockType,
    SourceContentBlockType,
} from "../../domain/contentBlockType";

function assertNever(x: never): never {
    throw new Error(`Unhandled content block type: ${String(x)}`);
}

export function createContentBlock(type: "video"): VideoContentBlockType;
export function createContentBlock(type: "keyPoints"): KeyPointsContentBlockType;
export function createContentBlock(type: "pointsOfPurpose"): PointsOfPurposeContentBlockType;
export function createContentBlock(type: "stepByStep"): StepByStepContentBlockType;
export function createContentBlock(type: "pointsOfGoals"): PointsOfGoalsContentBlockType;
export function createContentBlock(type: "faq"): FaqContentBlockType;
export function createContentBlock(type: "conclusion"): ConclusionContentBlockType;
export function createContentBlock(type: "pdf"): PdfContentBlockType;
export function createContentBlock(type: "source"): SourceContentBlockType;

export function createContentBlock(type: ContentBlockKindType): ContentBlockType;

export function createContentBlock(type: ContentBlockKindType): ContentBlockType {
    switch (type) {
        case "video":
            return { type, video: "", title: "", description: "" };

        case "keyPoints":
            return { type, title: "", description: "", points: [{ question: "", answer: "" }] };

        case "pointsOfPurpose":
            return { type, points: [{ question: "", answer: "" }] };

        case "stepByStep":
            return {
                type,
                title: "",
                description: "",
                steps: [{ preInfo: "", question: "", answer: "" }],
            };

        case "pointsOfGoals":
            return { type, items: [{ image: "", title: "", description: "" }] };

        case "faq":
            return { type, items: [{ question: "", answer: "" }] };

        case "conclusion":
            return { type, content: "" };

        case "pdf":
            return { type, title: "", link: "" };

        case "source":
            return { type, source: "" };

        default:
            return assertNever(type);
    }
}