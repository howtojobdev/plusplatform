import { ContentCardItem } from "@/features/content/presentation/ContentCardItem";
import { ClassContentItemType } from "../../domain/classType";
import { ContentType } from "@/features/content/domain/contentType";

type Props = {
    title: string;
    content: ClassContentItemType[];
}

export const ClassMediaList = ({ title, content }: Props) => {
    return (
        <div className="w-full flex flex-col gap-4">
            <h1 className="font-display"><span className="capitalize">{title}</span>s</h1>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {content.map((contentItem) => {
                    const { isCompleted, lastVisited, ...rest } = contentItem;
                    const content: ContentType = rest;

                    return (
                        <ContentCardItem
                            key={content.id}
                            contentItem={content}
                            compact={false}
                            isCompleted={true}
                            lastVisited={lastVisited}
                        ></ContentCardItem>
                    )
                })}
            </div>
        </div>
    )
};