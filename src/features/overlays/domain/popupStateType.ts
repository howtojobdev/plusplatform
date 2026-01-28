export type PopupStateType = {
    message: string;
    desc?: string;
    isVis: boolean;
    hideTimeoutRef: ReturnType<typeof setTimeout> | null;

    showToast: (
        title: string,
        desc?: string,
        timeOut?: number
    ) => void;

    hideToast: () => void;
}