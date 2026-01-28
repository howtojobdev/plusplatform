import { ContentType } from "@/features/content/domain/contentType";

export type ClassContentItemType = ContentType & {
    index: number;
    isCompleted: boolean;
    lastVisited: string;
};

export type ClassType = {
    id: string;
    title: string;
    synopsis: string;
    content: ClassContentItemType[];
    permissions: string[];
    titleImage: string;
    previewImage: string;
    status: string;
    createdAt: string;
    updatedAt: string;
};