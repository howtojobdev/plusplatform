import { DefaultUser, DefaultSession } from "next-auth";
import { UserType } from "@/features/user/domain/userType";
import { WalletType } from "@/features/wallet/domain/walletType";

declare module "next-auth" {
    interface Session {
        user: UserType | null;
        wallet: WalletType | null;
        isAuthenticated: boolean;
    };

    interface User extends DefaultUser {
        appUser?: UserType;
        wallet?: WalletType | null;
    };
};

declare module "next-auth/jwt" {
    interface JWT {
        user?: UserType;
        wallet?: WalletType | null;
        isAuthenticated: boolean;
    };
};