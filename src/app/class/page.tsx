import { ClassHero } from "@/features/class/presentation/ClassHero";
import { ClassInfo } from "@/features/class/presentation/ClassInfo";
import { getClass } from "@/features/class/service/getClass.server";
import { ContentNavbar } from "@/shared/components/ContentNavbar";
import Separator from "@/shared/components/Saperator";
import { redirect } from "next/navigation";

type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
};

const ClassPage = async ({ searchParams }: Props) => {
    const { watch: classId } = searchParams;
    const classData = await getClass(classId as string);

    if (!classData) return redirect("/not-allowed");

    return (
        <>
            <ContentNavbar></ContentNavbar>
            <ClassHero
                title={classData?.title ?? "Class Title Image"}
                titleImage={classData?.titleImage ?? ""}
            ></ClassHero>
            <div className="hidden lg:block h-[35dvh]">
            </div>
            <div className="block lg:hidden">
                <Separator size="md" y></Separator>
            </div>
            <ClassInfo classData={classData}></ClassInfo>
        </>
    )
};

export default ClassPage;