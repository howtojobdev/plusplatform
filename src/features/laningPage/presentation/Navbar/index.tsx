import { NavbarCta } from "./NavbarCta";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarLinks } from "./NavbarLinks";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/authOptions";
import Link from "next/link";

const Navbar = async () => {
    const session = await getServerSession(authOptions);

    return (
        <nav className="w-full p-6 flex items-center fixed top-0 right-0 bg-gradient-to-b from-black to-black/0 z-[299]">
            <Link href={"/"}>
                <NavbarLogo></NavbarLogo>
            </Link>
            <NavbarLinks></NavbarLinks>
            <NavbarCta session={session}></NavbarCta>
        </nav>
    );
};

export default Navbar;