import { CometChatUIKit } from "@cometchat/chat-uikit-react";

import { APP_ROUTE, COMMON_ROUTE } from "../constants/AppRoutes";
import { getFromLocalStorage } from "../redux/slices/purchaseSlice";

import { createSessionToken, getOriginalToken } from "./hash-token";

const cometChatLogout = () => {
    try {
        if (CometChatUIKit.isInitialized()) {
            CometChatUIKit.logout();
        }
    } catch (cometError) {
        console.error("CometChat logout error:", cometError);
    }
};

const serviceWorkerClean = async () => {
    if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();

        for (const registration of registrations) {
            await registration.unregister();
        }
    }
};

const cacheClean = async () => {
    if ("caches" in window) {
        const cacheNames = await caches.keys();

        await Promise.all(cacheNames.map((name) => caches.delete(name)));
    }
};

const indexedDBClean = async () => {
    try {
        // Clear CometChat's IndexedDB
        if ("indexedDB" in window) {
            const databases = await indexedDB.databases();

            for (const db of databases) {
                if (db.name && (db.name.includes("cometchat") || db.name.includes("CometChat"))) {
                    indexedDB.deleteDatabase(db.name);
                }
            }
        }

        // Clear CometChat specific localStorage keys
        const keysToRemove = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key && (key.includes("cometchat") || key.includes("CometChat") || key.includes("AuthToken"))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (storageError) {
        console.error("Error clearing CometChat storage:", storageError);
    }
};

export const clearAllCookies = () => {
    const cookies = document.cookie.split(";");

    cookies.forEach((cookie) => {
        const name = cookie.split("=")[0].trim();

        if (!name) return;

        const paths = ["/", COMMON_ROUTE, `${COMMON_ROUTE}/`];
        const domains = [window.location.hostname, `.${window.location.hostname}`];

        paths.forEach((path) => {
            // Try without domain
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path}`;

            // Try with domain variations
            domains.forEach((domain) => {
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};domain=${domain}`;
            });
        });
    });
};

const bfcacheClean = () => {
    if ("pagehide" in window) {
        window.addEventListener(
            "pagehide",
            (event) => {
                if (event.persisted) {
                    // Page is being cached by bfcache, prevent it
                    event.preventDefault();
                }
            },
            { once: true },
        );
    }
};

export const forceLogoutAndReLogin = async () => {
    try {
        const preserveValueToken = getOriginalToken();
        const preserveValueRefreshToken = getFromLocalStorage("refresh_token", false);
        const preserveValue = !preserveValueRefreshToken ? preserveValueToken : preserveValueRefreshToken;

        // 1. Prevent bfcache on iPhone Safari
        bfcacheClean();

        // 2. Clear CometChat session first
        cometChatLogout();

        // 3. Clear CometChat's IndexedDB and persistent storage
        indexedDBClean();

        // 4. Clear all other storage
        localStorage.clear();
        sessionStorage.clear();

        // 5. Clear cookies with more aggressive approach
        clearAllCookies();

        // 6. Clear caches
        cacheClean();

        // 7. Unregister service workers
        serviceWorkerClean();

        // Create a unique cache-busting URL with multiple parameters
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const newQueryString = `?token=${preserveValue}&c=${timestamp}&r=${random}&_t=${timestamp}&_r=${random}`;
        const newUrl = window.location.origin + APP_ROUTE.LOGIN + newQueryString;

        createSessionToken(preserveValue);

        // Add chat key for notification
        localStorage.setItem("chatNotification", "true");

        // 9. Use replace instead of href to prevent bfcache
        // Add cache-control headers via meta tag before navigation
        // const metaCacheControl = document.createElement("meta");

        // metaCacheControl.setAttribute("http-equiv", "Cache-Control");
        // metaCacheControl.setAttribute("content", "no-cache, no-store, must-revalidate, max-age=0");
        // document.head.appendChild(metaCacheControl);

        // const metaPragma = document.createElement("meta");

        // metaPragma.setAttribute("http-equiv", "Pragma");
        // metaPragma.setAttribute("content", "no-cache");
        // document.head.appendChild(metaPragma);

        // const metaExpires = document.createElement("meta");

        // metaExpires.setAttribute("http-equiv", "Expires");
        // metaExpires.setAttribute("content", "0");
        // document.head.appendChild(metaExpires);

        // Small delay to ensure cleanup completes
        setTimeout(() => {
            window.location.replace(newUrl);
        }, 100);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error during logout:", error);
        // Fallback: force reload even if cleanup fails
        window.location.reload();
    }
};

export const logoutUser = async () => {
    try {
        localStorage.clear();
        CometChatUIKit.logout();
        sessionStorage.clear();
        clearAllCookies();
        cacheClean();
        serviceWorkerClean();
        window.location.reload();
    } catch (error) {
        console.error("Error during logout cleanup:", error);
    }
};
