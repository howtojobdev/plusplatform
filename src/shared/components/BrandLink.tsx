import Link from "next/link";
import { cn } from "../utils/cn";

type Props = {
    children: React.ReactNode;
    href: string;
    faded?: boolean;
    newPage?: boolean;
    className?: string;
};

export const BrandLink = ({ children, href, newPage=false, faded=true, className }: Props) => {
    return (
        <div className={cn(
            "flex flex-col group cursor-pointer w-fit",
            className
        )}>
            <Link
                href={href}
                target={newPage ? "_blank" : "_self"}
                className={cn(
                    "transition duration-200",
                    !faded
                        ? "text-[var(--primary-font)]"
                        : "text-[var(--secondary-font)] " +
                    "hover:text-[var(--primary-font)] active:text-[var(--primary-font)]"
                )}
            >
                {children}
            </Link>
            <hr className="w-[0%] group-hover:w-[100%] transition-[width] duration-200 border-[var(--primary-accent)]" />
        </div>
    );
};