import "server-only";

import { httpAccessConfig } from "@/config/httpAccessConfig";
import { ApiResponseType } from "@/shared/types/ApiResponseType";
import { ClassType } from "../domain/classType";

export const getClasses = async (ids: string[]) => {
    if (!Array.isArray(ids) || ids.length === 0) return [];

    const res = await fetch(`${httpAccessConfig.mainUrl}/classContent/ids`, {
        method: "POST",
        headers: {
            ...httpAccessConfig.mainHeaders
        },
        body: JSON.stringify({ ids }),
        next: { revalidate: httpAccessConfig.revalidateTime },
    });

    let resolvedData: ApiResponseType<ClassType[]>;
    try {
        resolvedData = (await res.json()) as ApiResponseType<ClassType[]>;
    } catch {
        return null;
    }

    if (!res.ok || !resolvedData.successful || !resolvedData.data) return null;

    const classes = resolvedData.data;

    return classes;
};