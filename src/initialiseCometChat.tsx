import { CometChatUIKit, UIKitSettingsBuilder } from "@cometchat/chat-uikit-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { notification } from "antd";

import { AppContextProvider } from "./Components/CometChat/context/AppContext";
import { COMETCHAT_CONSTANTS } from "./Components/CometChat/AppConstants";
import { setupLocalization } from "./Components/CometChat/utils/utils";
import { setLoadingFalse, userLoad } from "./redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "./redux";
import { APP_ROUTE } from "./constants/AppRoutes";
import Loader from "./Components/Loader";
import MainRoutes from "./MainRoutes";
import { incrementUnreadCount } from "./redux/slices/chatSlice";

const InitialiseCometChat = () => {
    const { token } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const path = window.location.pathname;
    const { loading } = useAppSelector((state) => state.user);

    const navigate = useNavigate();

    const initCometChat = async (cometchatUser: number) => {
        try {
            const uiKitSettings = new UIKitSettingsBuilder()
                .setAppId(COMETCHAT_CONSTANTS.APP_ID)
                .setRegion(COMETCHAT_CONSTANTS.REGION)
                .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
                .subscribePresenceForAllUsers()
                .build();

            await CometChatUIKit.init(uiKitSettings);
            setupLocalization();

            const UID = `users_${cometchatUser}`;
            const loggedInUser = await CometChatUIKit.getLoggedinUser();

            if (!loggedInUser) {
                await CometChatUIKit.login(UID);
            }
            setTimeout(() => {
                dispatch(setLoadingFalse());
            }, 1900);
        } catch (error) {
            dispatch(setLoadingFalse());
            notification.error({ message: "Cometchat user not exist" });
            console.error("CometChat Initialization/Login Error:", error);
        }
    };

    const userLoadActions = async () => {
        try {
            const userResponse = await dispatch(userLoad());

            const cometchatUser = typeof userResponse.payload !== "string" ? userResponse.payload?.user_chat_waifus?.commetchat_user?.ID : null;

            if (cometchatUser) {
                initCometChat(cometchatUser);
            } else {
                dispatch(setLoadingFalse());
            }

            navigate(APP_ROUTE.VAULT);
            const chatNotificationRaw = localStorage.getItem("chatNotification");
            const chatNotificationBubble = chatNotificationRaw ? JSON.parse(chatNotificationRaw) : false;

            if (chatNotificationBubble) {
                dispatch(incrementUnreadCount());
                localStorage.removeItem("chatNotification");
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error loading user data:", error);
            dispatch(setLoadingFalse());
        }
    };

    useEffect(() => {
        if (token && !path.startsWith(APP_ROUTE.VEROTAL_PAYMENT_VIEW) && path !== APP_ROUTE.PURCHASE_CALLBACK) {
            userLoadActions();
        } else {
            dispatch(setLoadingFalse());
        }
    }, [token]);

    return (
        <AppContextProvider>
            {loading && <Loader />}
            <MainRoutes />
        </AppContextProvider>
    );
};

export default InitialiseCometChat;
