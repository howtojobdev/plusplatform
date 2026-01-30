"use client";

import { Popup } from "@/features/overlays/presentation/Popup";
import { ModalCard } from "../components/Card/ModalCard";

type Props = {
    children: React.ReactNode;
}

export const OverlayWrapper = ({ children }: Props) => {
    return (
        <>
            <Popup></Popup>
            <ModalCard></ModalCard>
            {children}
        </>
    )
};