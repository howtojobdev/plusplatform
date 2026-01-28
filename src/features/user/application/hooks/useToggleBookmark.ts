import { useSession } from "next-auth/react";
import { useUserPrefrenceStore } from "../state/userPrefrenceState";

export const useToggleBookmark = (bookmarkId: string) => {

    const { data: session } = useSession();

    const bookmarks = useUserPrefrenceStore(state => state.bookmarks);
    const toggleBookmark = useUserPrefrenceStore(state => state.toggleBookmark);
    const isBookmarked = bookmarks.includes(bookmarkId);

    const handleBookmark = () => {
        if(!session?.user?.id) return;
        toggleBookmark(bookmarkId, session.user.id);
    };

    return {
        handleBookmark,
        isBookmarked
    };
};