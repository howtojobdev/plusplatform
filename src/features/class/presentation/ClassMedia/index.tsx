import { ClassType } from "../../domain/classType";
import { ClassMediaList } from "./ClassMediaList";

type Props = {
    classContent: ClassType["content"];
};

export const ClassMedia = ({ classContent }: Props) => {
    const groupedByType = classContent.reduce<Record<string, Props["classContent"]>>(
        (acc, item) => {
            (acc[item.type] ??= []).push(item);
            return acc;
        },
        {}
    );

    Object.values(groupedByType).forEach(group => group.sort((a, b) => a.index - b.index));

    const orderedTypes = Array.from(new Set(classContent.map(item => item.type)));

    return (
        <div className="flex flex-col py-6 gap-2">
            {orderedTypes.map(type => {
                const currContent = groupedByType[type];
                return (
                    <ClassMediaList
                        key={type}
                        title={type}
                        content={currContent}
                    ></ClassMediaList>
                );
            })}
        </div>
    );
};