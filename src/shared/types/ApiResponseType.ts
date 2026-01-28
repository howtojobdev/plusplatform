export type ApiResponseType<T> = {
    successful: boolean;
    errMessage: {
        devMessage: string;
        userMessage: string;
    };
    data: T
};