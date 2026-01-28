import { ContentBlockRenderer } from "@/features/content/presentation/ContentBlockRenderer";
import { getContent } from "@/features/content/service/getContent.server";
import { ContentNavbar } from "@/shared/components/ContentNavbar";
import { CONTENT_TYPES_ENUM } from "@/shared/enums";
import { isInEnum } from "@/shared/utils/helperFunctions";
import { redirect } from "next/navigation";

type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
}

const ContentPage = async ({ searchParams }: Props) => {

    const { type, watch: contentId } = searchParams;

    if(!type || !contentId) return redirect("/not-allowed");

    const contentData = await getContent(contentId as string);

    if(
        !isInEnum((type ?? "") as string, CONTENT_TYPES_ENUM) ||
        !contentData ||
        !isInEnum((contentData.type ?? "") as string, CONTENT_TYPES_ENUM)
    ) return redirect("/error");

    return (
        <>
            <ContentNavbar inPlace></ContentNavbar>
            <ContentBlockRenderer blocks={contentData.blocks}></ContentBlockRenderer>
        </>
    )
};

export default ContentPage;