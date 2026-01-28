import { redirect } from "next/navigation";
import { getUserFeed } from "../../service/getUserFeed.server";
import { ClientFeedRenderer } from "./ClientFeedRenderer";
import { ClassType } from "@/features/class/domain/classType";
import { ContentType } from "@/features/content/domain/contentType";
import { UserFeedItemType } from "../../domain/userFeedType";

type HydratedFeedItem = UserFeedItemType & { data: ClassType | ContentType };
type FinalUserFeedMap = Record<string, HydratedFeedItem[]>;

export const FeedRenderer = async () => {
    const feedData = (await getUserFeed()) as FinalUserFeedMap | null;
    if (!feedData) redirect("/error");

    return <ClientFeedRenderer feedData={feedData} />;
};