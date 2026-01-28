export const httpAccessConfig = {
    mainUrl: `${process.env.MAIN_SERVER_URL!}/plus`,
    mainAuthUrl: `${process.env.MAIN_SERVER_URL!}/auth`,
    mainHeaders: {
        "Content-Type": "application/json",
        "x-app-id": process.env.MAIN_SERVER_APP_ID!,
        "Authorization": `Bearer ${process.env.MAIN_SERVER_ACCESS!}`
    },
    mainHeadersWithFile: {

    },
    baseUrl: "/api",
    revalidateTime: 60 * 60 * 24 // 1 Day
} as const;