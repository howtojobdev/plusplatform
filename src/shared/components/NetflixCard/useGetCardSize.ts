import { useMemo } from "react";
import { useViewport } from "@/shared/hooks/useViewport";
import { NETFLIX_COMPACT_CARD_WIDTH, NETFLIX_COMPACT_CARD_HEIGHT } from "./config";

const MOBILE_SCALE = 0.7;

export const useGetCardSize = () => {
    const { isMobile } = useViewport();

    const { width, height, gap } = useMemo(() => {
        const scale = isMobile ? MOBILE_SCALE : 1;
        const baseGap = isMobile ? 4 : 8;

        return {
            width: Math.round(NETFLIX_COMPACT_CARD_WIDTH * scale),
            height: Math.round(NETFLIX_COMPACT_CARD_HEIGHT * scale),
            gap: Math.max(2, Math.round(baseGap * scale)),
        };
    }, [isMobile]);

    return { width, height, gap };
};