import { CometChat } from "@cometchat/chat-sdk-javascript";
import { Navigate, useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";

import { incrementUnreadCount } from "../redux/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "../redux";
import { isIphoneSafariOrChrome, isPWA } from "../utils";
import { APP_ROUTE } from "../constants/AppRoutes";
import MobileNav from "../Components/MobileNav";
import Collection from "../Pages/Collection";
import Account from "../Pages/Account";
import Vault from "../Pages/Vault";
import Store from "../Pages/Store";
import Chat from "../Pages/Chat";
import Gift from "../Pages/Gift";

const MainLayout = () => {
    const { token } = useAppSelector((state) => state.auth);
    const { loading } = useAppSelector((state) => state.user);
    const [fetchData, setFetchData] = useState<boolean>(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const path = location.pathname;

    const dispatch = useAppDispatch();
    const isVaultView = path.startsWith(APP_ROUTE.VAULT_VIEW_collection);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        if (scrollTop + clientHeight >= scrollHeight - 300) {
            setFetchData(true);
        } else {
            setFetchData(false);
        }
    };

    useEffect(() => {
        if (!token) return;

        const listenerID = "UNREAD-LISTENER";

        CometChat.addMessageListener(
            listenerID,
            new CometChat.MessageListener({
                onTextMessageReceived: () => {
                    if (!window.location.pathname.includes(APP_ROUTE.CHAT)) {
                        dispatch(incrementUnreadCount());
                    }
                },
            }),
        );

        return () => {
            CometChat.removeMessageListener(listenerID);
        };
    }, [token]);

    return token ? (
        <main className="mx-auto flex h-dvh max-h-[100dvh] w-full max-w-md flex-col bg-[#130C1E] text-white">
            <div className={`inner_wrap h-full ${isIphoneSafariOrChrome() && isPWA() ? "pb-[85px]" : "pb-[61px]"}`}>
                <div
                    className={`overflow-y-auto ${isIphoneSafariOrChrome() && isPWA() ? "max-h-[calc(100dvh-100px)]" : "max-h-[calc(100dvh-77px)]"}`}
                    hidden={path !== APP_ROUTE.STORE}
                >
                    <Store />
                </div>
                {!loading && (
                    <div
                        className={`overflow-y-auto ${isIphoneSafariOrChrome() && isPWA() ? "max-h-[calc(100dvh-100px)]" : "max-h-[calc(100dvh-77px)]"}`}
                        hidden={path !== APP_ROUTE.CHAT}
                    >
                        <Chat />
                    </div>
                )}
                <div
                    className={`overflow-y-auto ${isIphoneSafariOrChrome() && isPWA() ? "max-h-[calc(100dvh-100px)]" : "max-h-[calc(100dvh-77px)]"}`}
                    hidden={path !== APP_ROUTE.VAULT}
                >
                    <Vault />
                </div>
                <div
                    className={`overflow-y-auto ${isIphoneSafariOrChrome() && isPWA() ? "max-h-[calc(100dvh-100px)]" : "max-h-[calc(100dvh-77px)]"}`}
                    hidden={path !== APP_ROUTE.ACCOUNT}
                >
                    <Account />
                </div>
                <div
                    className={`overflow-y-auto ${isIphoneSafariOrChrome() && isPWA() ? "max-h-[calc(100dvh-100px)]" : "max-h-[calc(100dvh-77px)]"}`}
                    hidden={path !== APP_ROUTE.GIFT}
                >
                    <Gift />
                </div>
                <div
                    ref={scrollRef}
                    className={`overflow-y-auto ${isIphoneSafariOrChrome() && isPWA() ? "max-h-[calc(100dvh-100px)]" : "max-h-[calc(100dvh-77px)]"}`}
                    hidden={!isVaultView}
                    onScroll={handleScroll}
                >
                    <Collection fetchData={fetchData} scrollRef={scrollRef} />
                </div>
            </div>
            <MobileNav />
        </main>
    ) : (
        <Navigate to={APP_ROUTE.LOGIN} />
    );
};

export default MainLayout;
