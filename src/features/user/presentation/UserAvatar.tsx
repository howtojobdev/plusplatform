"use client";

import BrandButton from "@/shared/components/BrandButton";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { cn } from "@/shared/utils/cn";
import Link from "next/link";
import { useUserAvatar } from "../application/hooks/useUserAvatar";

export const UserAvatar = () => {
    const avatar = useUserAvatar();

    return (
        <Link href={"/profile"}>
            <BrandButton
                className={cn(
                    "w-[40px] h-[40px] p-2",
                    UI_ELEMENT_ROUNDNESS,
                    "flex items-center justify-center overflow-hidden",
                    "text-[var(--primary-bg)] font-display cursor-pointer select-none"
                )}
                variant="pill"
                loading={avatar.status === "loading"}
                disabled={avatar.status === "loading"}
            >
                {avatar.src ? (
                    <img
                        src={avatar.src}
                        alt="User avatar"
                        className="min-w-[40px] min-h-[40px] object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => avatar.setImgOk(false)}
                    />
                ) : (
                    <span className="capitalize">{avatar.initials}</span>
                )}
            </BrandButton>
        </Link>
    );
};