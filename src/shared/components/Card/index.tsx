"use client";

import React from "react";
import { useInView } from "framer-motion";
import { CLASSCONTENT_STATUS_ENUM, CONTENT_TYPES_ENUM } from "@/shared/enums";
import { CARD_SIZE } from "./config";
import { HoverCard } from "./HoverCard";
import { useViewport } from "@/shared/hooks/useViewport";
import { ClassContentItemType, ClassType } from "@/features/class/domain/classType";
import { useCardModalState } from "./useCardModal.state";
import { ContentType } from "@/features/content/domain/contentType";

type Props = {
    type: "class" | "content";
    contentType?: `${CONTENT_TYPES_ENUM}`;
    classItems?: ClassContentItemType[];
    id: string;
    previewImage: string;
    titleImage: string;
    title: string;
    synopsis: string;
    status: string;
    updatedAt: string;
    estimatedDuration?: string;
    compact?: boolean;
    isDragging?: boolean;
};

export const Card = ({
    type,
    contentType,
    classItems = [],
    id,
    previewImage,
    titleImage,
    title,
    synopsis,
    status,
    estimatedDuration="",
    updatedAt,
    compact = true,
    isDragging = false,
}: Props) => {
    const { isMobile } = useViewport();
    const openModal = useCardModalState((s) => s.open);

    const ref = React.useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { amount: 0.15, margin: "200px 0px" });

    const handleOpen = React.useCallback(
        (e?: React.MouseEvent) => {
            if (e) {
                const target = e.target as HTMLElement | null;
                if (target?.closest("button,[role='button'],a,[data-no-card-click='true']")) return;
            }

            if (isDragging) return;

            const el = ref.current;
            if (!el) return;

            const r = el.getBoundingClientRect();

            const classData: ClassType = {
                id: id,
                title: title,
                synopsis: synopsis,
                content: classItems,
                permissions: [],
                titleImage: titleImage,
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
                titleImage: titleImage,
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
                        ? ({
                            type: "class",
                            classData,
                        } as any)
                        : ({
                            type: "content",
                            contentData,
                        } as any),
                originId: id,
            });
        },
        [isDragging, openModal, type, id, title, previewImage, titleImage, classItems, contentType]
    );

    return (
        <div
            ref={ref}
            style={
                compact
                    ? {
                        width: CARD_SIZE.width,
                        minWidth: CARD_SIZE.width,
                        maxWidth: CARD_SIZE.width,
                        height: CARD_SIZE.height,
                        minHeight: CARD_SIZE.height,
                        maxHeight: CARD_SIZE.height,
                        flexShrink: 0,
                    }
                    : {
                        width: "100%",
                        height: "auto",
                    }
            }
            className={compact ? "relative overflow-visible" : "relative overflow-visible w-full aspect-[16/9]"}
            onClick={handleOpen}
        >
            {isInView ? (
                <HoverCard
                    id={id}
                    imageSrc={titleImage}
                    title={title}
                    compact={compact}
                    type={type}
                    contentType={contentType}
                    status={status}
                    synopsis={synopsis}
                    estimatedDuration={estimatedDuration}
                    updatedAt={updatedAt}
                    classItems={classItems}
                    disableHover={isMobile}
                    isDragging={isDragging}
                />
            ) : null}
        </div>
    );
};