import { CLASSCONTENT_STATUS_ENUM, CONTENT_TYPES_ENUM } from "@/shared/enums";
import { ContentBlockType } from "./contentBlockType";

export type ContentType = {
    id: string;
    type: CONTENT_TYPES_ENUM;
    title: string;
    synopsis: string;
    blocks: ContentBlockType[];
    permissions: string[];
    genre: string[];
    titleImage: string;
    previewImage: string;
    tags: string[];
    estimatedDuration: string;
    status: CLASSCONTENT_STATUS_ENUM;
    createdAt: string;
    updatedAt: string;
};