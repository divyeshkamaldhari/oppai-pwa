import { NavLink, useLocation } from "react-router";

import giftIconBox from "../../assets/Gift-icon.png";
import AccountIcon from "../../assets/Icons/AccountIcon";
import ChatIcon from "../../assets/Icons/ChatIcon";
import StoreIcon from "../../assets/Icons/StoreIcon";
import VaultIcon from "../../assets/Icons/VaultIcon";
import warningTriangleIcon from "../../assets/WarningTriangleIcon.png";
import { APP_ROUTE } from "../../constants/AppRoutes";
import { useAppSelector } from "../../redux";
import { isIphoneSafariOrChrome, isPWA } from "../../utils";
import useChatDiscountTimer from "../ChatDiscountWrapper";

const MobileNav = () => {
    const { unreadCount } = useAppSelector((state) => state.chat);
    const { userDetail } = useAppSelector((store) => store.user);
    const location = useLocation();
    const currentPath = location.pathname;
    const fromStore = location.state?.fromStore;
    const { minutes, seconds, discountActive } = useChatDiscountTimer();

    const tabs = [
        { key: "store", label: "Store", Icon: StoreIcon, path: APP_ROUTE.STORE },
        { key: "chat", label: "Chat", Icon: ChatIcon, path: APP_ROUTE.CHAT },
        { key: "vault", label: "Vault", Icon: VaultIcon, path: APP_ROUTE.VAULT },
        { key: "account", label: "Account", Icon: AccountIcon, path: APP_ROUTE.ACCOUNT },
    ];

    return (
        <div
            className={`mobile-navigation fixed bottom-0 z-10 flex w-full justify-center rounded-t-[20px] bg-[#341D5C] max-w-md mx-auto left-1/2 -translate-x-1/2 ${isIphoneSafariOrChrome() && isPWA() ? "pb-6" : ""}`}
        >
            <div className="flex w-full max-w-md justify-center rounded-t-[20px] bg-[#341D5C] h-[61px]">
                <div className="flex gap-6">
                    {tabs.map(({ key, label, Icon, path }) => {
                        return (
                            <NavLink
                                key={key}
                                className={({ isActive }) => {
                                    let active = isActive;

                                    if (currentPath.startsWith(APP_ROUTE.VAULT) && fromStore) {
                                        if (key === "store") active = true; // force Store active
                                        if (key === "vault") active = false; // disable Vault active
                                    }

                                    return `h-full min-w-14 pt-2.5 px-2 flex flex-col relative items-center gap-0.5 ${active ? "border-b-4 border-[#CE2A42]" : ""}`;
                                }}
                                to={path}
                            >
                                {({ isActive }) => {
                                    let highlight = isActive;

                                    if (currentPath.startsWith(APP_ROUTE.VAULT) && fromStore) {
                                        if (key === "store") highlight = true;
                                        if (key === "vault") highlight = false;
                                    }

                                    return (
                                        <>
                                            {key === "chat" && discountActive && !userDetail?.chat_purchase && (
                                                <div className="pwa-tootltip badge-btn ">
                                                    <img alt="gift icon" className="w-4 h-4 max-w-4" loading="lazy" src={warningTriangleIcon} />
                                                    <span className="pwa-tootltip-text text-xs font-medium text-white">
                                                        {minutes}:{seconds}
                                                    </span>
                                                </div>
                                            )}
                                            {key === "vault" && userDetail?.free_label === "" && (
                                                <div className="pwa-tootltip badge-btn ">
                                                    <img alt="gift icon" className="w-4 h-4 max-w-4" loading="lazy" src={giftIconBox} />
                                                    <span className="pwa-tootltip-text text-xs font-medium text-white">Free</span>
                                                </div>
                                            )}
                                            <Icon className={`${highlight ? "fill-[#CE2A42]" : "fill-white"}`} />
                                            <div className={`font-poppins text-[10px] font-medium ${highlight ? "text-[#CE2A42]" : "text-white"}`}>{label}</div>
                                            {key !== "account" &&
                                                ((key === "store" && currentPath !== APP_ROUTE.STORE && Number(userDetail.new_store_vault) > 0) ||
                                                    (key === "chat" && currentPath !== APP_ROUTE.CHAT && unreadCount > 0) ||
                                                    (key === "vault" && currentPath !== APP_ROUTE.VAULT && Number(userDetail.new_content_valut) > 0)) && (
                                                    <div className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#1CBD43]" />
                                                )}
                                        </>
                                    );
                                }}
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MobileNav;
