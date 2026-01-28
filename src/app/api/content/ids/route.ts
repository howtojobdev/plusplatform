import { NextResponse } from "next/server";
import { ApiResponseType } from "@/shared/types/ApiResponseType";
import { getContents } from "@/features/content/service/getContents.server";

type Body = {
    ids?: string[];
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as Body;
        const ids = Array.isArray(body?.ids) ? body.ids : [];

        const data = await getContents(ids);

        const payload: ApiResponseType<any> = {
            successful: !!data,
            errMessage: {
                devMessage: data ? "" : "Failed to fetch contents by ids",
                userMessage: data ? "" : "Something went wrong. Please try again.",
            },
            data: data ?? null,
        };

        return NextResponse.json(payload, { status: data ? 200 : 500 });
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