"use client";

import BrandButton from "@/shared/components/BrandButton";
import BrandInput from "@/shared/components/BrandInput";
import Saperator from "@/shared/components/Saperator";
import Link from "next/link";
import { useLoginForm } from "@/features/auth/application/hooks/useLoginForm";
import { cn } from "@/shared/utils/cn";

const LoginForm = () => {
    const {
        values,
        errors,
        setField,
        touch,
        onSubmit,
        loading,
        loginWithGoogle
    } = useLoginForm();

    return (
        <form className="flex flex-col w-full" onSubmit={onSubmit}>
            <div className="flex flex-col gap-2 mb-6 md:mb-10">
                <h1 className="font-display text-3xl md:text-4xl">Log In</h1>
                <p className="text-sm md:text-base text-[var(--secondary-font)]">
                    Welcome back! Always nice to see you.
                </p>
            </div>

            <div className="flex gap-2">
                <BrandButton
                    type="button"
                    variant="outline"
                    fullWidth
                    disabled={loading}
                    iconLeft={<img src="/logos/google.png" className="w-[25px] h-[25px]" />}
                    onClick={loginWithGoogle}
                >
                    Log In With Google
                </BrandButton>
            </div>

            <div className="flex gap-2 justify-center my-4 items-center">
                <hr className="flex-1 h-1 border-[var(--secondary-font)]" />
                <p className="text-xs text-[var(--secondary-font)]">or continue with</p>
                <hr className="flex-1 h-1 border-[var(--secondary-font)]" />
            </div>

            <div className="flex flex-col gap-4">
                <BrandInput
                    type="email"
                    label="Email"
                    placeholder="jhonwick@gmail.com"
                    value={values.email}
                    disabled={loading}
                    onChange={v => {
                        setField("email", v);
                        touch("email");
                    }}
                    validate={() => errors.email}
                />
                <BrandInput
                    type="password"
                    label="Password"
                    placeholder="*********"
                    value={values.password}
                    disabled={loading}
                    onChange={v => {
                        setField("password", v);
                        touch("password");
                    }}
                    validate={() => errors.password}
                />
            </div>

            <Saperator y size="xl" />

            <div className="flex flex-col gap-2">
                <BrandButton loading={loading} className="py-4" type="submit">
                    Log In
                </BrandButton>

                <p className={cn("text-[var(--secondary-font)] text-sm", loading ? "pointer-events-none opacity-50" : "")}>
                    Don't have an account yet?{" "}
                    <Link className="text-blue-400" href={"/signup"}>
                        Create an Account
                    </Link>
                </p>

                {/* <p
                    className={cn(
                        "text-[var(--secondary-font)] text-sm -mt-2",
                        loading ? "pointer-events-none opacity-50" : ""
                    )}
                >
                    Can't remember logins?{" "}
                    <Link className="text-blue-400" href={"/forgot-password"}>
                        Forgot Password
                    </Link>
                </p> */}
            </div>
        </form>
    );
};

export default LoginForm;