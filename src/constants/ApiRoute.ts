import { BACKEND_URL, DEVLOPMENT_ENVIRONMENT } from "./EnvConstants";

const BASE_URL = DEVLOPMENT_ENVIRONMENT === "local" ? "" : BACKEND_URL;

export const API_URL = {
    USER: {
        LOGIN: `${BASE_URL}/wp-json/api/auth/login`,
        LOGOUT: `${BASE_URL}/wp-json/api/auth/logout`,
        SIGNOUT: `${BASE_URL}/signout`,
        FORGOT_PASSWORD: `${BASE_URL}/wp-json/api/auth/forgot-password`,
        CHANGE_PASSWORD: `${BASE_URL}/wp-json/api/auth/change-password`,
        RESET_PASSWORD: `${BASE_URL}/user/reset-password`,
        LOAD: `${BASE_URL}/wp-json/api/auth/user`,
        STORE: `${BASE_URL}/wp-json/api/auth/gift-products`,
        STORE_GIFT_PRODUCT: `${BASE_URL}/wp-json/api/auth/gift-products`,
        VAULT_FEATURES: `${BASE_URL}/wp-json/api/auth/featured`,
        VAULT_MY_COLLECTION: `${BASE_URL}/wp-json/api/auth/my_collecton`,
        VAULT_PAID_CONTENT: `${BASE_URL}/wp-json/api/auth/paid_content`,
        VAULT_NEW_RELEASES: `${BASE_URL}/wp-json/api/auth/new-releases`,
        VAULT_FAN_FAVORITES: `${BASE_URL}/wp-json/api/auth/fan-favorites`,
        VAULT_CHARACTER_CONTENT: `${BASE_URL}/wp-json/api/auth/character-content`,
        VAULT_CHARACTER_CONTENT_BY_KEY: `${BASE_URL}/wp-json/api/auth/character-content-by-key`,
        AGE_VERIFIED: `${BASE_URL}/wp-json/api/auth/age-status`,
        UPDATE_NOTIFICATION: `${BASE_URL}/wp-json/api/auth/user_notification_update`,
        WAIFU_DETAILS: `${BASE_URL}/wp-json/api/auth/waifu_details`,
        CHAT_PURCHASE: `${BASE_URL}/wp-json/api/auth/chat`,
        EMERCHANT_PAYMENT: `${BASE_URL}/wp-json/api/auth/emerchant-payment`,
        VEROTAL_PAYMENT: `${BASE_URL}/wp-json/api/auth/verotal-payment`,
        PAYMENT_METHOD: `${BASE_URL}/wp-json/api/auth/payment_option_show`,
        CREATE_PENDING_ORDER: `${BASE_URL}/wp-json/api/auth/create-pending-order`,
        COMPLETE_ORDER: `${BASE_URL}/wp-json/api/auth/complete-order`,
        FAIL_ORDER: `${BASE_URL}/wp-json/api/auth/fail-order`,
        NEW_CONTENT: `${BASE_URL}/wp-json/api/auth/user/vault_green_dot`,
        BAN_KEYWORDS: `${BASE_URL}/wp-json/custom/v1/keywords`,
        UPDATE_VAULT_FREE_NOTIFICATION: `${BASE_URL}/wp-json/api/auth/update-user-free-count`,
    },
};
