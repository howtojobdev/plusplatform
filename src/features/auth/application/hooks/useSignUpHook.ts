"use client";

import { useMemo, useState } from "react";
import { COUNTRIES } from "@/shared/constants/countries";
import { ageYears, emailRegex, isValidISODate } from "@/shared/utils/helperFunctions";
import { signIn } from "next-auth/react";
import { usePopupState } from "@/features/overlays/application/state/usePopupState";
import { useRouter } from "next/navigation";

type Values = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dob: string;
    country?: string;
};

type Touched = Partial<Record<keyof Values, boolean>>;
type Errors = Partial<Record<keyof Values, string>>;

export const useSignUpHook = () => {
    const [values, setValues] = useState<Values>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dob: "",
        country: undefined
    });
    const [loading, setLoading] = useState(false);

    const [touched, setTouched] = useState<Touched>({});

    const showToast = usePopupState(s => s.showToast);

    const router = useRouter();

    const setField = <K extends keyof Values>(key: K, value: Values[K]) => {
        setValues(v => ({ ...v, [key]: value }));
    };

    const touch = (key: keyof Values) => setTouched(t => ({ ...t, [key]: true }));

    const validators = useMemo(
        () => ({
            firstName: (v: string) => {
                const s = v.trim();
                if (!s) return "First name is required";
                if (s.length < 2) return "First name is too short";
            },
            lastName: (v: string) => {
                const s = v.trim();
                if (!s) return "Last name is required";
                if (s.length < 2) return "Last name is too short";
            },
            email: (v: string) => {
                const s = v.trim();
                if (!s) return "Email is required";
                if (!emailRegex.test(s)) return "Enter a valid email";
            },
            password: (v: string) => {
                if (!v) return "Password is required";
                if (v.length < 8) return "Password must be at least 8 characters";
            },
            dob: (v: string) => {
                const s = v.trim();
                if (!s) return "Date of birth is required";
                if (!isValidISODate(s)) return "Enter a valid date";
                const [yy, mm, dd] = s.split("-").map(Number);
                const dt = new Date(yy, mm - 1, dd);
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                if (dt > today) return "Date of birth can't be in the future";
                if (ageYears(s) < 13) return "You must be at least 13 years old";
            },
            country: (v?: string) => {
                if (!v) return "Country is required";
            }
        }),
        []
    );

    const allErrors: Errors = useMemo(
        () => ({
            firstName: validators.firstName(values.firstName),
            lastName: validators.lastName(values.lastName),
            email: validators.email(values.email),
            password: validators.password(values.password),
            dob: validators.dob(values.dob),
            country: validators.country(values.country)
        }),
        [validators, values]
    );

    const errors: Errors = useMemo(() => {
        const out: Errors = {};
        (Object.keys(allErrors) as (keyof Values)[]).forEach(k => {
            if (touched[k] && allErrors[k]) out[k] = allErrors[k];
        });
        return out;
    }, [allErrors, touched]);

    const isValid = useMemo(() => !Object.values(allErrors).some(Boolean), [allErrors]);

    const markAllTouched = () =>
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            dob: true,
            country: true
        });

    const onSubmit = async (e?: React.FormEvent) => {
        setLoading(true);
        e?.preventDefault?.();
        markAllTouched();
        if (!isValid) return { ok: false as const, values, errors: allErrors };
        
        const {
            firstName, lastName,
            email, password,
            dob, country
        } = values;

        const res = await signIn("credentials", {
            redirect: false,
            mode: "signup",
            firstName, lastName,
            email, password,
            dob, country
        });

        if(!res || !res.ok) {
            showToast(
                "Something went wrong!",
                res?.error ?? ""
            );
            setLoading(false);
            return;
        };

        router.push("/");
        setLoading(false);
    };

    const signUpWithGoogle = () => {
        signIn("google", { redirect: true, callbackUrl: "/" });
    };

    const countryOptions = useMemo(
        () =>
            COUNTRIES.map(c => ({
                label: c,
                value: c.toLowerCase(),
                disabled: false
            })),
        []
    );

    return {
        values,
        errors,
        isValid,
        countryOptions,
        setField,
        touch,
        onSubmit,
        loading,
        signUpWithGoogle
    };
};