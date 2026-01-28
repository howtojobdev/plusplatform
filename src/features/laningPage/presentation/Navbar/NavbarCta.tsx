"use client";

import BrandButton from "@/shared/components/BrandButton";
import { TextAlignJustify, X } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { useState } from "react";
import { Session } from "next-auth";
import { UserAvatar } from "@/features/user/presentation/UserAvatar";
import { useRouter } from "next/navigation";

type Props = {
    session: Session | null;
};

export const NavbarCta = ({ session }: Props) => {
    const [isMobMenuVis, setIsMobMenuVis] = useState(false);

    const router = useRouter();

    const isValidUser = Boolean(session?.isAuthenticated ?? false);

    const handleSignIn = () => router.push("/login");
    const handleSignUp = () => router.push("/signup");

    return (
        <div className="flex ml-auto items-center gap-2">
            {
                !isValidUser
                    ? (
                        <>
                            <BrandButton
                                variant="ghost"
                                className="hidden md:block"
                                onClick={handleSignIn}
                            >Sign In</BrandButton>
                            <BrandButton
                                variant="cta"
                                className="hidden md:block"
                                onClick={handleSignUp}
                            >Sign Up</BrandButton>
                        </>
                    ) : (
                        <div className="items-center gap-2 hidden lg:flex">
                            {/* <NavbarSearch></NavbarSearch> */}
                            <UserAvatar></UserAvatar>
                        </div>
                    )
            }
            <div className="flex items-center gap-2 lg:hidden">
                <button
                    onClick={() => setIsMobMenuVis(curr => !curr)}
                    className="flex items-center justify-center w-[35px] h-[35px] cursor-pointer relative z-[999]"
                >
                    {
                        isMobMenuVis
                            ? <X></X>
                            : <TextAlignJustify></TextAlignJustify>
                    }
                </button>
                <MobileMenu isVis={isMobMenuVis}></MobileMenu>
            </div>
        </div>
    )
};