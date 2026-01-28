"use client";

import BrandButton from "@/shared/components/BrandButton";
import { cn } from "@/shared/utils/cn";
import { useSearchParams, useRouter } from "next/navigation";

const CustomErrorCatch = () => {
    const params = useSearchParams();
    const router = useRouter();

    const hasError = params.get("error");
    const status = hasError ? "Error" : "Not Found";
    const statusCode = hasError ? "401" : "404";

    const headerContent = hasError
        ? "This email is already registered with Email & Password! Cannot sign in with Google."
        : "The page you're trying to access either doesn't exist or you don't have permission to it.";

    const handleRevert = () => {
        router.push("/");
    };

    return (
        <div className="w-dvw h-dvh relative flex flex-col items-center justify-center gap-8 px-4 overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
                <div className="bloom bloom-left" />
                <div className="bloom bloom-right" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center gap-8 max-w-4xl w-full">
                <div className="flex xs:flex-row items-center justify-center gap-3 sm:gap-4">
                    <span
                        className={cn(
                            "min-w-[70px] sm:min-w-[120px] md:min-w-[150px]",
                            "text-4xl sm:text-7xl md:text-8xl lg:text-9xl",
                            "p-3 sm:p-4 bg-[var(--primary-accent)] text-[var(--primary-bg)]",
                            "flex items-center justify-center w-fit rounded-3xl font-display"
                        )}
                    >
                        {statusCode[0]}
                    </span>
                    <span
                        className={cn(
                            "min-w-[70px] sm:min-w-[120px] md:min-w-[150px]",
                            "text-4xl sm:text-7xl md:text-8xl lg:text-9xl",
                            "p-3 sm:p-4 text-[var(--primary-font)]",
                            "flex items-center justify-center w-fit rounded-3xl font-display"
                        )}
                    >
                        {statusCode[1]}
                    </span>
                    <span
                        className={cn(
                            "min-w-[70px] sm:min-w-[120px] md:min-w-[150px]",
                            "text-4xl sm:text-7xl md:text-8xl lg:text-9xl",
                            "p-3 sm:p-4 bg-[var(--primary-accent)] text-[var(--primary-bg)]",
                            "flex items-center justify-center w-fit rounded-3xl font-display"
                        )}
                    >
                        {statusCode[2]}
                    </span>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 px-2">
                    <h1 className="capitalize text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[var(--primary-font)] text-center">
                        {status}
                    </h1>
                    <p className="max-w-xl text-center text-sm sm:text-base md:text-lg text-[var(--secondary-font)]">
                        {headerContent}
                    </p>
                </div>

                <BrandButton
                    onClick={handleRevert}
                    className="text-base sm:text-lg md:text-xl rounded-full py-4 sm:py-5 md:py-6 px-8 sm:px-10 md:px-12"
                >
                    Back to Home
                </BrandButton>
            </div>
        </div>
    );
};

export default CustomErrorCatch;