"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { gravatarUrl } from "@/shared/utils/helperFunctions";

export const useUserAvatar = (size: number = 128, fallback: "robohash" | "identicon" | "mp" = "robohash") => {
    const { data: session, status } = useSession();

    const email = session?.user?.email ?? "";
    const first = session?.user?.firstName?.at(0) ?? "";
    const last = session?.user?.lastName?.at(0) ?? "";
    const initials = (first + last).trim() || (email?.at(0)?.toUpperCase() ?? "?");

    const src = useMemo(
        () => (email ? gravatarUrl(email, { size, default: fallback }) : ""),
        [email, size, fallback]
    );

    const [imgOk, setImgOk] = useState(true);

    return {
        status,
        email,
        initials,
        src: src && imgOk ? src : "",
        imgOk,
        setImgOk,
        session,
        user: session?.user ?? null,
    };
};