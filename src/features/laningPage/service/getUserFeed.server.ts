import { httpAccessConfig } from "@/config/httpAccessConfig";
import { ApiResponseType } from "@/shared/types/ApiResponseType";
import { getClasses } from "@/features/class/service/getClasses.server";
import { getContents } from "@/features/content/service/getContents.server";
import { UserFeedItemType } from "../domain/userFeedType";
import { ClassType } from "@/features/class/domain/classType";
import { ContentType } from "@/features/content/domain/contentType";

type FeedBucket = {
    index: number;
    items: UserFeedItemType[];
};

type AppConfigFeedMapResponse = Record<string, FeedBucket>;

type HydratedFeedItem<T> = UserFeedItemType & { data: T };

type FinalUserFeedMap = Record<string, Array<HydratedFeedItem<ClassType | ContentType>>>;

export const getUserFeed = async (): Promise<FinalUserFeedMap | null> => {
    const res = await fetch(`${httpAccessConfig.mainUrl}/appConfig/getAll`, {
        method: "GET",
        headers: httpAccessConfig.mainHeaders,
        next: { revalidate: httpAccessConfig.revalidateTime },
    });

    let resolvedData: ApiResponseType<{ feedMap: AppConfigFeedMapResponse }[]>;
    try {
        resolvedData = (await res.json()) as ApiResponseType<{ feedMap: AppConfigFeedMapResponse }[]>;
    } catch {
        return null;
    }

    if (!res.ok || !resolvedData.successful || !resolvedData.data?.length) return null;

    const feedMap = resolvedData.data[0].feedMap;
    if (!feedMap) return null;

    const classIdsSet = new Set<string>();
    const contentIdsSet = new Set<string>();

    for (const bucket of Object.values(feedMap)) {
        if (!Array.isArray(bucket.items)) continue;

        for (const item of bucket.items) {
            if (!item?.contentId) continue;
            if (item.type === "class") classIdsSet.add(item.contentId);
            if (item.type === "content") contentIdsSet.add(item.contentId);
        }
    }

    const [classes, contents] = await Promise.all([
        getClasses(Array.from(classIdsSet)),
        getContents(Array.from(contentIdsSet)),
    ]);

    if (!classes || !contents) return null;

    const classById = new Map<string, ClassType>(classes.map((c) => [String(c.id), c]));
    const contentById = new Map<string, ContentType>(contents.map((c) => [String(c.id), c]));

    const sortedEntries = Object.entries(feedMap).sort(
        ([, a], [, b]) => (a.index ?? 0) - (b.index ?? 0)
    );

    const finalFeedMap: FinalUserFeedMap = {};

    for (const [key, bucket] of sortedEntries) {
        finalFeedMap[key] = bucket.items
            .map((item): HydratedFeedItem<ClassType | ContentType> | null => {
                const data =
                    item.type === "class"
                        ? classById.get(item.contentId) ?? null
                        : contentById.get(item.contentId) ?? null;

                if (!data) return null;

                return { ...item, data };
            })
            .filter(
                (v): v is HydratedFeedItem<ClassType | ContentType> => v !== null
            );
    }

    return finalFeedMap;
};