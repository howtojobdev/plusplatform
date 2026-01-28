import { useEffect, useState } from "react";

export const useViewport = () => {
    const [width, setWidth] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const handleResize = () => {
        const innerWidth = window.innerWidth;
        setWidth(innerWidth);
        setIsMobile(innerWidth < 1024);
    };

    useEffect(() => setIsMounted(true), []);

    useEffect(() => {
        if (!isMounted) return;

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [isMounted]);

    return { width, isMobile };
};