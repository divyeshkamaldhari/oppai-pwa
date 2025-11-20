import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import { BACKEND_AUTH_TOKEN } from "../constants/EnvConstants";
import { getOriginalToken } from "../utils/hash-token";
import { logoutUser } from "../utils/logout-user";

const defaultHeaders = {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
};

interface Props<T = unknown> {
    url: string;
    data?: T;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    headers?: Record<string, string>;
    noHeaders?: boolean;
    retries?: number;
    rest?: Omit<AxiosRequestConfig, "url" | "data" | "method" | "headers">;
}

export const defaultAxios = axios.create();

defaultAxios.interceptors.request.use(
    (config) => {
        const token = getOriginalToken();

        if (token) {
            config.headers.Authorization = `${token}`;
        }
        config.headers["X-Auth-Token"] = BACKEND_AUTH_TOKEN;
        config.headers["Content-Type"] = "application/json";

        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

const executeHttp = async ({ url, data = {}, method = "GET", headers = {}, noHeaders, retries = 2, ...rest }: Props) => {
    let attempt = 0;

    const makeRequest = async () => {
        try {
            const response: AxiosResponse = await defaultAxios({
                method,
                url,
                headers: {
                    ...(noHeaders ? {} : defaultHeaders),
                    ...headers,
                },
                data,
                withCredentials: true,
                ...rest,
            });

            return response;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const error = err?.response?.data;

                if (error?.message === "Invalid token" || error?.message === "Missing user token") {
                    logoutUser();
                }

                const shouldRetry =
                    !err?.response ||
                    [500, 502, 503, 504].includes(err?.response?.status ?? 0) ||
                    ["ECONNABORTED", "EAI_AGAIN", "ETIMEDOUT", "ERR_NETWORK"].includes(err?.code ?? "");

                if (shouldRetry && attempt < retries) {
                    attempt++;
                    // eslint-disable-next-line no-console
                    console.warn(`Retrying API request... Attempt ${attempt + 1}/${3}`);
                    await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));

                    return makeRequest();
                }

                throw error ?? "An unknown error occurred";
            } else {
                throw err instanceof Error ? err?.message : "An unknown error occurred";
            }
        }
    };

    return makeRequest();
};

export default executeHttp;
