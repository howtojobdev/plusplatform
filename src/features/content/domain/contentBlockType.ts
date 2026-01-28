export type QAContentBlockItemType = {
    question: string;
    answer: string;
};

export type StepContentBlockItemType = {
    preInfo?: string;
    question: string;
    answer: string;
};

export type GoalContentBlockItemType = {
    image?: string;
    title: string;
    description?: string;
};

export type VideoContentBlockType = {
    type: "video";
    video: string;
    title: string;
    description?: string;
};

export type KeyPointsContentBlockType = {
    type: "keyPoints";
    title?: string,
    description?: string,
    points: QAContentBlockItemType[];
};

export type PointsOfPurposeContentBlockType = {
    type: "pointsOfPurpose";
    points: QAContentBlockItemType[];
};

export type StepByStepContentBlockType = {
    type: "stepByStep";
    title: string;
    description?: string;
    steps: StepContentBlockItemType[];
};

export type PointsOfGoalsContentBlockType = {
    type: "pointsOfGoals";
    items: GoalContentBlockItemType[];
};

export type FaqContentBlockType = {
    type: "faq";
    items: QAContentBlockItemType[];
};

export type ConclusionContentBlockType = {
    type: "conclusion";
    content: string;
};

export type PdfContentBlockType = {
    type: "pdf";
    title: string;
    link: string;
};

export type SourceContentBlockType = {
    type: "source";
    source: string;
};

export type ContentBlockType =
    | VideoContentBlockType
    | KeyPointsContentBlockType
    | PointsOfPurposeContentBlockType
    | StepByStepContentBlockType
    | PointsOfGoalsContentBlockType
    | FaqContentBlockType
    | ConclusionContentBlockType
    | PdfContentBlockType
    | SourceContentBlockType;

export type ContentBlockKindType = ContentBlockType["type"];