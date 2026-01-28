import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { NAV_LINKS } from "@/shared/constants/navLinks";
import { cn } from "@/shared/utils/cn";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BrandLink } from "@/shared/components/BrandLink";

gsap.registerPlugin(useGSAP);

type Props = {
    isVis: boolean;
}

export const MobileMenu = ({ isVis }: Props) => {
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isVis) setShouldRender(true);
    }, [isVis]);

    useGSAP((context) => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            paused: true,
            defaults: { ease: "power2.out" },
            onReverseComplete: () => {
                setShouldRender(false);
            }
        });
        const overlay = context.selector!(".mobile-menu__overlay");
        const links = context.selector!(".mobile-menu__link");

        tl.from(overlay, {
            scaleX: 0,
            scaleY: 0,
            transformOrigin: "top right",
            borderBottomLeftRadius: "999px"
        });

        tl.from(links, {
            y: 24,
            duration: 0.25,
            stagger: 0.06,
            ease: "power2.out",
            autoAlpha: 0
        }, "+=0.5");

        tlRef.current = tl;
    }, { scope: containerRef, dependencies: [shouldRender] });

    useEffect(() => {
        if (!tlRef.current) return;

        if (isVis) {
            tlRef.current.timeScale(1).play();
        } else tlRef.current.timeScale(2.5).reverse();
    }, [isVis, shouldRender]);

    if (!shouldRender) return null;

    return (
        <div
            ref={containerRef}
            className={cn(
                "absolute w-[100dvw] h-[100dvh] top-0 right-0 overflow-hidden",
                UI_ELEMENT_ROUNDNESS
            )}
        >
            <div
                className={cn(
                    "mobile-menu__overlay w-[120dvw] h-[120dvh]",
                    "bg-[var(--secondary-bg)] absolute right-0 top-0",
                    "rounded-tl-none rounded-bl-full rounded-br-none rounded-tr-none",
                )}
            />

            <nav className="relative z-10 flex flex-col gap-4 items-start px-8 pt-28">
                {
                    NAV_LINKS.map(linkDat => (
                        <BrandLink
                            className="mobile-menu__link text-4xl"
                            href={linkDat.href}
                        >{linkDat.name}</BrandLink>
                    ))
                }
            </nav>
        </div>
    );
};