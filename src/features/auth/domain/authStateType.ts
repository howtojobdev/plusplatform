import { UserType } from "@/features/user/domain/userType";

export type AuthStateType = {
    user: UserType;
    isAuthenticated: boolean;
};

export type AuthStateActionsType = {
    setAuth: (state: AuthStateType) => void;
    setUser: (user: AuthStateType["user"]) => void;
    logout: () => void;
};