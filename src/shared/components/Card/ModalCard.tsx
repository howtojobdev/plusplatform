"use client";

import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { useCardModalState } from "./useCardModal.state";
import Image from "next/image";
import BrandButton from "../BrandButton";
import { Play } from "lucide-react";
import { BookmarkButton } from "@/features/user/presentation/BookmarkButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clampTextByWords } from "@/shared/utils/helperFunctions";
import { useSession } from "next-auth/react";

type Viewport = { w: number; h: number };

const getViewport = (): Viewport => ({
    w: typeof window !== "undefined" ? window.innerWidth : 0,
    h: typeof window !== "undefined" ? window.innerHeight : 0,
});

export const ModalCard = () => {
    const { isOpen, phase, origin, item, startClose, finishClose, getBaseContent } = useCardModalState();

    const [mounted, setMounted] = React.useState(false);
    const [vp, setVp] = React.useState<Viewport>(getViewport());

    const router = useRouter();
    const { data: session } = useSession();

    const isBookmarkAllowed = Boolean((session?.isAuthenticated ?? false) && (session?.wallet?.permissions?.length ?? false));

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (!mounted) return;

        const onResize = () => setVp(getViewport());
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [mounted]);

    React.useEffect(() => {
        if (!mounted) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) startClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [mounted, isOpen, startClose]);

    React.useEffect(() => {
        if (!mounted) return;

        if (isOpen) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = prev;
            };
        }
    }, [mounted, isOpen]);

    const show = mounted && (isOpen || phase === "closing");

    const paddingX = vp.w < 768 ? 16 : 32;
    const paddingY = vp.h < 668 ? 24 : 48;

    const targetW = Math.min(920, Math.max(320, vp.w - paddingX * 2));
    const targetH = Math.min(560, Math.max(320, vp.h - paddingY * 2));

    const targetLeft = Math.round((vp.w - targetW) / 2);
    const targetTop = Math.round((vp.h - targetH) / 2);

    const hasOrigin = !!origin;
    const originRect = origin ?? {
        top: targetTop,
        left: targetLeft,
        width: Math.max(220, Math.round(targetW * 0.55)),
        height: Math.max(140, Math.round(targetH * 0.55)),
    };

    const isClosing = phase === "closing";

    const cardAnimate = isClosing
        ? {
            top: originRect.top,
            left: originRect.left,
            width: originRect.width,
            height: originRect.height,
            opacity: 0,
        }
        : {
            top: targetTop,
            left: targetLeft,
            width: targetW,
            height: targetH,
            opacity: 1,
        };

    const modelData = getBaseContent();

    const play = () => {
        startClose();
        if (modelData.typeLabel === "class") {
            router.push(`/class?watch=${modelData.id}`);
        } else {
            router.push(`/content?type=${modelData.typeLabel}&watch=${modelData.id}`);
        }
    };

    if (!show) return null;

    return createPortal(
        <AnimatePresence>
            {show ? (
                <div className="fixed inset-0 z-[999999]">
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isClosing ? 0 : 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: isClosing ? 0.08 : 0.14, ease: "easeOut" }}
                        onMouseDown={() => startClose()}
                    />

                    <motion.div
                        className={cn(
                            "absolute overflow-x-hidden overflow-y-auto hide-scrollbar border border-white/10",
                            UI_ELEMENT_ROUNDNESS
                        )}
                        style={{
                            background: "var(--secondary-bg)",
                            willChange: "top,left,width,height,opacity,transform",
                        }}
                        initial={{
                            top: originRect.top,
                            left: originRect.left,
                            width: originRect.width,
                            height: originRect.height,
                            opacity: hasOrigin ? 1 : 0,
                        }}
                        animate={cardAnimate}
                        exit={{
                            top: originRect.top,
                            left: originRect.left,
                            width: originRect.width,
                            height: originRect.height,
                            opacity: 0,
                        }}
                        transition={
                            isClosing
                                ? { duration: 0.08, ease: "easeOut" }
                                : { type: "spring", stiffness: 520, damping: 44, mass: 0.7 }
                        }
                        onAnimationComplete={() => {
                            if (phase === "closing") finishClose();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className="relative h-full w-full">
                            <div className="min-h-[60%] w-full relative">
                                <Image
                                    src={modelData.titleImage}
                                    alt={modelData.title}
                                    fill
                                    priority
                                    className="object-cover"
                                ></Image>
                                <div
                                    className="absolute bottom-0 h-[100%] w-full bg-gradient-to-t from-black/90 to black/0"
                                ></div>
                                <div className="flex flex-col absolute bottom-0 w-full p-4 gap-4">
                                    <h1
                                        className="font-display text-2xl"
                                    >{modelData.title}</h1>
                                    <div className="w-full flex gap-2 items-center">
                                        <BrandButton
                                            iconLeft={<Play></Play>}
                                            onClick={play}
                                        >
                                            Play
                                        </BrandButton>
                                        {isBookmarkAllowed ? <BookmarkButton bookmarkId={modelData.id}></BookmarkButton> : null}
                                    </div>
                                </div>
                            </div>
                            <div className="w-full p-4 flex flex-col gap-4 text-[var(--secondary-font)]">
                                <div className="w-full flex items-center gap-1 text-sm">
                                    <span className="text-green-300 capitalize">{modelData.typeLabel}</span>
                                    <span className="">• {modelData.duration}</span>
                                    {
                                        modelData.contentList.length
                                            ? (
                                                <span>• {modelData.classItems}</span>
                                            ) : null
                                    }
                                    <span className={cn(
                                        "px-2 py-1 ml-auto text-xs bg-[var(--primary-bg)]",
                                        UI_ELEMENT_ROUNDNESS
                                    )}>HD</span>
                                </div>
                                <p className="text-sm text-[var(--secondary-font)]">{modelData.synopsis}</p>
                                <div className="w-full flex flex-col gap-1">
                                    <h1 className="text-sm">Tags</h1>
                                    <div className="flex items-center gap-1 text-xs">
                                        <span className="capitalize">{modelData.typeLabel}</span>
                                        {
                                            modelData.published
                                                ? (
                                                    <span>• Published</span>
                                                ) : (
                                                    <span>• Unpublished</span>
                                                )
                                        }
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-1">
                                    <h1 className="text-sm">Release Year</h1>
                                    <div className="flex items-center gap-1 text-xs">
                                        <span className="capitalize">{modelData.releaseYear}</span>
                                    </div>
                                </div>
                                {
                                    modelData.contentList.length
                                        ? (
                                            <div className="flex flex-col gap-2">
                                                <h1 className="text-sm">Up Next</h1>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                    {modelData.contentList.map((content) => (
                                                        <Link
                                                            onClick={() => startClose()}
                                                            key={content.id}
                                                            href={`/content?type=${content.type}&watch=${content.id}`}
                                                            className="block"
                                                        >
                                                            <div
                                                                className={cn(
                                                                    "h-full flex flex-col bg-[var(--primary-bg)] overflow-hidden",
                                                                    UI_ELEMENT_ROUNDNESS
                                                                )}
                                                            >
                                                                <img
                                                                    className="w-full aspect-[16/9] object-cover"
                                                                    src={content.previewImage}
                                                                    alt={content.title}
                                                                />
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null
                                }
                            </div>
                        </div>
                    </motion.div>
                </div>
            ) : null}
        </AnimatePresence>,
        document.body
    );
};