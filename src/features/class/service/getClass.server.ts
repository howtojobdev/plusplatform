import "server-only";

import { authOptions } from "@/config/authOptions";
import { httpAccessConfig } from "@/config/httpAccessConfig";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ApiResponseType } from "@/shared/types/ApiResponseType";
import { ClassType } from "../domain/classType";

export const getClass = async (id: string) => {
    const session = await getServerSession(authOptions);
    const existingPerms = session?.wallet?.permissions;

    if (!existingPerms?.length) redirect("/not-allowed");

    const res = await fetch(`${httpAccessConfig.mainUrl}/classContent/${id}`, {
        method: "GET",
        headers: httpAccessConfig.mainHeaders,
        next: { revalidate: httpAccessConfig.revalidateTime },
    });

    let resolvedData: ApiResponseType<ClassType>;
    try {
        resolvedData = (await res.json()) as ApiResponseType<ClassType>;
    } catch {
        return null;
    }

    if (!res.ok || !resolvedData.successful || !resolvedData.data) return null;

    const classContentData = resolvedData.data;
    const neededPerms = classContentData.permissions ?? [];

    const isAllowed = neededPerms.some((perm) => existingPerms.includes(perm));

    if (!isAllowed) redirect("/not-allowed");

    return classContentData;
};