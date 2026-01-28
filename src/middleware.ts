import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    async (req) => {
        const { nextUrl } = req;
        const path = nextUrl.pathname;
        const token = req.nextauth.token;

        if (
            path.startsWith("/_next") ||
            path === "/favicon.ico" ||
            path === "/robots.txt" ||
            path === "/sitemap.xml" ||
            /\.(?:png|jpg|jpeg|gif|webp|svg|ico|avif|bmp|tiff|mp4|webm|ogg|mp3|wav|txt|xml|json|css|js|map|woff2?|ttf|otf|eot)$/i.test(
                path
            )
        ) {
            return NextResponse.next();
        }

        const authBlockedPaths = ["/login", "/signup"];
        const guestBlockedPaths = ["/profile"];

        const isAuthenticated = Boolean(token?.isAuthenticated);

        if (isAuthenticated && authBlockedPaths.includes(path)) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (!isAuthenticated && guestBlockedPaths.includes(path)) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: { authorized: () => true },
        pages: { signIn: "/login" },
    }
);

export const config = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
    ],
};