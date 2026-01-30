"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import BrandButton from "@/shared/components/BrandButton";
import { cn } from "@/shared/utils/cn";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

export const Hero = () => {
    const VIDEO_URL = "https://vimeo.com/904181231";

    const [playing, setPlaying] = useState(true);
    const [muted, setMuted] = useState(true);

    const volume = useMemo(() => (muted ? 0 : 1), [muted]);

    const playerRef = useRef<any>(null);

    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        const update = () => setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const lockRef = useRef(false);
    const lock = () => {
        if (lockRef.current) return false;
        lockRef.current = true;
        setTimeout(() => {
            lockRef.current = false;
        }, 220);
        return true;
    };

    const ensurePlaying = () => {
        if (!playing) return;

        requestAnimationFrame(() => {
            const internal = playerRef.current?.getInternalPlayer?.();
            internal?.play?.();
            requestAnimationFrame(() => {
                const internal2 = playerRef.current?.getInternalPlayer?.();
                internal2?.play?.();
            });
        });
    };

    useEffect(() => {
        ensurePlaying();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [muted]);

    const togglePlaying = () => {
        if (!lock()) return;
        setPlaying((p) => !p);
    };

    const toggleMuted = () => {
        if (!lock()) return;
        setMuted((m) => !m);
        ensurePlaying();
    };

    return (
        <div className="w-[100dvw] relative overflow-hidden">
            {!isDesktop ? (
                <>
                    <div className="w-full mt-20 px-4">
                        <div className="relative w-full overflow-hidden rounded-2xl bg-black aspect-video">
                            <ReactPlayer
                                ref={playerRef}
                                src={VIDEO_URL}
                                width="100%"
                                height="100%"
                                playing={playing}
                                muted={muted}
                                volume={volume}
                                loop
                                controls={false}
                                playsInline
                                className="absolute inset-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2">
                            <BrandButton variant="ghost" onClick={togglePlaying}>
                                {playing ? <Pause /> : <Play />}
                            </BrandButton>

                            <BrandButton variant="ghost" onClick={toggleMuted}>
                                {muted ? <VolumeX /> : <Volume2 />}
                            </BrandButton>
                        </div>
                    </div>

                    <div className="px-4 mt-4">
                        <h1 className="font-display text-3xl">Howtojob</h1>

                        <p className="mt-3 text-[var(--secondary-font)] max-w-[340px]">
                            A job-search system for today’s market. Built on real hiring behaviour, not outdated advice. Structured actions that turn effort into interviews.
                        </p>

                        <div className="w-full h-[30dvh]" />
                    </div>
                </>
            ) : (
                <div className="h-[100dvh] w-[100dvw] relative">
                    <div className="absolute inset-0 z-0">
                        <ReactPlayer
                            ref={playerRef}
                            src={VIDEO_URL}
                            width="100%"
                            height="100%"
                            playing={playing}
                            muted={muted}
                            volume={volume}
                            loop
                            controls={false}
                            playsInline
                            className="absolute inset-0"
                            style={{ transform: "scale(1.12)" }}
                        />
                    </div>

                    <div
                        className={cn(
                            "absolute inset-0 z-10",
                            "bg-gradient-to-tr from-black/85 to-black/0"
                        )}
                    />

                    <div className="relative z-20 h-full flex flex-col items-start justify-end">
                        <div className="max-w-md p-12 pb-0 flex flex-col gap-4">
                            <h1 className="font-display text-5xl">Howtojob</h1>

                            <p className="text-[var(--secondary-font)]">
                                A job-search system for today’s market. Built on real hiring behaviour, not outdated advice. Structured actions that turn effort into interviews.
                            </p>

                            <div className="items-center gap-2 flex">
                                <BrandButton
                                    onClick={togglePlaying}
                                    variant={playing ? "neutral" : "cta"}
                                    iconLeft={
                                        playing ? (
                                            <Pause fill="currentColor" stroke="none" />
                                        ) : (
                                            <Play fill="currentColor" stroke="none" />
                                        )
                                    }
                                    className={!playing ? "bg-white font-semibold hover:bg-[#bababa]" : ""}
                                >
                                    {playing ? "Pause" : "Play"}
                                </BrandButton>

                                <BrandButton
                                    onClick={toggleMuted}
                                    variant={muted ? "neutral" : "cta"}
                                    iconLeft={muted ? <VolumeX /> : <Volume2 />}
                                    className={!muted ? "bg-zinc-700 font-semibold text-white hover:bg-zinc-800" : ""}
                                >
                                    {muted ? "Muted" : "Sound On"}
                                </BrandButton>
                            </div>
                        </div>

                        <div className="w-full h-[30dvh]" />
                    </div>
                </div>
            )}
        </div>
    );
};