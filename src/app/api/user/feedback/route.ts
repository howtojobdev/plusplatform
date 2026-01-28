import { httpAccessConfig } from "@/config/httpAccessConfig";
import { ApiResponseType } from "@/shared/types/ApiResponseType";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/authOptions";

type SetFeedbackBody = {
    weekIndex?: number;
    weekday?: string;
    feedback?: string;
};

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json(
                {
                    successful: false,
                    errMessage: {
                        devMessage: "Unauthorized",
                        userMessage: "Please login again.",
                    },
                    data: null,
                } satisfies ApiResponseType<null>,
                { status: 401 },
            );
        }

        const body = (await req.json()) as SetFeedbackBody;

        if (
            body.weekIndex === undefined ||
            body.weekIndex === null ||
            !body.weekday ||
            typeof body.feedback !== "string"
        ) {
            return NextResponse.json(
                {
                    successful: false,
                    errMessage: {
                        devMessage: "Invalid payload",
                        userMessage: "Invalid request.",
                    },
                    data: null,
                } satisfies ApiResponseType<null>,
                { status: 400 },
            );
        }

        const upstreamRes = await fetch(
            `${httpAccessConfig.mainUrl}/plusMeta/weeks/day/student/feedback`,
            {
                method: "PATCH",
                headers: {
                    ...httpAccessConfig.mainHeaders,
                },
                body: JSON.stringify({
                    userId,
                    weekIndex: body.weekIndex,
                    weekday: body.weekday,
                    feedback: body.feedback,
                }),
                cache: "no-store",
            },
        );

        const resolvedData = (await upstreamRes.json()) as ApiResponseType<{ weeks: any[] }>;

        return NextResponse.json(resolvedData, { status: upstreamRes.status });
    } catch (err) {
        return NextResponse.json(
            {
                successful: false,
                errMessage: {
                    devMessage: err instanceof Error ? err.message : "Unknown error",
                    userMessage: "Something went wrong.",
                },
                data: null,
            } satisfies ApiResponseType<null>,
            { status: 500 },
        );
    }
}