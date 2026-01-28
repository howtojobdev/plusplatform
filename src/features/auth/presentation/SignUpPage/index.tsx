import FullPageWrapper from "@/shared/wrappers/FullPageWrapper";
import SignUpForm from "./SignUpForm";
import Image from "next/image";

const SignUpPage = () => {
    return (
        <FullPageWrapper>
            <div className="max-w-lg w-full mx-auto px-0 md:px-12 h-fit md:h-full relative flex flex-row items-center justify-center">
                <SignUpForm></SignUpForm>
            </div>
            <div
                className="hidden lg:block relative flex-1 bg-center bg-no-repeat bg-cover rounded-xl"
                style={{
                    backgroundImage: "url('/backgrounds/signup_page.png')"
                }}
            ></div>
        </FullPageWrapper>
    );
};

export default SignUpPage;