import { NavbarLogo } from "@/features/laningPage/presentation/Navbar/NavbarLogo";
import { UserAvatar } from "@/features/user/presentation/UserAvatar";
import { cn } from "@/shared/utils/cn";
import Link from "next/link";

type Props = {
    inPlace?: boolean;
};

export const ContentNavbar = async ({ inPlace=false }: Props) => {
    return (
        <nav className={cn(
            "w-full p-6 flex items-center bg-gradient-to-b",
            "from-black/70 to-black/0 z-[999] justify-between",
            inPlace ? "flex" : "top-0 right-0 absolute"
        )}>
            <Link href={"/"} className="flex items-center gap-2">
                <NavbarLogo></NavbarLogo>
            </Link>
            <UserAvatar></UserAvatar>
        </nav>
    );
};