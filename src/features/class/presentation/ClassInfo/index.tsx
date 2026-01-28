"use client";

import Separator from "@/shared/components/Saperator";
import { deriveClassProgress } from "../../application/factories/deriveClassMeta";
import { ClassType } from "../../domain/classType";
import { ClassMeta } from "./ClassMeta";
import { ClassMedia } from "../ClassMedia";

type Props = {
    classData: ClassType;
};

export const ClassInfo = ({ classData }: Props) => {

    const content = classData.content;

    const {
        chipProgress,
        progress,
        lastVisited,
        continueLink
    } = deriveClassProgress(content);

    return (
        <div className="flex flex-col w-full px-4 md:px-12 py-4">
            <ClassMeta
                classTitle={classData.title}
                classDesc={classData.synopsis}
                chipProgress={chipProgress}
                continueLink={continueLink}
                lastVisited={lastVisited}
                progress={progress}
                classId={classData.id}
            ></ClassMeta>
            <Separator></Separator>
            {/* <ClassAnalytics content={content}></ClassAnalytics> */}
            <ClassMedia classContent={content}></ClassMedia>
        </div>
    )
};