import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import { useEffect } from "react";
import { Route, Routes } from "react-router";

import PurchaseCallback from "../Pages/PurchaseCallback";
import VerotalPayment from "../Pages/VerotalPayment";
import { APP_ROUTE } from "../constants/AppRoutes";
import { useAppDispatch, useAppSelector } from "../redux";
import { getStoreData } from "../redux/slices/storeSlice";
import { getNewContent } from "../redux/slices/userSlice";
import {
    getVaultCharacterContentData,
    getVaultFanFavDataPurchase,
    getVaultFeaturedData,
    getVaultMyCollectionData,
    getVaultNewReleasedDataPurchase,
    getVaultPaidData,
} from "../redux/slices/vaultSlice";
import { forceLogoutAndReLogin } from "../utils/logout-user";
import AgeCheckerWrapper from "../Components/AgeCheckerWrapper";

import AuthenticatedRoutes from "./AuthenticatedRoutes";
import NonAuthenticatedRoutes from "./NonAuthenticatedRoutes";

const MainRoutes = () => {
    const { token } = useAppSelector((state) => state.auth);
    const { userDetail } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!userDetail?.master_access) {
            if (token) {
                dispatch(getNewContent());

                const interval = setInterval(() => {
                    dispatch(getNewContent());
                }, 30000);

                return () => clearInterval(interval);
            }
        }
    }, [dispatch]);

    useEffect(() => {
        // Prevent bfcache on iPhone Safari
        const handlePageHide = (event: PageTransitionEvent) => {
            if (event.persisted) {
                // Force a reload if the page is being cached
                window.location.reload();
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                // Check if CometChat session is stale after page becomes visible
                if (CometChatUIKit.isInitialized()) {
                    CometChatUIKit.getLoggedinUser()
                        .then((user) => {
                            if (user) {
                                // console.warn("CometChat user found after visibility change:", user);
                            }
                        })
                        .catch((error) => {
                            console.error("Error checking CometChat user after visibility change:", error);
                        });
                }
            }
        };

        window.addEventListener("pagehide", handlePageHide);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        const handleMessage = async (event: MessageEvent) => {
            try {
                if (event.data?.type === "purchaseSuccess") {
                    if (event?.data?.item && event?.data?.item === "chat") {
                        forceLogoutAndReLogin();
                    } else {
                        dispatch(getVaultPaidData());
                        dispatch(getVaultFeaturedData());
                        dispatch(getVaultNewReleasedDataPurchase({ page: 1 }));
                        dispatch(getVaultMyCollectionData({ page: 1 }));
                        dispatch(getVaultFanFavDataPurchase({ page: 1 }));
                        dispatch(getVaultCharacterContentData({ page: 1 }));
                        dispatch(getStoreData());
                    }
                }
            } catch (error) {
                console.log("error for handle message", error);
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return (
        <>
            <noscript>
                <meta content="0;url=https://agechecker.net/noscript" httpEquiv="refresh" />
            </noscript>
            <AgeCheckerWrapper />
            <Routes>
                {/* <Route element={<Navigate to={userDetail?.chat_purchase ? APP_ROUTE.VAULT : APP_ROUTE.VAULT} />} path={"/*"} /> */}
                {AuthenticatedRoutes()}
                {NonAuthenticatedRoutes()}
                <Route element={<VerotalPayment />} path={APP_ROUTE.VEROTAL_PAYMENT} />
                <Route element={<PurchaseCallback />} path={APP_ROUTE.PURCHASE_CALLBACK} />
            </Routes>
        </>
    );
};

export default MainRoutes;
