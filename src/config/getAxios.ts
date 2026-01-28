import axios, { AxiosInstance } from "axios";

type TargetServerType = "main" | "private";

export const getAxios = (targetServer: TargetServerType = "private"): AxiosInstance => {
    if(targetServer == "main") {
        return axios.create({
            baseURL: process.env.MAIN_SERVER_URL!,
            timeout: 15000,
            headers: {
                "x-app-id": process.env.MAIN_SERVER_APP_ID,
                "Authorization": `Bearer ${process.env.MAIN_SERVER_ACCESS}`
            }
        });
    } else {
        return axios.create({
            baseURL: "api/",
            timeout: 5000,
            withCredentials: true
        });
    }
};