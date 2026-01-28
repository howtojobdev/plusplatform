import { create } from "zustand";
import { AUTH_PROVIDER_ENUM, EMAIL_VERIFICATION_STATUS_ENUM, GENDER_ENUM } from "@/shared/enums";
import { AuthStateActionsType, AuthStateType } from "../../domain/authStateType";

const initialAuthState: AuthStateType = {
    user: {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        email_verification_status: EMAIL_VERIFICATION_STATUS_ENUM.INVALID,
        gender: GENDER_ENUM.PREFER_NOT_SAY,
        dob: "",
        country: "",
        city: "",
        walletId: "",
        authProvider: AUTH_PROVIDER_ENUM.CREDENTIALS,
        createdAt: "",
        updatedAt: ""
    },
    isAuthenticated: false,
};

export const useAuthStore = create<AuthStateType & AuthStateActionsType>((set) => ({
    ...initialAuthState,

    setAuth: (state) => set(() => ({ ...state, isAuthenticated: true })),

    setUser: (user) =>
        set(() => ({
            user,
            isAuthenticated: true
        })),

    logout: () =>
        set(() => ({
            ...initialAuthState
        }))
}));