import {
    AUTH_PROVIDER_ENUM,
    EMAIL_VERIFICATION_STATUS_ENUM,
    GENDER_ENUM
} from "@/shared/enums";

export type UserType = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verification_status: EMAIL_VERIFICATION_STATUS_ENUM;
    gender: GENDER_ENUM;
    dob: string;
    country: string;
    city: string;
    walletId: string;
    authProvider: AUTH_PROVIDER_ENUM;
    createdAt: string;
    updatedAt: string;
}