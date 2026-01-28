"use client";

import { useToggleBookmark } from "@/features/user/application/hooks/useToggleBookmark";
import BrandButton from "@/shared/components/BrandButton";
import { Bookmark } from "lucide-react";

type Props = {
    classId: string;
}

export const ClassBookmarkCta = ({ classId }: Props) => {

    const {
        handleBookmark,
        isBookmarked
    } = useToggleBookmark(classId);

    return (
        <BrandButton
            variant="outline"
            onClick={handleBookmark}
            iconLeft={
                <Bookmark
                    fill={
                        isBookmarked
                            ? "currentColor"
                            : "none"
                    }
                ></Bookmark>
            }
        >
            {
                isBookmarked
                    ? "Bookmarked"
                    : "Bookmark"
            }
        </BrandButton>
    )
};