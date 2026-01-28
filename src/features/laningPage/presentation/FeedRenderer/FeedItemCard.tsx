"use client";

import React from "react";
import { ContentCardItem } from "@/features/content/presentation/ContentCardItem";
import { ClassCardItem } from "@/features/class/presentation/ClassCardItem";
import { ClassType } from "@/features/class/domain/classType";
import { ContentType } from "@/features/content/domain/contentType";
import { UserFeedItemType } from "../../domain/userFeedType";

type HydratedFeedItem = UserFeedItemType & { data: ClassType | ContentType };

type Props = {
    item: HydratedFeedItem;
    instanceId: string;
};

export const FeedItemCard = ({ item, instanceId }: Props) => {
    if (item.type === "class") {
        return <ClassCardItem compact instanceId={instanceId} classItem={item.data as ClassType} />;
    }
    return <ContentCardItem compact instanceId={instanceId} contentItem={item.data as ContentType} />;
};