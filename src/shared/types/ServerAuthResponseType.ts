import { UserType } from "@/features/user/domain/userType";
import { WalletType } from "@/features/wallet/domain/walletType";

export type ServerAuthResponseType = {
    user: UserType,
    wallet: WalletType;
};