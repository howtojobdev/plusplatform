import { create } from "zustand";
import { PopupStateType } from "../../domain/popupStateType";
import { POPUP_TIMEOUT } from "@/shared/constants/ui";

export const usePopupState = create<PopupStateType>()((set, get) => {

    const clearPopup = () => {
        const { hideTimeoutRef } = get();
        if(hideTimeoutRef) clearTimeout(hideTimeoutRef);
        set({ isVis: false, message: "", desc: "", hideTimeoutRef: null });
    };

    return {
        isVis: false,
        message: "",
        desc: "",
        hideTimeoutRef: null,

        showToast: (title, desc = "", timeOut = POPUP_TIMEOUT) => {
            const { hideTimeoutRef } = get();

            if (hideTimeoutRef) {
                clearTimeout(hideTimeoutRef);
            }

            const newTimeout = setTimeout(() => {
                clearPopup();
            }, timeOut);

            set({
                isVis: true,
                message: title, desc,
                hideTimeoutRef: newTimeout
            });
        },
        hideToast: () => {
            clearPopup();
        }
    }
});