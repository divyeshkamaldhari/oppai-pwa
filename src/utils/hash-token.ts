import secureLocalStorage from "react-secure-storage";

import { SECRET_COOKIE_KEY } from "../constants/EnvConstants";

// Generate random session ID
// const generateSessionId = (): string => {
//     return Math.random().toString(36).substring(2) + Date.now().toString(36);
// };

// Helper: Set cookie
const setCookie = (name: string, value: string, days = 1) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();

    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

// Helper: Get cookie
// const getCookie = (name: string): string | null => {
//     const regex = new RegExp("(^| )" + name + "=([^;]+)");
//     const match = regex.exec(document.cookie);

//     return match ? decodeURIComponent(match[2]) : null;
// };

// Create & store encrypted session token
export const createSessionToken = (apiToken: string) => {
    // const sessionId = generateSessionId();
    // const combined = `${apiToken}-${sessionId}-${SECRET_HASH_KEY}`;

    // Encrypt combined value
    // const encrypted = CryptoJS.AES.encrypt(combined, SECRET_HASH_KEY).toString();

    // Store token in localStorage and sessionId in cookie
    secureLocalStorage.setItem("token", apiToken);
    // localStorage.setItem("token", encrypted);
    // setCookie(SECRET_COOKIE_KEY, sessionId);

    return { apiToken };
};

// Decrypt and return original API token
export const getOriginalToken = (): string | null => {
    const encrypted = secureLocalStorage.getItem("token");
    // const encrypted = localStorage.getItem("token");
    // const sessionId = getCookie(SECRET_COOKIE_KEY);

    // if (!encrypted || !sessionId) return null;

    // const bytes = CryptoJS.AES.decrypt(String(encrypted), SECRET_HASH_KEY);
    // const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    // Check SECRET_COOKIE_KEY and secret key match
    // const [apiToken, storedSessionId, storedSecret] = decrypted.split("-");

    // if (storedSessionId !== sessionId || storedSecret !== SECRET_HASH_KEY) {
    //     return null;
    // }
    const apiToken = typeof encrypted === "string" ? encrypted : null;

    return apiToken;
};

// Clear session (logout)
export const clearSession = () => {
    localStorage.removeItem("token");
    setCookie(SECRET_COOKIE_KEY, "", -1); // expire cookie
};
