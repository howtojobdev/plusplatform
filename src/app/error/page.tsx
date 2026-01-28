import CustomErrorCatch from "@/shared/components/CustomErrorCatch";
import { Suspense } from "react";

const ErrorPage = () => {
    return (
        <Suspense fallback={null}>
            <CustomErrorCatch></CustomErrorCatch>
        </Suspense>
    )
};

export default ErrorPage;