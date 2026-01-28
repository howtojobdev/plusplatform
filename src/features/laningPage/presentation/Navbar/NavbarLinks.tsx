import { BrandLink } from "@/shared/components/BrandLink";
import { NAV_LINKS } from "@/shared/constants/navLinks";

export const NavbarLinks = () => {
    return (
        <div className="hidden lg:flex items-center ml-12 gap-3">
            {
                NAV_LINKS.map(linkDat => (
                    <BrandLink href={linkDat.href}>{linkDat.name}</BrandLink>
                ))
            }
        </div>
    );
};