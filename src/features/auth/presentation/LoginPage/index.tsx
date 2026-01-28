import FullPageWrapper from "@/shared/wrappers/FullPageWrapper";
import LoginForm from "./LoginForm";

const LoginPage = () => {
    return (
        <FullPageWrapper>
            <div className="max-w-lg w-full mx-auto px-0 md:px-12 h-full relative flex flex-row items-center justify-center">
                <LoginForm></LoginForm>
            </div>
            <div
                className="hidden lg:block flex-1 bg-center bg-no-repeat bg-cover rounded-xl"
                style={{
                    backgroundImage: "url('/backgrounds/signup_page.png')"
                }}
            ></div>
        </FullPageWrapper>
    );
};

export default LoginPage;