import "server-only";

import { authOptions } from "@/config/authOptions";
import { httpAccessConfig } from "@/config/httpAccessConfig";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ApiResponseType } from "@/shared/types/ApiResponseType";
import { ContentType } from "../domain/contentType";

export const getContent = async (id: string) => {
    const session = await getServerSession(authOptions);
    const existingPerms = session?.wallet?.permissions;

    if (!existingPerms?.length) redirect("/not-allowed");

    const res = await fetch(`${httpAccessConfig.mainUrl}/content/${id}`, {
        method: "GET",
        headers: httpAccessConfig.mainHeaders,
        next: { revalidate: httpAccessConfig.revalidateTime },
    });

    let resolvedData: ApiResponseType<ContentType>;
    try {
        resolvedData = (await res.json()) as ApiResponseType<ContentType>;
    } catch {
        return null;
    }

    if (!res.ok || !resolvedData.successful || !resolvedData.data) return null;

    const contentData = resolvedData.data;
    const neededPerms = contentData.permissions ?? [];

    const isAllowed = neededPerms.some((perm) => existingPerms.includes(perm));

    if (!isAllowed) redirect("/not-allowed");
    
    return contentData;
};