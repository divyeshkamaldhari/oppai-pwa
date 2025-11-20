export const COMMON_ROUTE = "/app";

export const APP_ROUTE = {
    WELCOMESCREEN: "/",
    PWA_SCREEN: COMMON_ROUTE,
    LOGIN: `${COMMON_ROUTE}/login`,
    SIGNUP: `/get-started`,
    FORGOT_PASSWORD: `${COMMON_ROUTE}/forgot-password`,
    RESET_PASSWORD: `${COMMON_ROUTE}/reset-password/:id`,
    CHAT: `${COMMON_ROUTE}/chat`,
    STORE: `${COMMON_ROUTE}/store`,
    GIFT: `${COMMON_ROUTE}/store/gift`,
    VAULT: `${COMMON_ROUTE}/vault`,
    VAULT_VIEW: `${COMMON_ROUTE}/vault/collection/:collection`,
    VEROTAL_PAYMENT: `${COMMON_ROUTE}/verotal-payment/:sessionId`,
    VEROTAL_PAYMENT_VIEW: `${COMMON_ROUTE}/verotal-payment`,
    VAULT_VIEW_collection: `${COMMON_ROUTE}/vault/collection`,
    ACCOUNT: `${COMMON_ROUTE}/account`,
    PURCHASE_CALLBACK: `${COMMON_ROUTE}/purchase-callback`,
    TUTORIAL: `${COMMON_ROUTE}/tutorial`,
    FAQ: `${COMMON_ROUTE}/faqs`,
};
