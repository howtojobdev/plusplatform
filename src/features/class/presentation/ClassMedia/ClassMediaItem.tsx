"use client";

import { cn } from "@/shared/utils/cn";
import { ClassContentItemType } from "../../domain/classType";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { useState } from "react";

type Props = {
    classContentItem: ClassContentItemType;
}

export const ClassMediaItem = ({ classContentItem }: Props) => {

    const [hovered, setHovered] = useState(false);
    const [open, setOpen] = useState(false);

    return (
        <div className={cn(
            "min-w-0 overflow-hidden rounded-lg relative",
            "bg-[var(--secondary-bg)]", UI_ELEMENT_ROUNDNESS
        )}>
            <img
                src={classContentItem.previewImage}
                alt={classContentItem.title}
                className={cn("w-full relative z-10 h-full object-cover", UI_ELEMENT_ROUNDNESS)}
            />
        </div>
    );
};