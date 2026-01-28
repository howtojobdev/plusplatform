import { VideoContentBlockType } from "@/features/content/domain/contentBlockType";
import { BookmarkButton } from "@/features/user/presentation/BookmarkButton";
import BrandButton from "@/shared/components/BrandButton";
import Separator from "@/shared/components/Saperator";
import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { useViewport } from "@/shared/hooks/useViewport";
import { cn } from "@/shared/utils/cn";
import { clampTextByWords } from "@/shared/utils/helperFunctions";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ReactPlayer from "react-player";

type Props = {
    block: VideoContentBlockType;
}

export const VideoBlock = ({ block }: Props) => {
    const [readMore, setReadMore] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();

    const { isMobile } = useViewport();

    const watch = searchParams.get("watch");

    const goBack = () => {
        router.back();
    };

    return (
        <section className="">
            <div className="flex w-full justify-center bg-[var(--secondary-bg)]">
                <div
                    className="relative w-full max-w-[1200px] aspect-video overflow-hidden"
                    style={{
                        maxHeight: "min(85dvh, 720px)",
                    }}
                >
                    <ReactPlayer
                        src={block.video}
                        width="100%"
                        height="100%"
                        controls
                        playing={false}
                        className="absolute inset-0"
                    />
                </div>
            </div>
            <Separator></Separator>
            <div className="content-pad flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h1 className="font-display text-xl">{block.title}</h1>
                    <div className="flex items-center gap-2 ml-auto">
                        {
                            watch
                                ? <BookmarkButton bookmarkId={watch} compact></BookmarkButton>
                                : null
                        }
                        <BrandButton onClick={goBack} variant="outline">
                            <ArrowLeft size={12}></ArrowLeft>
                        </BrandButton>
                    </div>
                </div>
                <p className={cn(
                    "text-[var(--secondary-font)] text-sm md:text-base",
                    UI_ELEMENT_ROUNDNESS
                )}>
                    {
                        readMore
                            ? block.description
                            : clampTextByWords(block.description ?? "", isMobile ? 100 : 300)
                    }
                    {" "}
                    <button className="inline " onClick={() => setReadMore(prev => !prev)}>
                        {
                            readMore
                                ? "Read Less"
                                : "Read More"
                        }
                    </button>
                </p>
            </div>
        </section>
    );
};