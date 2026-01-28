// app/api/plusMeta/bookmarks/toggle/route.ts
import { httpAccessConfig } from "@/config/httpAccessConfig";
import { ApiResponseType } from "@/shared/types/ApiResponseType";
import { NextResponse } from "next/server";

type ToggleBody = {
    userId?: string;
    bookmarkId?: string;
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as ToggleBody;

        if (!body.userId || !body.bookmarkId) {
            const payload: ApiResponseType<null> = {
                successful: false,
                errMessage: {
                    devMessage: !body.userId
                        ? "userId is required to toggle bookmark"
                        : "bookmarkId is required to toggle bookmark",
                    userMessage: "An Internal-Error has occured! Please try refreshing the page.",
                },
                data: null,
            };

            return NextResponse.json(payload, { status: 400 });
        }

        const upstreamRes = await fetch(
            `${httpAccessConfig.mainUrl}/plusMeta/bookmarks/toggle`,
            {
                method: "POST",
                headers: {
                    ...httpAccessConfig.mainHeaders,
                },
                body: JSON.stringify({
                    userId: body.userId,
                    bookmarkId: body.bookmarkId,
                }),
                cache: "no-store",
            }
        );

        const resolvedData =
            (await upstreamRes.json()) as ApiResponseType<string[]>;

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
}