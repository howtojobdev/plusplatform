"use client";

import React, { useMemo } from "react";
import { cn } from "@/shared/utils/cn";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { ClassType } from "@/features/class/domain/classType";
import { X, Play } from "lucide-react";
import BrandButton from "@/shared/components/BrandButton";
import { useRouter } from "next/navigation";
import { formatTimeFromMinString, parseDuration } from "@/shared/utils/helperFunctions";

type Props = {
    onClose: () => void;
    classItem: ClassType;
};

export const ClassModalView = ({ onClose, classItem }: Props) => {
    const router = useRouter();

    const totalItems = classItem.content?.length ?? 0;

    const totalDuration = useMemo(() => {
        return (classItem.content ?? []).reduce((acc, c) => {
            try {
                return acc + (parseDuration((c as any).estimatedDuration) || 0);
            } catch {
                return acc;
            }
        }, 0);
    }, [classItem.content]);

    const onView = (id: string) => {
        router.push(`/class/${id}`);
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
                    src={classItem.titleImage}
                    alt={classItem.title}
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
                    <div className="text-2xl font-bold font-display">{classItem.title}</div>

                    <div className="mt-3 flex items-center gap-2">
                        <BrandButton onClick={() => onView(classItem.id)} type="button" iconLeft={<Play />}>
                            View Class
                        </BrandButton>
                    </div>
                </div>
            </div>

            <div className="p-5 text-white overflow-auto h-[45%] scrollbar">
                <div className="flex items-center gap-2 text-sm text-white/80">
                    <span className="text-green-400 font-semibold capitalize">{classItem.status}</span>•
                    <span>{totalItems} items</span>•<span>{totalDuration ? formatTimeFromMinString(totalDuration) : "—"}</span>
                    <span className="px-2 py-0.5 rounded bg-white/15 ml-auto">HD</span>
                </div>

                <p className="mt-3 text-sm text-white/85 leading-relaxed">{classItem.synopsis}</p>

                <div className="mt-5">
                    <div className="text-sm text-white/70 mb-2">Inside this class:</div>

                    <div className="grid gap-2">
                        {(classItem.content ?? [])
                            .slice()
                            .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
                            .map((c) => (
                                <div
                                    key={c.id}
                                    className={cn(
                                        "flex items-center gap-3 p-2",
                                        "rounded-lg bg-white/5 border border-white/10"
                                    )}
                                >
                                    <img
                                        src={c.previewImage}
                                        alt={c.title}
                                        className="h-10 w-16 object-cover rounded-md"
                                        draggable={false}
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
    );
};