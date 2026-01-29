"use client";

import React, { useMemo, useState } from "react";
import { Play } from "lucide-react";
import BrandButton from "@/shared/components/BrandButton";
import { cn } from "@/shared/utils/cn";
import { ClassType } from "@/features/class/domain/classType";
import { NetflixCard, NetflixCardGetters } from "@/shared/components/NetflixCard/NetflixCard";
import { formatTimeFromMinString, parseDuration } from "@/shared/utils/helperFunctions";
import { useRouter } from "next/navigation";
import { NETFLIX_COMPACT_CARD_HEIGHT, NETFLIX_COMPACT_CARD_WIDTH } from "@/shared/components/NetflixCard/config";
import { useGetCardSize } from "@/shared/components/NetflixCard/useGetCardSize";

type Props = {
    classItem: ClassType;
    compact?: boolean;
    instanceId?: string;
};

const getters: NetflixCardGetters<ClassType> = {
    getId: (x) => x.id,
    getTitle: (x) => x.title,
    getTitleImage: (x) => x.titleImage,
    getPreviewImage: (x) => x.previewImage,
};

export const ClassCardItem = ({ classItem, compact = false, instanceId }: Props) => {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);

    const { width, height } = useGetCardSize();

    const topItems = useMemo(() => {
        return (classItem.content ?? [])
            .slice()
            .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
            .slice(0, 4);
    }, [classItem.content]);

    const totalItems = classItem.content?.length ?? 0;

    const totalDuration = useMemo(() => {
        return (classItem.content ?? []).reduce((acc, c: any) => {
            try {
                return acc + (parseDuration(c.estimatedDuration) || 0);
            } catch {
                return acc;
            }
        }, 0);
    }, [classItem.content]);

    const onView = (id: string) => router.push(`/class?watch=${id}`);

    return (
        <NetflixCard
            item={classItem}
            getters={getters}
            instanceId={instanceId}
            compact={compact}
            enableHoverPreview
            prefetch
            cardWidthPx={NETFLIX_COMPACT_CARD_WIDTH}
            cardHeightPx={NETFLIX_COMPACT_CARD_HEIGHT}
            onOpen={() => setModalOpen(true)}
            renderHoverBottomOverlay={() => (
                <div
                    className="flex items-center gap-2"
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
                    <div className="ml-auto text-xs text-white/80 px-2 py-1 rounded bg-white/15">
                        {totalItems} items
                    </div>
                </div>
            )}
            renderHoverDetails={() => (
                <>
                    <div className="text-sm font-semibold text-white line-clamp-1">{classItem.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-white/80">
                        <span className="text-green-400 font-semibold capitalize">{classItem.status}</span>
                        <span>•</span>
                        <span className="px-1.5 py-0.5 rounded bg-white/15 ml-auto">HD</span>
                    </div>
                    <div className="mt-3">
                        <div className="text-xs text-white/70 mb-2">Up next</div>
                        <div className="grid gap-2">
                            {topItems.map((c: any) => (
                                <div
                                    key={c.id}
                                    className={cn("flex items-center gap-2 p-2", "rounded-lg bg-white/5 border border-white/10")}
                                >
                                    <img
                                        src={c.previewImage}
                                        alt={c.title}
                                        className="h-8 w-12 object-cover rounded-md"
                                        draggable={false}
                                        loading="eager"
                                        decoding="async"
                                    />
                                    <div className="min-w-0">
                                        <div className="text-xs font-semibold text-white line-clamp-1">{c.title}</div>
                                        <div className="text-[11px] text-white/70 line-clamp-1">
                                            {c.type} • {formatTimeFromMinString(parseDuration(c.estimatedDuration))}
                                        </div>
                                    </div>
                                    <div className="ml-auto text-[11px] text-white/60">#{(c.index ?? 0) + 1}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
            modalOpen={modalOpen}
            onModalClose={() => setModalOpen(false)}
            renderModal={({ close }) => (
                <div className="relative w-full h-full">
                    <div className="relative h-[55%]">
                        <img
                            src={classItem.titleImage}
                            alt={classItem.title}
                            className="w-full h-full object-cover object-center"
                            draggable={false}
                            loading="eager"
                            decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                        <div className="absolute bottom-4 left-5 right-5 z-10 text-white">
                            <div className="text-2xl font-bold font-display">{classItem.title}</div>
                            <div className="mt-3 flex items-center gap-2">
                                <BrandButton onClick={() => onView(classItem.id)} type="button" iconLeft={<Play />}>
                                    View Class
                                </BrandButton>
                            </div>
                        </div>
                        <button type="button" className="absolute inset-0" aria-label="Close" onClick={close} />
                    </div>

                    <div className="p-5 text-white overflow-auto h-[45%] scrollbar">
                        <div className="flex items-center gap-2 text-sm text-white/80">
                            <span className="text-green-400 font-semibold capitalize">{classItem.status}</span>
                            <span>•</span>
                            <span>{totalItems} items</span>
                            <span>•</span>
                            <span>{totalDuration ? formatTimeFromMinString(totalDuration) : "—"}</span>
                            <span className="px-2 py-0.5 rounded bg-white/15 ml-auto">HD</span>
                        </div>

                        <p className="mt-3 text-sm text-white/85 leading-relaxed">{classItem.synopsis}</p>

                        <div className="mt-5">
                            <div className="text-sm text-white/70 mb-2">Inside this class:</div>

                            <div className="grid gap-2">
                                {(classItem.content ?? [])
                                    .slice()
                                    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
                                    .map((c: any) => (
                                        <div
                                            key={c.id}
                                            className={cn("flex items-center gap-3 p-2", "rounded-lg bg-white/5 border border-white/10")}
                                        >
                                            <img
                                                src={c.previewImage}
                                                alt={c.title}
                                                className="h-10 w-16 object-cover rounded-md"
                                                draggable={false}
                                                loading="eager"
                                                decoding="async"
                                            />
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold text-white line-clamp-1">{c.title}</div>
                                                <div className="text-xs text-white/70 line-clamp-1">
                                                    {c.type} • {formatTimeFromMinString(parseDuration(c.estimatedDuration))}
                                                </div>
                                            </div>
                                            <div className="ml-auto text-xs text-white/70">#{(c.index ?? 0) + 1}</div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        />
    );
};