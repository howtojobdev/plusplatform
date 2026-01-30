"use client";

import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { HOVER_DELAY } from "./config";
import BrandButton from "../BrandButton";
import { Info, Play } from "lucide-react";
import { ClassContentItemType, ClassType } from "@/features/class/domain/classType";
import { BookmarkButton } from "@/features/user/presentation/BookmarkButton";
import { useRouter } from "next/navigation";
import { useCardModalState } from "./useCardModal.state";
import { CLASSCONTENT_STATUS_ENUM, CONTENT_TYPES_ENUM } from "@/shared/enums";
import { ContentType } from "@/features/content/domain/contentType";
import { useSession } from "next-auth/react";

type HoverCardProps = {
    id: string;
    imageSrc: string;
    title: string;
    compact?: boolean;
    type?: string;
    contentType?: string;
    synopsis: string;
    updatedAt: string;
    status: string;
    estimatedDuration: string;
    classItems?: ClassContentItemType[];
    disableHover?: boolean;
    isDragging?: boolean;
};

type AnchorRect = {
    top: number;
    left: number;
    width: number;
    height: number;
};

export const HoverCard = ({
    id,
    imageSrc,
    title,
    compact = true,
    type,
    contentType,
    synopsis,
    estimatedDuration,
    status,
    updatedAt,
    classItems = [],
    disableHover,
    isDragging = false,
}: HoverCardProps) => {
    const anchorRef = React.useRef<HTMLDivElement | null>(null);
    const hoverBoxRef = React.useRef<HTMLDivElement | null>(null);

    const openTimerRef = React.useRef<number | null>(null);
    const closeTimerRef = React.useRef<number | null>(null);

    const [mounted, setMounted] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [rect, setRect] = React.useState<AnchorRect | null>(null);

    const router = useRouter();
    const openModal = useCardModalState((s) => s.open);

    const { data: session } = useSession();
    const isBookmarkAllowed = Boolean((session?.isAuthenticated ?? false) && (session?.wallet?.permissions?.length ?? false));

    const updateRect = React.useCallback(() => {
        const el = anchorRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    }, []);

    const clearTimers = React.useCallback(() => {
        if (openTimerRef.current) {
            window.clearTimeout(openTimerRef.current);
            openTimerRef.current = null;
        }
        if (closeTimerRef.current) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }, []);

    const openDelayed = React.useCallback(() => {
        if (disableHover || isDragging) return;
        clearTimers();
        openTimerRef.current = window.setTimeout(() => {
            updateRect();
            setOpen(true);
        }, HOVER_DELAY);
    }, [disableHover, isDragging, updateRect, clearTimers]);

    const openImmediate = React.useCallback(() => {
        if (disableHover || isDragging) return;
        clearTimers();
        updateRect();
        setOpen(true);
    }, [disableHover, isDragging, updateRect, clearTimers]);

    const closeWithDelay = React.useCallback(() => {
        if (disableHover) return;
        clearTimers();
        closeTimerRef.current = window.setTimeout(() => {
            setOpen(false);
        }, Math.max(80, Math.floor(HOVER_DELAY / 2)));
    }, [disableHover, clearTimers]);

    React.useEffect(() => {
        if (isDragging) {
            clearTimers();
            setOpen(false);
        }
    }, [isDragging, clearTimers]);

    React.useEffect(() => {
        setMounted(true);
        return () => clearTimers();
    }, [clearTimers]);

    React.useEffect(() => {
        if (!open) return;

        const onUpdate = () => updateRect();
        window.addEventListener("scroll", onUpdate, true);
        window.addEventListener("resize", onUpdate);

        return () => {
            window.removeEventListener("scroll", onUpdate, true);
            window.removeEventListener("resize", onUpdate);
        };
    }, [open, updateRect]);

    const hoverScale = compact ? 1.18 : 1.08;
    const hoverY = compact ? -10 : -6;

    const play = () => {
        if (type === "class") {
            router.push(`/class?watch=${id}`);
        } else {
            router.push(`/content?type=${contentType}&watch=${id}`);
        }
    };

    const openModalFromRect = React.useCallback(
        (r: DOMRect) => {
            const classData: ClassType = {
                id: id,
                title: title,
                synopsis: synopsis,
                content: classItems,
                permissions: [],
                titleImage: imageSrc,
                previewImage: "",
                status: status,
                createdAt: "",
                updatedAt: updatedAt
            };

            const contentData: ContentType = {
                id: id,
                type: contentType as CONTENT_TYPES_ENUM,
                title: title,
                synopsis: synopsis,
                blocks: [],
                permissions: [],
                genre: [],
                titleImage: imageSrc,
                previewImage: "",
                tags: [],
                estimatedDuration: estimatedDuration,
                status: status as CLASSCONTENT_STATUS_ENUM,
                createdAt: "",
                updatedAt: updatedAt
            };

            openModal({
                origin: { top: r.top, left: r.left, width: r.width, height: r.height },
                item:
                    type === "class"
                        ? ({ type: "class", classData } as any)
                        : ({ type: "content", contentData } as any),
                originId: id,
            });
        },
        [openModal, type, id, title, imageSrc, contentType, classItems]
    );

    const openModalFromAnchor = React.useCallback(
        (e?: React.MouseEvent) => {
            if (e) {
                const target = e.target as HTMLElement | null;
                if (target?.closest("button,[role='button'],a,[data-no-card-click='true']")) return;
                e.preventDefault();
                e.stopPropagation();
            }

            if (isDragging) return;
            const el = anchorRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            openModalFromRect(r);
            setOpen(false);
        },
        [isDragging, openModalFromRect]
    );

    const openModalFromHover = React.useCallback(
        (e?: React.MouseEvent) => {
            if (e) {
                const target = e.target as HTMLElement | null;
                if (target?.closest("button,[role='button'],a,[data-no-card-click='true']")) return;
                e.preventDefault();
                e.stopPropagation();
            }

            if (isDragging) return;
            const el = hoverBoxRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            openModalFromRect(r);
            setOpen(false);
        },
        [isDragging, openModalFromRect]
    );

    return (
        <>
            <div
                ref={anchorRef}
                className={cn("relative h-full w-full cursor-pointer", UI_ELEMENT_ROUNDNESS)}
                onMouseEnter={openDelayed}
                onMouseLeave={closeWithDelay}
                style={{
                    opacity: open ? 0 : 1,
                    pointerEvents: open ? "none" : "auto",
                }}
                onClick={openModalFromAnchor}
            >
                <div className={cn("relative h-full w-full overflow-hidden bg-black", UI_ELEMENT_ROUNDNESS)}>
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        priority
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        className="object-cover"
                        sizes={compact ? "(max-width: 768px) 60vw, 240px" : "100vw"}
                    />
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))" }}
                    />
                </div>
            </div>

            {mounted && rect && !disableHover
                ? createPortal(
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                className="fixed left-0 top-0"
                                style={{
                                    width: rect.width + 50,
                                    transform: `translate3d(${rect.left}px, ${rect.top}px, 0)`,
                                    zIndex: 999999,
                                }}
                                initial={false}
                                onMouseEnter={openImmediate}
                                onMouseLeave={closeWithDelay}
                                onClick={openModalFromHover}
                            >
                                <motion.div
                                    ref={hoverBoxRef}
                                    className={cn("relative isolate overflow-visible", UI_ELEMENT_ROUNDNESS)}
                                    initial={{ scale: 1, y: 0 }}
                                    animate={{ scale: hoverScale, y: hoverY }}
                                    exit={{ scale: 1, y: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.7 }}
                                >
                                    <div className={cn("relative w-full overflow-hidden bg-black", UI_ELEMENT_ROUNDNESS, "rounded-b-none")}>
                                        <div className="relative w-full cursor-pointer" style={{ height: rect.height }}>
                                            <Image
                                                src={imageSrc}
                                                alt={title}
                                                fill
                                                priority
                                                draggable={false}
                                                onDragStart={(e) => e.preventDefault()}
                                                className="object-cover"
                                                sizes={compact ? "(max-width: 768px) 60vw, 240px" : "100vw"}
                                            />

                                            <div className="absolute bottom-0 w-full p-2 flex items-center gap-1">
                                                <BrandButton
                                                    size="sm"
                                                    data-no-card-click="true"
                                                    className="relative z-[2]"
                                                    onClick={(e) => {
                                                        e?.preventDefault();
                                                        e?.stopPropagation();
                                                        play();
                                                    }}
                                                >
                                                    <Play size={12} />
                                                </BrandButton>

                                                {
                                                    isBookmarkAllowed
                                                        ? (
                                                            <span
                                                                className="relative z-[2]"
                                                                data-no-card-click="true"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                }}
                                                            >
                                                                <BookmarkButton compact bookmarkId={id} />
                                                            </span>
                                                        ) : null
                                                }

                                                <BrandButton
                                                    variant="ghost"
                                                    className="ml-auto relative z-[2]"
                                                    size="sm"
                                                    data-no-card-click="true"
                                                    onClick={(e) => {
                                                        e?.preventDefault();
                                                        e?.stopPropagation();
                                                        openModalFromHover();
                                                    }}
                                                >
                                                    <Info size={12} />
                                                </BrandButton>
                                            </div>

                                            <div
                                                className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                                                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))" }}
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className={cn(
                                            "w-full bg-[var(--secondary-bg)] shadow-2xl px-3 py-3",
                                            UI_ELEMENT_ROUNDNESS,
                                            "rounded-t-none -mt-[1px]",
                                            "flex flex-col gap-1"
                                        )}
                                    >
                                        <h1 className="text-sm font-display text-white line-clamp-2">{title}</h1>

                                        <div className="flex flex-wrap gap-1 text-[10px] text-white/55">
                                            {type && <span className="text-green-300 capitalize">{type}</span>}
                                            {contentType && <span className="capitalize">• {contentType}</span>}
                                            {classItems && classItems.length ? (
                                                <span className="capitalize">• {classItems.length} Items</span>
                                            ) : (
                                                <span className="capitalize text-red-300">• Upcoming</span>
                                            )}
                                            <span className="ml-auto text-xs bg-[var(--primary-bg)] px-1">HD</span>
                                        </div>

                                        {classItems?.length ? (
                                            <div className="flex flex-col gap-2 mt-2" data-no-card-click="true">
                                                <h1 className="text-[10px] text-[var(--secondary-font)] line-clamp-2">Up Next</h1>

                                                <div className="grid grid-cols-4 gap-2">
                                                    {classItems.slice(0, 12).map((item, index) => {
                                                        const row = Math.floor(index / 4);
                                                        const rowOpacity = row === 0 ? 0.0 : row === 1 ? 0.5 : 0.85;

                                                        return (
                                                            <div
                                                                key={(item as any).id ?? `${item.title}-${index}`}
                                                                className={cn(
                                                                    "w-full aspect-[16/9] overflow-hidden",
                                                                    UI_ELEMENT_ROUNDNESS,
                                                                    "border border-white/5"
                                                                )}
                                                                style={{
                                                                    background: `linear-gradient(to bottom, var(--primary-bg), color-mix(in oklab, var(--secondary-bg) ${rowOpacity * 100
                                                                        }%, var(--primary-bg)))`,
                                                                }}
                                                            >
                                                                <img
                                                                    className="w-full h-full object-cover"
                                                                    src={item.previewImage}
                                                                    alt={item.title}
                                                                    draggable={false}
                                                                    onDragStart={(e) => e.preventDefault()}
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div
                                                    className={cn("pointer-events-none -mt-8 h-12 w-full")}
                                                    style={{
                                                        background: "linear-gradient(to bottom, rgba(0,0,0,0), var(--secondary-bg))",
                                                    }}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )
                : null}
        </>
    );
};