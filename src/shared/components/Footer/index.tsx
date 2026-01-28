"use client";

import React from "react";
import { footerConfig } from "./config";
import { NavbarLogo } from "@/features/laningPage/presentation/Navbar/NavbarLogo";
import Link from "next/link";
import { BrandLink } from "../BrandLink";

type Props = {
    className?: string;
};

const IconInstagram = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm4.5 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm6.25-2.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
    </svg>
);

const IconFacebook = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.9.3-1.6 1.7-1.6h1.5V4.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4V11H7.3v3H10v8h3.5Z" />
    </svg>
);

const IconTwitter = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.1L6.7 22H3.6l7.4-8.5L1 2h6.4l4.3 5.5L18.9 2Zm-1.1 18h1.7L6.1 3.9H4.3L17.8 20Z" />
    </svg>
);

const IconLinkedIn = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M6.9 6.7a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4ZM5 21.5V8.6h3.8v12.9H5Zm6.5-12.9h3.6v1.8h.1c.5-1 1.8-2.1 3.8-2.1 4 0 4.7 2.6 4.7 6v7.2h-3.8v-6.4c0-1.5 0-3.5-2.1-3.5s-2.5 1.7-2.5 3.4v6.5h-3.8V8.6Z" />
    </svg>
);

const SocialIcon = ({ label }: { label: string }) => {
    const cls = "h-5 w-5";
    if (label.toLowerCase() === "instagram") return <IconInstagram className={cls} />;
    if (label.toLowerCase() === "facebook") return <IconFacebook className={cls} />;
    if (label.toLowerCase() === "twitter") return <IconTwitter className={cls} />;
    return <IconLinkedIn className={cls} />;
};

export const Footer = ({ className }: Props) => {
    const c = footerConfig;

    return (
        <footer className={["bg-[var(--primary-bg)] text-[var(--primary-font)]", className].filter(Boolean).join(" ")}>
            <div className="content-pad mx-auto px-4 py-14 md:py-20">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <Link href={c.brand.href}>
                                <NavbarLogo></NavbarLogo>
                            </Link>
                        </div>

                        <ul className="flex items-center gap-5 text-[var(--secondary-font)]">
                            {c.social.map((s) => (
                                <li key={s.label}>
                                    <a
                                        href={s.href}
                                        aria-label={s.label}
                                        className="inline-flex items-center justify-center rounded-md p-1.5 hover:text-[var(--secondary-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary-accent)]"
                                    >
                                        <SocialIcon label={s.label} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
                        {c.sections.map((section) => (
                            <div key={section.title}>
                                <h3 className="mb-4 font-display text-sm font-semibold tracking-wide text-[var(--primary-font)]">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3 text-sm text-[var(--secondary-font)]">
                                    {section.links.map((link, idx) => (
                                        <BrandLink key={"bl-1" + idx + "before"} newPage href={link.href}>
                                            {link.name}
                                        </BrandLink>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 border-t border-white/10 pt-8">
                    <div className="flex flex-col gap-4 text-xs font-medium text-[var(--secondary-font)] md:flex-row md:items-center md:justify-between">
                        <p>{c.copyright}</p>
                        <ul className="flex flex-col gap-2 md:flex-row md:gap-6">
                            {c.legal.map((link, idx) => (
                                <BrandLink key={"bl-2" + idx + "after"}  newPage href={link.href}>{link.name}</BrandLink>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;