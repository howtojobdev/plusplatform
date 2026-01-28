import { httpAccessConfig } from "@/config/httpAccessConfig";
import { UserPrefrenceType } from "@/features/user/domain/userPrefrenceType";
import { ApiResponseType } from "@/shared/types/ApiResponseType";
import { NextResponse } from "next/server";

type Params = {
    userId: string;
}

export const GET = async (
    _req: Request,
    { params }: { params: Params }
) => {
    const userId = params.userId;

    if (!userId) {
        const payload: ApiResponseType<null> = {
            successful: false,
            errMessage: {
                devMessage: !userId
                    ? "userId is required to toggle bookmark"
                    : "bookmarkId is required to toggle bookmark",
                userMessage: "An Internal-Error has occured! Please try refreshing the page.",
            },
            data: null,
        };

        return NextResponse.json(payload, { status: 400 });
    }

    try {
        const upstreamRes = await fetch(
            `${httpAccessConfig.mainUrl}/plusMeta/${userId}`,
            {
                method: "GET",
                headers: {
                    ...httpAccessConfig.mainHeaders,
                },
                cache: "no-store",
            }
        );

        const resolvedData =
            (await upstreamRes.json()) as ApiResponseType<UserPrefrenceType>;

        return NextResponse.json(resolvedData, {
            status: upstreamRes.status,
        });
    } catch (err) {
        const payload: ApiResponseType<null> = {
            successful: false,
            errMessage: {
                devMessage: err instanceof Error ? err.message : "Unknown error",
                userMessage: "Something went wrong. Please try again.",
            },
            data: null,
        };

        return NextResponse.json(payload, { status: 500 });
    }
};