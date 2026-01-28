"use client";

import { useState } from "react";
import ReactPlayer from "react-player";
import BrandButton from "@/shared/components/BrandButton";
import { cn } from "@/shared/utils/cn";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

export const Hero = () => {
    const VIDEO_URL = "https://vimeo.com/904181231";

    const [playing, setPlaying] = useState(true);
    const [muted, setMuted] = useState(true);

    return (
        <div className="w-[100dvw] relative overflow-hidden">
            {/* MOBILE: in-flow video block with mt-20 (5rem) */}
            <div className="md:hidden w-full mt-20 px-4">
                <div className="relative w-full overflow-hidden rounded-2xl bg-black aspect-video">
                    <ReactPlayer
                        src={VIDEO_URL}
                        width="100%"
                        height="100%"
                        playing={playing}
                        muted={muted}
                        volume={muted ? 0 : 1}
                        loop
                        controls={false}
                        className="absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                    <BrandButton variant="ghost" onClick={() => setPlaying((p) => !p)}>
                        {playing ? <Pause /> : <Play />}
                    </BrandButton>
                    <BrandButton variant="ghost" onClick={() => setMuted((m) => !m)}>
                        {muted ? <VolumeX /> : <Volume2 />}
                    </BrandButton>
                </div>
            </div>

            {/* DESKTOP: background video */}
            <div className="hidden md:block h-[100dvh] w-[100dvw] relative">
                <div className="absolute inset-0 z-0">
                    <ReactPlayer
                        src={VIDEO_URL}
                        width="100%"
                        height="100%"
                        playing={playing}
                        muted={muted}
                        volume={muted ? 0 : 1}
                        loop
                        controls={false}
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
                                onClick={() => setPlaying((p) => !p)}
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
                                onClick={() => setMuted((m) => !m)}
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

            {/* SHARED TEXT for mobile under the video */}
            <div className="md:hidden px-4 mt-4">
                <h1 className="font-display text-3xl">Howtojob</h1>

                <p className="mt-3 text-[var(--secondary-font)] max-w-[340px]">
                    A job-search system for today’s market. Built on real hiring behaviour, not outdated advice. Structured actions that turn effort into interviews.
                </p>

                <div className="w-full h-[30dvh]" />
            </div>
        </div>
    );
};