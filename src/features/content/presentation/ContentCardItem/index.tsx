"use client";

import { ContentType } from "@/features/content/domain/contentType";
import { Card } from "@/shared/components/Card";

type Props = {
    contentItem: ContentType;
    compact?: boolean;
    isCompleted?: boolean;
    lastVisited?: string;
    instanceId?: string;
};

export const ContentCardItem = ({
    contentItem,
    compact
}: Props) => {
    return (
        <Card
            key={contentItem.id}
            id={contentItem.id}
            type={"content"}
            contentType={contentItem.type}
            previewImage={contentItem.previewImage}
            titleImage={contentItem.titleImage}
            title={contentItem.title}
            updatedAt={contentItem.updatedAt}
            status={contentItem.status}
            synopsis={contentItem.synopsis}
            isDragging={false}
            compact={compact}
        ></Card>
    );
};