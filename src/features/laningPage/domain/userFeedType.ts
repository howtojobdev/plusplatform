export type UserFeedItemType = {
    type: "class" | "content";
    contentId: string;
};

export type UserFeedMapType = Record<string, UserFeedItemType[]>;