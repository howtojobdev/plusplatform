import { Loader } from "lucide-react";

export const FeedLoader = () => {
    return (
        <div className="relative z-30 flex flex-col gap-6 -mt-[25dvh] px-4 md:px-12 items-center justify-center">
            <Loader className="animate-spin"></Loader>
        </div>
    );
};