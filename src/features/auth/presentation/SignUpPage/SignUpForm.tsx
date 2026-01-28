"use client";

import BrandButton from "@/shared/components/BrandButton";
import BrandDropdown from "@/shared/components/BrandDropdown";
import BrandInput from "@/shared/components/BrandInput";
import Saperator from "@/shared/components/Saperator";
import Link from "next/link";
import { useSignUpHook } from "@/features/auth/application/hooks/useSignUpHook";
import { cn } from "@/shared/utils/cn";

const SignUpForm = () => {
    const {
        values,
        errors,
        countryOptions,
        setField,
        touch,
        onSubmit,
        loading,
        signUpWithGoogle
    } = useSignUpHook();

    return (
        <form className="flex flex-col max-w-md" onSubmit={onSubmit}>
            <div className="flex flex-col gap-2 mb-6 md:mb-10">
                <h1 className="font-display text-3xl md:text-4xl">Sign Up</h1>
                <p className="text-sm md:text-base text-[var(--secondary-font)]">Let's start with some facts about you.</p>
            </div>

            <div className="flex gap-2">
                <BrandButton
                    type="button"
                    variant="outline"
                    fullWidth
                    disabled={loading}
                    iconLeft={<img src="/logos/google.png" className="w-[25px] h-[25px]" />}
                    onClick={signUpWithGoogle}
                >
                    Sign Up With Google
                </BrandButton>
            </div>

            <div className="flex gap-2 justify-center my-4 items-center">
                <hr className="flex-1 h-1 border-[var(--secondary-font)]" />
                <p className="text-xs text-[var(--secondary-font)]">or continue with</p>
                <hr className="flex-1 h-1 border-[var(--secondary-font)]" />
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <BrandInput
                        label="First Name"
                        placeholder="Jhon"
                        value={values.firstName}
                        disabled={loading}
                        onChange={v => {
                            setField("firstName", v);
                            touch("firstName");
                        }}
                        validate={() => errors.firstName}
                    />
                    <BrandInput
                        label="Last Name"
                        placeholder="Wick"
                        value={values.lastName}
                        disabled={loading}
                        onChange={v => {
                            setField("lastName", v);
                            touch("lastName");
                        }}
                        validate={() => errors.lastName}
                    />
                </div>

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

                <BrandInput
                    type="date"
                    label="Date of Birth"
                    value={values.dob}
                    disabled={loading}
                    onChange={v => {
                        setField("dob", v);
                        touch("dob");
                    }}
                    validate={() => errors.dob}
                />

                <BrandDropdown
                    label="Country of Residence"
                    options={countryOptions}
                    value={values.country}
                    disabled={loading}
                    onChange={v => {
                        setField("country", v);
                        touch("country");
                    }}
                    validate={() => errors.country}
                />
            </div>

            <Saperator y size="xl" />

            <div className="flex flex-col gap-2">
                <BrandButton loading={loading} className="py-4" type="submit">
                    Join Now
                </BrandButton>
                <p
                    className={cn(
                        "text-[var(--secondary-font)] text-sm",
                        loading ? "pointer-events-none opacity-50" : ""
                    )}
                >
                    Already have an account?{" "}
                    <Link className="text-blue-400" href={"/login"}>
                        Login
                    </Link>
                </p>
            </div>

            <div className="block md:hidden h-[10dvh]" />
        </form>
    );
};

export default SignUpForm;