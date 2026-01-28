export type AuthClientModeType = "login" | "signup" | "forgot";

export type AuthClientParamsType = {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    dob?: string;
    country?: string;
    mode: AuthClientModeType;
};