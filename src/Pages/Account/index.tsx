import { useContext, useState } from "react";
import { Button } from "antd";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";

import { AppContext } from "../../Components/CometChat/context/AppContext";
import ChangePasswordModal from "../../Components/ChangePasswordModal";
import { useAppSelector } from "../../redux";
import InstagramIcon from "../../assets/Icons/InstagramIcon";
import PasswordIcon from "../../assets/Icons/PasswordIcon";
import FacebookIcon from "../../assets/Icons/FacebookIcon";
import TelegramIcon from "../../assets/Icons/TelegramIcon";
import TutorialIcon from "../../assets/Icons/TutorialIcon";
import ShareIcon from "../../assets/Icons/ShareIcon";
import HelpIcon from "../../assets/Icons/HelpIcon";
import FaqIcon from "../../assets/Icons/FaqIcon";
import user_image from "../../../public/assets/user.png";
import telegram_image from "../../../public/assets/OD-WORKS5.png"; // ensure this file exists under public/assets
import { AgeVerificationButton } from "../../Components/AgeNotVerifiedModal";
import { BACKEND_AUTH_TOKEN, FRONTEND_BASE_URL } from "../../constants/EnvConstants";
import { API_URL } from "../../constants/ApiRoute";
import executeHttp from "../../Service/api";
import TutorialModal from "../../Components/TutorialModal";
import FaqsModal from "../../Components/FaqsModal";

const Account = () => {
    const { userDetail } = useAppSelector((store) => store.user);
    const [changePassword, setChangePassword] = useState(false);
    const [tutorialModalVisible, setTutorialModalVisible] = useState(false);
    const [faqsModalVisible, setFaqsModalVisible] = useState(false);
    const { setAppState } = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    const baseLinkClasses = "flex items-center gap-3 rounded-xl p-3 font-poppins text-sm tl-class font-bold leading-6 text-white cursor-pointer";
    const darkerBg = "bg-[#191B22]";

    const handleOk = () => {
        setChangePassword(false);
    };

    const handleTutorialOk = () => {
        setTutorialModalVisible(false);
    };

    const handleFaqsOk = () => {
        setFaqsModalVisible(false);
    };

    const handleShare = async () => {
        const shareData = {
            title: "Chat with your waifu! | Oppai Dragon",
            text: "Chat with your waifu, rise as the Oppai Dragon! One-on-one chats and epic content drops. Your fave waifus and new faces too. Cuz it’s for otakus!",
            url: FRONTEND_BASE_URL,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error("Share failed:", err);
            }
        } else {
            navigator.clipboard.writeText(shareData.url);
        }
    };

    const performLogout = async () => {
        try {
            setLoading(true);
            localStorage.clear();
            setAppState({ type: "updateSelectedItem", payload: undefined });
            setAppState({ type: "updateSelectedItemUser", payload: undefined });
            setAppState({ type: "updateSelectedItemGroup", payload: undefined });
            setAppState({ type: "newChat", payload: undefined });
            CometChatUIKit.logout();

            // Call logout API
            try {
                await executeHttp({
                    method: "POST",
                    url: API_URL.USER.LOGOUT,
                    headers: {
                        "x-api-key": BACKEND_AUTH_TOKEN,
                    },
                });
            } catch (error) {
                // Log error but continue with logout process
                console.error("Logout API call failed:", error);
            }

            sessionStorage.clear();

            document.cookie.split(";").forEach((cookie) => {
                const name = cookie.split("=")[0].trim();

                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
            });

            if ("caches" in window) {
                const cacheNames = await caches.keys();

                await Promise.all(cacheNames.map((name) => caches.delete(name)));
            }

            if ("serviceWorker" in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();

                for (const registration of registrations) {
                    await registration.unregister();
                }
            }
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            setLoading(false);
            console.error("Error during logout cleanup:", error);
        }
    };

    const isPWA = (): boolean => {
        return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    };

    const handleLinkClick = (url: string) => {
        if (isPWA()) {
            window.open(url, "_blank", "noopener,noreferrer");
        } else {
            window.open(url, "_blank");
        }
    };

    return (
        <>
            <div className="flex h-full w-[initial] flex-col overflow-x-visible overflow-y-scroll px-4 text-white">
                <div className="mt-5 flex flex-col items-center justify-center">
                    <div className="h-20 w-20 overflow-hidden rounded-full">
                        <img alt="user-avtar" src={user_image} />
                    </div>
                    <h1
                        className="mt-1.5 font-poppins text-[25px] font-normal leading-[40px] break-words w-[100%] text-center !no-underline"
                        style={{ WebkitTextDecorationLine: "none" }}
                    >
                        {userDetail.name}
                    </h1>
                    <p className="mt-0.5 font-poppins text-sm leading-6 text-[#808080] !no-underline" style={{ WebkitTextDecorationLine: "none" }}>
                        {userDetail.email}
                    </p>
                    <p className="mt-0.5 font-poppins text-sm leading-6 text-[#808080] !no-underline" style={{ WebkitTextDecorationLine: "none" }}>
                        {userDetail.phone}
                    </p>
                    {!userDetail.age_verified && (
                        // <Button
                        //     className="!mt-3 !min-h-[38px] !rounded-full !border !border-solid !border-[#CE2A42] !bg-transparent !px-7 !py-3 !font-poppins !text-xs !font-bold !uppercase !leading-none !text-white"
                        //     id="verifyMyAgeAtAccountPage"
                        //     type="default"
                        // >
                        //     verify my age
                        // </Button>
                        <AgeVerificationButton isAccount={true} />
                    )}
                </div>
                <div className="mt-6 flex flex-col gap-4">
                    <Button
                        className="!h-max !justify-start !items-center !rounded-xl !bg-[#262A34] !p-3 !font-poppins !text-sm !font-bold !leading-6 !text-white [&_.ant-btn-icon]:flex"
                        icon={<PasswordIcon />}
                        type="default"
                        onClick={() => setChangePassword(true)}
                    >
                        Change Password
                    </Button>
                    <div className="flex w-full gap-3">
                        <div aria-hidden className={`w-full ${baseLinkClasses} bg-[#262A34]`} onClick={() => setTutorialModalVisible(true)}>
                            <TutorialIcon /> Tutorial
                        </div>
                        <div aria-hidden className={`w-full ${baseLinkClasses} bg-[#262A34]`} onClick={() => setFaqsModalVisible(true)}>
                            <FaqIcon /> FAQs
                        </div>
                    </div>
                    <div className="anim-border-box anim-border-boxself ">
                        <div aria-hidden className={`${baseLinkClasses} ${darkerBg} waifu-icon-doodle `} onClick={() => handleLinkClick("https://t.me/+MY05JTTJxpc0N2Vh")}>
                            <TelegramIcon /> Join Zoe's Telegram Channel 
                            <span className="waifu-icon">
                                <img src={telegram_image} alt="telegram" />
                            </span>
                        </div>
                    </div>
                    <div aria-hidden className={`${baseLinkClasses} ${darkerBg}`} onClick={() => handleLinkClick("https://facebook.com/oppaidragonofficial")}>
                        <FacebookIcon /> Follow me on Facebook!
                    </div>
                    <div aria-hidden className={`${baseLinkClasses} ${darkerBg}`} onClick={() => handleLinkClick("https://instagram.com/oppaidragonofficial")}>
                        <InstagramIcon /> Follow me on Instagram!
                    </div>
                    <div aria-hidden className={`${baseLinkClasses} ${darkerBg}`} onClick={() => handleShare()}>
                        <ShareIcon /> Share Oppai Dragon with friends!
                    </div>
                    <a className={`${baseLinkClasses} ${darkerBg}`} href="mailto:zoe@oppaidragon.com">
                        <HelpIcon /> Help @ Zoe
                    </a>
                    <Button className="!mt-3 !py-3.5 !text-base !font-bold uppercase" loading={loading} type="primary" onClick={() => performLogout()}>
                        LOG OUT
                    </Button>
                </div>
            </div>
            {changePassword && <ChangePasswordModal handleOk={handleOk} open={changePassword} />}
            {tutorialModalVisible && <TutorialModal handleOk={handleTutorialOk} open={tutorialModalVisible} />}
            {faqsModalVisible && <FaqsModal handleOk={handleFaqsOk} open={faqsModalVisible} />}
        </>
    );
};

export default Account;
