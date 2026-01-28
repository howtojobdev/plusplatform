export type NavbarStateType = {
    searchQuery: string;
};

export type NavbarStateActionsType = {
    setSearchQuery: (query: string) => void;
};