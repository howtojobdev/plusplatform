"use client";

import { useToggleBookmark } from "@/features/user/application/hooks/useToggleBookmark";
import BrandButton from "@/shared/components/BrandButton";
import { Bookmark } from "lucide-react";

type Props = {
    bookmarkId: string;
    compact?: boolean;
}

export const BookmarkButton = ({ bookmarkId, compact = false }: Props) => {

    const {
        handleBookmark,
        isBookmarked
    } = useToggleBookmark(bookmarkId);

    if (compact) return (
        <BrandButton
            variant="outline"
            onClick={handleBookmark}
        >
            <Bookmark
                size={12}
                fill={
                    isBookmarked
                        ? "currentColor"
                        : "none"
                }
            ></Bookmark>
        </BrandButton>
    )

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