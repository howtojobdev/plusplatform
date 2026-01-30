import BrandButton from "@/shared/components/BrandButton";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { ProgressChip, ProgressChipStateType } from "@/shared/components/ProgressChip";
import Separator from "@/shared/components/Saperator";
import { clampTextByWords, formatBrandDate } from "@/shared/utils/helperFunctions";
import { Bookmark, Info, Play } from "lucide-react";
import Link from "next/link";
import { ClassBookmarkCta } from "./ClassBookmarkCta";
import { BookmarkButton } from "@/features/user/presentation/BookmarkButton";

type Props = {
    chipProgress: ProgressChipStateType;
    classTitle: string;
    classDesc: string;
    lastVisited: Date;
    continueLink: string;
    progress: number;
    classId: string;
}

export const ClassMeta = ({
    chipProgress,
    classTitle,
    classDesc,
    lastVisited,
    continueLink,
    progress,
    classId
}: Props) => {
    return (
        <div className="flex flex-col">
            <ProgressChip status={chipProgress}></ProgressChip>
            <h1
                className="font-display text-4xl md:text-6xl font-bold"
            >{classTitle}</h1>
            <Separator></Separator>
            <p className="text-sm text-[var(--secondary-font)] max-w-md">{formatBrandDate(lastVisited)}</p>
            <p className="text-[var(--primary-font)] text-sm md:text-base max-w-lg">{clampTextByWords(classDesc, 300)}</p>
            <Separator></Separator>
            <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2">
                <Link href={continueLink} className={!continueLink.length ? "pointer-events-none" : "cursor-pointer"}>
                    <BrandButton disabled={!continueLink.length} iconLeft={<Play></Play>}>Continue Learning</BrandButton>
                </Link>
                <BookmarkButton bookmarkId={classId}></BookmarkButton>
            </div>
            <Separator></Separator>
            {/* <div className="max-w-lg">
                <ProgressBar progress={progress}></ProgressBar>
            </div> */}
        </div>
    )
};