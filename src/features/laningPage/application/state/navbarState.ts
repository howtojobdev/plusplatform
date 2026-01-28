import { create } from "zustand";
import { NavbarStateActionsType, NavbarStateType } from "../../domain/navbarStateType";

const initialNavbarState: NavbarStateType = {
    searchQuery: ""
};

export const useNavbarStore = create<NavbarStateType & NavbarStateActionsType>((set) => ({
    ...initialNavbarState,
    
    setSearchQuery(query) {
        set((state) => ({ ...state, searchQuery: query }));
    },
}));