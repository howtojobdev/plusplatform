"use client";

import { Popup } from "@/features/overlays/presentation/Popup";

type Props = {
    children: React.ReactNode;
}

export const OverlayWrapper = ({ children }: Props) => {
    return (
        <>
            <Popup></Popup>
            {children}
        </>
    )
};