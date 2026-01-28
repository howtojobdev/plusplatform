import { APPS_ENUM } from "@/shared/enums";

export type WalletType = {
    id: string;
    userId: string;
    email: string;
    permissions: string[];
    appsEnrolled: APPS_ENUM[];
    appCredits: Partial<Record<APPS_ENUM, number>>;
    appRenewals: Partial<Record<APPS_ENUM, number>>;
    activePlans: string[];
};