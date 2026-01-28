import { cn } from "@/shared/utils/cn";

type Props = {
    children?: React.ReactNode;
    col?: boolean;
}

const FullPageWrapper = ({
    children,
    col = false
}: Props) => {

    return (
        <div
            className={cn(
                "w-[100dvw] h-[100dvh] max-w-[100dvw] max-h-[100dvh] overflow-x-hidden",
                    "overflow-y-scroll scrollbar flex relative p-4",
                    col ? "flex-col" : "flex-row"
            )}>
            {children}
        </div>
    );
};

export default FullPageWrapper;