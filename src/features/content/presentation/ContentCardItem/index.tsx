"use client";

import React, { useMemo, useState } from "react";
import { BookOpen, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import BrandButton from "@/shared/components/BrandButton";
import { NetflixCard, NetflixCardGetters } from "@/shared/components/NetflixCard/NetflixCard";
import { ContentType } from "@/features/content/domain/contentType";
import {
    formatTimeFromMinString,
    getValidDateFromString,
    parseDuration,
    formatBrandDate,
} from "@/shared/utils/helperFunctions";
import { CONTENT_TYPES_ENUM } from "@/shared/enums";
import { BookmarkButton } from "@/features/user/presentation/BookmarkButton";
import { NETFLIX_COMPACT_CARD_HEIGHT, NETFLIX_COMPACT_CARD_WIDTH } from "@/shared/components/NetflixCard/config";
import { useGetCardSize } from "@/shared/components/NetflixCard/useGetCardSize";

type Props = {
    contentItem: ContentType;
    compact?: boolean;
    isCompleted?: boolean;
    lastVisited?: string;
    instanceId?: string;
};

const getters: NetflixCardGetters<ContentType> = {
    getId: (x) => x.id,
    getTitle: (x) => x.title,
    getTitleImage: (x) => x.titleImage,
    getPreviewImage: (x) => x.previewImage,
};

export const ContentCardItem = ({
    contentItem,
    compact = false,
    isCompleted = false,
    lastVisited = "",
    instanceId,
}: Props) => {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);

    const releaseYear = useMemo(
        () => getValidDateFromString(contentItem.createdAt).getFullYear(),
        [contentItem.createdAt]
    );

    const { width, height } = useGetCardSize();

    const onView = (type: string, id: string) => router.push(`/content?type=${type}&watch=${id}`);

    return (
        <NetflixCard
            item={contentItem}
            getters={getters}
            instanceId={instanceId}
            compact={compact}
            enableHoverPreview
            prefetch
            containerClassName="w-full"
            cardWidthPx={compact ? NETFLIX_COMPACT_CARD_WIDTH : undefined}
            cardHeightPx={compact ? NETFLIX_COMPACT_CARD_HEIGHT : undefined}
            aspectRatio={compact ? undefined : "16 / 9"}
            onOpen={() => setModalOpen(true)}
            renderHoverBottomOverlay={() => (
                <div
                    className="flex items-center justify-start gap-2"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <BrandButton
                        onClick={() => {
                            setModalOpen(true);
                        }}
                        type="button"
                    >
                        <Play size={12} />
                    </BrandButton>
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <BookmarkButton bookmarkId={contentItem.id} compact />
                    </div>
                </div>
            )}
            renderHoverDetails={() => (
                <>
                    <div className="text-sm font-semibold text-white line-clamp-1">{contentItem.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-white/80">
                        <span className="text-green-400 font-semibold capitalize">{contentItem.type}</span>
                        <span>•</span>
                        <span>{formatTimeFromMinString(parseDuration(contentItem.estimatedDuration))}</span>
                        <span className="px-1.5 py-0.5 rounded bg-white/15 ml-auto">HD</span>
                    </div>
                    <div className="mt-2 text-xs text-white/75 line-clamp-2">
                        {(contentItem.genre ?? []).join(" • ")}
                    </div>
                </>
            )}
            modalOpen={modalOpen}
            onModalClose={() => setModalOpen(false)}
            renderModal={({ close }) => (
                <div className="relative w-full h-full">
                    <div className="relative h-[55%]">
                        <img
                            src={contentItem.titleImage}
                            alt={contentItem.title}
                            className="w-full h-full object-cover object-center"
                            draggable={false}
                            loading="eager"
                            decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                        <div className="absolute bottom-4 left-5 right-5 z-10 text-white">
                            <div className="text-2xl font-bold font-display">{contentItem.title}</div>
                            <div className="mt-3 flex items-center gap-2">
                                <BrandButton
                                    onClick={() => onView(contentItem.type, contentItem.id)}
                                    type="button"
                                    iconLeft={contentItem.type === CONTENT_TYPES_ENUM.DATASET ? <BookOpen /> : <Play />}
                                >
                                    {contentItem.type === CONTENT_TYPES_ENUM.DATASET ? "Read" : "Play"}
                                </BrandButton>
                                <BookmarkButton bookmarkId={contentItem.id} />
                            </div>
                        </div>

                        <button type="button" className="absolute inset-0" aria-label="Close" onClick={close} />
                    </div>

                    <div className="p-5 text-white overflow-auto h-[45%] scrollbar">
                        <div className="flex items-center gap-1 text-sm text-white/80">
                            <span className="text-green-400 font-semibold capitalize">{contentItem.type}</span>
                            <span>•</span>
                            <span>{releaseYear}</span>
                            <span>•</span>
                            <span>{formatTimeFromMinString(parseDuration(contentItem.estimatedDuration))}</span>
                            <span className="px-2 py-0.5 rounded bg-white/15 ml-auto">HD</span>
                        </div>

                        <p className="mt-3 text-sm text-white/85 leading-relaxed">{contentItem.synopsis}</p>

                        <div className="mt-4 text-sm">
                            <div className="text-white/70">Tags:</div>
                            <div className="text-white/90 capitalize">
                                {(contentItem.genre ?? []).length
                                    ? (contentItem.genre ?? []).join(" • ")
                                    : `${contentItem.type} • ${releaseYear}`}
                            </div>

                            <div className="mt-3 text-white/70">Last Visited:</div>
                            <div className="text-white/90">
                                <span>{lastVisited ? formatBrandDate(getValidDateFromString(lastVisited)) : "—"}</span>
                                <span className="mx-1">•</span>
                                <span className="text-green-400 font-semibold capitalize">{!compact && isCompleted ? "Completed" : null}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        />
    );
};