"use client";

import { useMemo, useState } from "react";
import { emailRegex } from "@/shared/utils/helperFunctions";
import { signIn } from "next-auth/react";
import { usePopupState } from "@/features/overlays/application/state/usePopupState";
import { useRouter } from "next/navigation";

type Values = {
    email: string;
    password: string;
};

type Touched = Partial<Record<keyof Values, boolean>>;
type Errors = Partial<Record<keyof Values, string>>;

export const useLoginForm = () => {
    const [values, setValues] = useState<Values>({
        email: "",
        password: ""
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
            email: (v: string) => {
                const s = v.trim();
                if (!s) return "Email is required";
                if (!emailRegex.test(s)) return "Enter a valid email";
            },
            password: (v: string) => {
                if (!v) return "Password is required";
                if (v.length < 8) return "Password must be at least 8 characters";
            }
        }),
        []
    );

    const allErrors: Errors = useMemo(
        () => ({
            email: validators.email(values.email),
            password: validators.password(values.password)
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
            email: true,
            password: true
        });

    const onSubmit = async (e?: React.FormEvent) => {
        setLoading(true);
        e?.preventDefault?.();
        markAllTouched();
        if (!isValid) {
            setLoading(false);
            return { ok: false as const, values, errors: allErrors };
        }

        const { email, password } = values;

        const res = await signIn("credentials", {
            redirect: false,
            mode: "login",
            email,
            password
        });

        if (!res || !res.ok) {
            showToast("Something went wrong!", res?.error ?? "");
            setLoading(false);
            return;
        }

        router.push("/");
        setLoading(false);
    };

    const loginWithGoogle = () => {
        signIn("google", { redirect: true, callbackUrl: "/" });
    }

    return {
        values,
        errors,
        isValid,
        setField,
        touch,
        onSubmit,
        loading,
        loginWithGoogle
    };
};