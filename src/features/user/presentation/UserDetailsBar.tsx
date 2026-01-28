"use client";

import { formatBrandDate, greeting } from "@/shared/utils/helperFunctions";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { LogOut, RefreshCw } from "lucide-react";

import { useUserAvatar } from "../application/hooks/useUserAvatar";
import BrandButton from "@/shared/components/BrandButton";

export const UserDetailsBar = () => {
    const { data: session, update } = useSession();
    const avatar = useUserAvatar(256, "robohash");

    const [busy, setBusy] = useState<"logout" | "refresh" | null>(null);

    const user = session?.user ?? null;

    const firstName = user?.firstName ?? "";
    const lastName = user?.lastName ?? "";
    const fullName = `${firstName} ${lastName}`.trim();

    const email = user?.email ?? "";
    const provider = user?.authProvider ?? "";
    const createdAt = user?.createdAt ? new Date(user.createdAt) : null;
    const joined = createdAt ? formatBrandDate(createdAt) : "";

    const verificationRaw = (user?.email_verification_status ?? "").toLowerCase();
    const isVerified = verificationRaw.includes("ver");

    const handleLogout = async () => {
        if (busy) return;
        setBusy("logout");
        try {
            await signOut({ redirect: true });
        } finally {
            setBusy(null);
        }
    };

    const handleRefresh = async () => {
        if (busy) return;
        setBusy("refresh");
        try {
            await update();
        } finally {
            setBusy(null);
        }
    };

    return (
        <section className="w-full pt-[5.25rem] pb-6 bg-[var(--primary-bg)]">
            <div className="relative w-full bg-[var(--primary-accent)]/18">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-28 -left-28 w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] rounded-full bg-[var(--primary-accent)]/35 blur-3xl" />
                    <div className="absolute -bottom-32 -right-24 w-[460px] h-[460px] sm:w-[560px] sm:h-[560px] rounded-full bg-[var(--secondary-accent)]/30 blur-3xl" />
                    <div className="absolute inset-x-0 top-0 h-px bg-[var(--primary-font)]/10" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--primary-font)]/10" />
                </div>

                <div className="content-pad relative py-6 sm:py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 min-w-0">
                        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                            <div className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] md:w-[96px] md:h-[96px] rounded-2xl overflow-hidden bg-[var(--primary-bg)]/35 border border-[var(--primary-font)]/10 shrink-0 shadow-sm">
                                {avatar.src ? (
                                    <img
                                        src={avatar.src}
                                        alt="User avatar"
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                        onError={() => avatar.setImgOk(false)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--primary-font)] font-display text-xl">
                                        {avatar.initials}
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="text-xs sm:text-sm text-[var(--secondary-font)]">
                                    {greeting(firstName || undefined)}
                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-2 min-w-0">
                                    <h1 className="font-display text-2xl sm:text-3xl md:text-4xl leading-tight text-[var(--primary-font)] truncate">
                                        <span className="capitalize">{fullName || "Your account"}</span>
                                    </h1>

                                    <span
                                        className={[
                                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border",
                                            isVerified
                                                ? "bg-emerald-400/10 text-emerald-200 border-emerald-300/20"
                                                : "bg-amber-400/10 text-amber-200 border-amber-300/20",
                                        ].join(" ")}
                                    >
                                        <span
                                            className={[
                                                "h-1.5 w-1.5 rounded-full",
                                                isVerified ? "bg-emerald-300" : "bg-amber-300",
                                            ].join(" ")}
                                        />
                                        {isVerified ? "Verified" : "Not verified"}
                                    </span>

                                    {provider ? (
                                        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold border border-[var(--primary-font)]/10 bg-[var(--primary-bg)]/30 text-[var(--secondary-font)]">
                                            {provider}
                                        </span>
                                    ) : null}
                                </div>

                                {email ? (
                                    <div className="mt-1 text-sm sm:text-[15px] text-[var(--primary-font)]/90 truncate">
                                        {email}
                                    </div>
                                ) : null}

                                {(joined || provider) ? (
                                    <div className="mt-1 text-xs text-[var(--secondary-font)]">
                                        {[provider && `Signed in with ${provider}`, joined && `Joined ${joined}`]
                                            .filter(Boolean)
                                            .join(" • ")}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-center">
                            <BrandButton
                                variant="ghost"
                                size="sm"
                                onClick={handleRefresh}
                                loading={busy === "refresh"}
                                disabled={busy === "logout"}
                                iconLeft={<RefreshCw className="h-4 w-4" />}
                                className="bg-[var(--primary-bg)]/30 border border-[var(--primary-font)]/10 text-[var(--primary-font)] hover:bg-[var(--primary-bg)]/45"
                            >
                                Refresh
                            </BrandButton>

                            <BrandButton
                                variant="cta"
                                size="sm"
                                onClick={handleLogout}
                                loading={busy === "logout"}
                                disabled={busy === "refresh"}
                                iconLeft={<LogOut className="h-4 w-4" />}
                                className="shadow-sm"
                            >
                                Log out
                            </BrandButton>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};