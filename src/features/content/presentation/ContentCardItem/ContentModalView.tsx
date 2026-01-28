"use client";

import React, { useMemo } from "react";
import { cn } from "@/shared/utils/cn";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { ContentType } from "../../domain/contentType";
import { BookOpen, Play, X } from "lucide-react";
import {
    formatBrandDate,
    formatTimeFromMinString,
    getValidDateFromString,
    parseDuration,
} from "@/shared/utils/helperFunctions";
import BrandButton from "@/shared/components/BrandButton";
import { CONTENT_TYPES_ENUM } from "@/shared/enums";
import { useRouter } from "next/navigation";
import { BookmarkButton } from "@/features/user/presentation/BookmarkButton";

type Props = {
    onClose: () => void;
    contentItem: ContentType;
    isCompleted: boolean;
    lastVisited: string;
    compact: boolean;
};

export const CardModalView = ({ onClose, contentItem, isCompleted, lastVisited, compact }: Props) => {
    const router = useRouter();

    const releaseYear = useMemo(() => getValidDateFromString(contentItem.createdAt).getFullYear(), [contentItem.createdAt]);

    const onView = (type: string, id: string) => {
        router.push(`/content?type=${type}&watch=${id}`);
    };

    return (
        <div
            className={cn(
                "relative overflow-hidden shadow-2xl",
                "bg-[var(--secondary-bg)]",
                UI_ELEMENT_ROUNDNESS
            )}
            style={{ width: "min(920px, 92vw)", height: "min(560px, 82vh)" }}
        >
            <div className="relative h-[55%]">
                <img
                    src={contentItem.titleImage}
                    alt={contentItem.title}
                    className="w-full h-full object-cover object-center"
                    draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute top-3 right-3 z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-10 w-10 rounded-full bg-white/20 text-white flex items-center justify-center"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="absolute bottom-4 left-5 right-5 z-10 text-white">
                    <div className="text-2xl font-bold font-display">{contentItem.title}</div>
                    <div className="mt-3 flex items-center gap-2">
                        <BrandButton
                            onClick={() => onView(contentItem.type, contentItem.id)}
                            type="button"
                            iconLeft={
                                contentItem.type === CONTENT_TYPES_ENUM.DATASET ? <BookOpen /> : <Play />
                            }
                        >
                            {contentItem.type === CONTENT_TYPES_ENUM.DATASET ? "Read" : "Play"}
                        </BrandButton>
                        <BookmarkButton bookmarkId={contentItem.id} />
                    </div>
                </div>
            </div>

            <div className="p-5 text-white overflow-auto h-[45%] scrollbar">
                <div className="flex items-center gap-1 text-sm text-white/80">
                    <span className="text-green-400 font-semibold capitalize">{contentItem.type}</span>•
                    <span>{releaseYear}</span>•<span>{formatTimeFromMinString(parseDuration(contentItem.estimatedDuration))}</span>
                    <span className="px-2 py-0.5 rounded bg-white/15 ml-auto">HD</span>
                </div>

                <p className="mt-3 text-sm text-white/85 leading-relaxed">{contentItem.synopsis}</p>

                <div className="mt-4 text-sm">
                    <div className="text-white/70">Tags:</div>
                    <div className="text-white/90 capitalize">
                        {contentItem.genre.length ? contentItem.genre.join(" • ") : `${contentItem.type} • ${releaseYear}`}
                    </div>

                    <div className="mt-3 text-white/70">Last Visited:</div>
                    <div className="text-white/90">
                        <span>{formatBrandDate(getValidDateFromString(lastVisited))}</span>
                        <span className="mx-1">•</span>
                        <span className="text-green-400 font-semibold capitalize">
                            {!compact && isCompleted ? "Completed" : null}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};