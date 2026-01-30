import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthClientParamsType } from "@/shared/types/AuthClientParamsType";
import { ApiResponseType } from "@/shared/types/ApiResponseType";
import { AUTH_PROVIDER_ENUM, GENDER_ENUM } from "@/shared/enums";
import { ServerAuthResponseType } from "@/shared/types/ServerAuthResponseType";
import { APP_ID } from "@/shared/constants/app";
import { httpAccessConfig } from "./httpAccessConfig";

export const authOptions: AuthOptions = {
    session: { strategy: "jwt" },

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                mode: { label: "Mode", type: "text" },
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                firstName: { label: "First name", type: "text" },
                lastName: { label: "Last name", type: "text" },
                dob: { label: "DOB", type: "text" },
                country: { label: "Country", type: "text" },
            },

            async authorize(credentials) {
                if (!credentials) return null;

                const { firstName, lastName, email, password, dob, country, mode } =
                    credentials as AuthClientParamsType;

                if (!mode || !email || !password) return null;

                const endpoint =
                    mode === "login"
                        ? "/login"
                        : mode === "signup"
                            ? "/register"
                            : null;

                if (!endpoint) return null;

                try {
                    const res = await fetch(`${httpAccessConfig.mainAuthUrl}${endpoint}`, {
                        method: "POST",
                        headers: {
                            ...httpAccessConfig.mainHeaders,
                        },
                        body: JSON.stringify(
                            mode === "login"
                                ? { email, password }
                                : {
                                    firstName,
                                    lastName,
                                    email,
                                    password,
                                    dob,
                                    country,
                                    gender: GENDER_ENUM.PREFER_NOT_SAY,
                                    authProvider: AUTH_PROVIDER_ENUM.CREDENTIALS,
                                    appId: APP_ID,
                                }
                        ),
                    });

                    const data =
                        (await res.json()) as ApiResponseType<ServerAuthResponseType>;

                    if (!data.successful) throw new Error(data.errMessage.userMessage);

                    const backend = data.data;

                    return {
                        id: backend.user.id,
                        email: backend.user.email,
                        name: `${backend.user.firstName} ${backend.user.lastName}`,
                        appUser: backend.user,
                        wallet: backend.wallet ?? null,
                    };
                } catch (err: any) {
                    throw new Error(
                        err?.message ??
                        (mode === "login" ? "LOGIN_FAILED" : "SIGNUP_FAILED")
                    );
                }
            },
        }),
    ],

    pages: {
        signIn: "/login",
        newUser: "/signup"
    },

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== "google") return true;

            try {
                const email = user?.email;
                if (!email) throw new Error("GOOGLE_EMAIL_MISSING");

                const idToken = account.id_token;
                if (!idToken) throw new Error("GOOGLE_TOKEN_MISSING");

                const res = await fetch(`${httpAccessConfig.mainAuthUrl}/google`, {
                    method: "POST",
                    headers: {
                        ...httpAccessConfig.mainHeaders,
                    },
                    body: JSON.stringify({ idToken, appId: APP_ID }),
                });

                const data =
                    (await res.json()) as ApiResponseType<ServerAuthResponseType>;

                if (!data.successful) throw new Error(data.errMessage.userMessage);

                const backend = data.data;

                (user as any).appUser = backend.user;
                (user as any).wallet = backend.wallet ?? null;

                return true;
            } catch (err: any) {
                throw new Error(err?.message ?? "GOOGLE_SIGNIN_FAILED");
            }
        },

        async jwt({ token, user, trigger }) {
            if (user) {
                const u = user as any;
                if (u.appUser) {
                    token.user = u.appUser;
                    token.wallet = u.wallet ?? null;
                }
                token.isAuthenticated = true;
            }

            if (trigger === "update" && token.user?.email) {
                try {
                    const res = await fetch(
                        `${httpAccessConfig.mainAuthUrl}/getAuthUser`,
                        {
                            method: "POST",
                            headers: {
                                ...httpAccessConfig.mainHeaders,
                            },
                            body: JSON.stringify({ email: token.user.email }),
                        }
                    );

                    const data =
                        (await res.json()) as ApiResponseType<ServerAuthResponseType>;

                    if (!data.successful) throw new Error(data.errMessage.userMessage);

                    const backend = data.data;

                    token.user = backend.user;
                    token.wallet = backend.wallet ?? null;
                    console.log("Token Update happening");
                } catch (err: any) {
                    throw new Error(err?.message ?? "AUTH_USER_REFRESH_FAILED");
                }
            }

            token.isAuthenticated = !!token.user;
            return token;
        },

        async session({ session, token }) {
            session.user = (token as any).user ?? null;
            session.wallet = (token as any).wallet ?? null;
            session.isAuthenticated = !!(token as any).user;
            return session;
        },
    },
};