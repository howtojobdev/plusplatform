import { getUserFeed } from "../../service/getUserFeed.server";
import { ClassType } from "@/features/class/domain/classType";
import { ContentType } from "@/features/content/domain/contentType";
import { UserFeedItemType } from "../../domain/userFeedType";
import { FeedCarousel } from "./FeedCarousel";

type HydratedFeedItem = UserFeedItemType & { data: ClassType | ContentType };
type FinalUserFeedMap = Record<string, HydratedFeedItem[]>;

export const FeedRenderer = async () => {
    const feedData = (await getUserFeed()) as FinalUserFeedMap | null;
    if (!feedData) return (
        <div className="relative z-30 flex flex-col gap-6 -mt-[25dvh] px-4 md:px-12">
            <h1>Oops, something went wrong! Please try refreshing the page.</h1>
        </div>
    );

    return <FeedCarousel feedData={feedData}></FeedCarousel>
};