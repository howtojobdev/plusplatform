import { cn } from "@/shared/utils/cn";

type Props = {
    titleImage: string;
    title: string;
};

export const ClassHero = ({ title, titleImage }: Props) => {
    return (
        <div className="w-[100dvw] h-fit lg:h-[100dvh] flex flex-col items-center relative lg:absolute -z-10">
            <img
                src={titleImage}
                alt={title}
                className="w-full h-full object-contain object-top lg:object-cover lg:object-center lg:absolute z-[-2]"
            />
            <div
                className={cn(
                    "absolute inset-0 bg-pink-300 z-[-1]",
                    "bg-gradient-to-t md:bg-gradient-to-tr from-black to-black/30 md:from-black md:to-black/50"
                )}
            />
            <div
                className={cn(
                    "hidden lg:block absolute -bottom-4 h-[12rem] w-full z-[-1]",
                    "bg-gradient-to-t from-[var(--primary-bg)] to-black/0"
                )}
            />
        </div>
    );
};