"use client";

import { useUserPrefrenceStore } from "@/features/user/application/state/userPrefrenceState";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

type Props = {
    children: React.ReactNode;
};

export const InitStateWrapper = ({ children }: Props) => {
    const { data: session } = useSession();
    
    const loadPrefrences = useUserPrefrenceStore(state => state.loadPrefrences);
    const weeks = useUserPrefrenceStore(state => state.weeks);

    const userId = session?.user?.id;

    useEffect(() => {
        if(!userId) return;

        const loadStates = async () => {
            await loadPrefrences(userId);
            console.log(weeks);
        };

        loadStates();
    }, [userId]);

    return (
        children
    );
};