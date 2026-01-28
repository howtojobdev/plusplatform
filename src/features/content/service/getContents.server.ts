import "server-only";

import { httpAccessConfig } from "@/config/httpAccessConfig";
import { ApiResponseType } from "@/shared/types/ApiResponseType";
import { ContentType } from "../domain/contentType";

export const getContents = async (ids: string[]) => {
    if (!Array.isArray(ids) || ids.length === 0) return [];

    const res = await fetch(`${httpAccessConfig.mainUrl}/content/ids`, {
        method: "POST",
        headers: {
            ...httpAccessConfig.mainHeaders
        },
        body: JSON.stringify({ ids  }),
        next: { revalidate: httpAccessConfig.revalidateTime },
    });

    let resolvedData: ApiResponseType<ContentType[]>;
    try {
        resolvedData = (await res.json()) as ApiResponseType<ContentType[]>;
    } catch {
        return null;
    }

    if (!res.ok || !resolvedData.successful || !resolvedData.data) return null;

    const contents = resolvedData.data;

    return contents;
};
