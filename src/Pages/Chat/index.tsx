import { useLocation } from "react-router";
import { useEffect } from "react";

import { chatPurchaseLoad, clearUnreadCount } from "../../redux/slices/chatSlice";
import ChatAppInitializer from "../../Components/CometChat/ChatAppInitializer";
import { paymentMethod } from "../../redux/slices/userSlice";
import { APP_ROUTE } from "../../constants/AppRoutes";
import { useAppDispatch } from "../../redux";

const Chat = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const path = location.pathname;

    useEffect(() => {
        if (path === APP_ROUTE.CHAT) {
            dispatch(clearUnreadCount());
        }
    }, [path]);

    useEffect(() => {
        dispatch(chatPurchaseLoad());
        dispatch(paymentMethod());
    }, []);

    return (
        <div>
            <ChatAppInitializer />
        </div>
    );
};

export default Chat;
