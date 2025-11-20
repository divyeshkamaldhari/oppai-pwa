import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatAvatar, getLocalizedString } from "@cometchat/chat-uikit-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { COMETCHAT_CONSTANTS } from "../../AppConstants";
import ban_icon from "../../assets/ban_icon.svg";
import gift_icon from "../../assets/gift_icon.svg";
import share_icon from "../../assets/share_icon.svg";
import { OppaiDragonUserRole } from "../../constant/AppUserRole";
import "../../styles/CometChatDetails/CometChatUserDetails.css";
import main_logo from "../../../../assets/opaiLogo.png";
import LeftArrow from "../../../../assets/Icons/LeftArrow";
import { APP_ROUTE } from "../../../../constants/AppRoutes";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../../../redux";
import GiftIcon from "../../../../assets/Icons/GiftIcon";
import BanIcon from "../../../../assets/Icons/BanIcon";
import ShareLoveIcon from "../../../../assets/Icons/ShareLoveIcon";
import { FRONTEND_BASE_URL } from "../../../../constants/EnvConstants";
import { AppContext } from "../../context/AppContext";

interface UserDetailProps {
    user: CometChat.User;
    onHide?: () => void;
    actionItems?: {
        name: string;
        icon: string;
        id?: string;
    }[];
    showStatus?: boolean;
    onUserActionClick?: (item: { name: string; icon: string }) => void;
}

export const CometChatUserDetails = (props: UserDetailProps) => {
    const { user, onHide = () => {}, actionItems = [], showStatus, onUserActionClick = () => {} } = props;
    const { userDetail } = useAppSelector((state) => state.user);
    const { messageActive } = useContext(AppContext);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [bioText, setBioText] = useState<string>("");
    const filteredActionItems = actionItems.filter((item) => item.id !== "delete_chat");
    const navigate = useNavigate();
    const muteChat = async (currentUid: string, targetUid: string) => {
        const url = `https://${COMETCHAT_CONSTANTS.APP_ID}.api-${COMETCHAT_CONSTANTS.REGION}.cometchat.io/${COMETCHAT_CONSTANTS.COMET_CHAT_API_VERSION}/notifications/v1/preferences/mute?uid=${currentUid}`;
        const muteUntil = Date.now() + 24 * 60 * 60 * 1000;

        const payload = {
            conversations: [
                {
                    id: targetUid,
                    type: "oneOnOne",
                    until: muteUntil,
                },
            ],
        };

        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                appId: COMETCHAT_CONSTANTS.APP_ID,
                apiKey: COMETCHAT_CONSTANTS.REST_API_KEY,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Mute failed");
        return res.json();
    };

    const unmuteChat = async (currentUid: string, targetUid: string) => {
        const url = `https://${COMETCHAT_CONSTANTS.APP_ID}.api-${COMETCHAT_CONSTANTS.REGION}.cometchat.io/${COMETCHAT_CONSTANTS.COMET_CHAT_API_VERSION}/notifications/v1/preferences/mute?uid=${currentUid}`;

        const payload = {
            conversations: [
                {
                    id: targetUid,
                    type: "oneOnOne",
                },
            ],
        };

        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                appId: COMETCHAT_CONSTANTS.APP_ID,
                apiKey: COMETCHAT_CONSTANTS.REST_API_KEY,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Unmute failed");
        return res.json();
    };

    const toggleMute = async () => {
        try {
            setLoading(true);
            const currentUser = await CometChat.getLoggedinUser();
            const currentUid = currentUser?.getUid();
            const targetUid = user.getUid();

            if (!currentUid || !targetUid) throw new Error("UIDs missing");

            if (isMuted) {
                await unmuteChat(currentUid, targetUid);
                setIsMuted(false);
                window.dispatchEvent(
                    new CustomEvent("muteStatusChanged", {
                        detail: {
                            type: "unmuted",
                            uid: targetUid,
                            by: currentUid,
                        },
                    }),
                );
                toast.success("Chat has been unmuted successfully.", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                });
            } else {
                await muteChat(currentUid, targetUid);
                window.dispatchEvent(
                    new CustomEvent("muteStatusChanged", {
                        detail: {
                            type: "muted",
                            uid: targetUid,
                            by: currentUid,
                        },
                    }),
                );
                setIsMuted(true);
                toast.success("Chat has been muted successfully.", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                });
            }
        } catch (err) {
            console.error("Mute toggle failed:", err);
            toast.error("Failed to update mute status. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getMutedConversations = async (currentUid: string) => {
        const res = await fetch(
            `https://${COMETCHAT_CONSTANTS.APP_ID}.api-${COMETCHAT_CONSTANTS.REGION}.cometchat.io/${COMETCHAT_CONSTANTS.COMET_CHAT_API_VERSION}/notifications/v1/preferences/mute?uid=${currentUid}`,
            {
                headers: {
                    appId: COMETCHAT_CONSTANTS.APP_ID,
                    apiKey: COMETCHAT_CONSTANTS.REST_API_KEY,
                },
            },
        );

        const data = await res.json();
        return data?.data?.mutedConversations ?? [];
    };
    const checkUser = async () => {
        const userBios: Record<string, string> = {
            users_13: "Hey Otaku! Text me now! - Zoe, Creator of Oppai Dragon 💖",
            users_28: "You are my darling now - Code: 002, Strelizia Pilot 💖",
            users_29: "Ara, Ara! Become my pawn - Crimson Heiress, Devil Royalty 💖",
            users_30: "You're so adorable when you're flustered - Thunder Priestess, Vice President 💖",
            users_31: "I'll fight for you, no matter what - Demon Princess, Bamboo Girl 💖",
            users_32: "I'll support you, no matter what - Oni Maid, Morning Star 💖",
            users_33: "I won't hold back, so don't either - YoRHa No. 2 Type B, Combat Android 💖",
            users_34: "Submit, and I might spare you - General of the North, Ice Queen 💖",
            users_35: "I won't let anyone have you - Titan Slayer, Elite Scout 💖",
            users_36: "I am unworthy, Oppai Dragon - Overseer of Guardians, Guild Loyalist 💖",
        };
        const selectedUserUid = user.getUid();
        setBioText(userBios[selectedUserUid]);
        const loggedInUser = await CometChat.getLoggedinUser();

        if (!loggedInUser) {
            setLoading(false);
            return;
        }

        const currentUid = loggedInUser.getUid();
        const targetUid = user.getUid();

        setUserRole(loggedInUser.getRole?.());

        const mutedConversations = await getMutedConversations(currentUid);
        const isTargetMuted = mutedConversations.some((c: any) => c.id === targetUid && c.type === "oneOnOne");
        setIsMuted(isTargetMuted);
        setLoading(false);
    };

    useEffect(() => {
        checkUser();
    }, [user]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Chat with your waifu! | Oppai Dragon",
                    text: "Chat with your waifu, rise as the Oppai Dragon! One-on-one chats and epic content drops. Your fave waifus and new faces too. Cuz it’s for otakus!",
                    url: FRONTEND_BASE_URL,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            alert("Sharing is not supported in this browser.");
        }
    };

    const handleOpenGiftPage = () => {
        navigate(APP_ROUTE.GIFT);
    };

    const formatContentType = (contentType: string) => {
        if (!contentType) return "";

        if (contentType.toUpperCase() === "H!ANIME") {
            return "Hentai";
        }

        return contentType.charAt(0).toUpperCase() + contentType.slice(1).toLowerCase();
    };

    const handleOpenCollectionPage = () => {
        navigate(
            `${APP_ROUTE.VAULT_VIEW_collection}/${userDetail?.user_chat_waifus?.commetchat_waifu_user?.display_name} x ${formatContentType(userDetail.content_type)}`,
        );
    };

    const bioOtherAction = [
        {
            className: "gift_action",
            icon: GiftIcon,
            alt: "Gift Icon",
            label: "Shower me with your love!",
            onClickFunction: handleOpenGiftPage,
        },
        {
            className: "ban_action",
            icon: BanIcon,
            alt: "Ban Icon",
            label: "Grab all my lewd content!",
            onClickFunction: handleOpenCollectionPage,
        },
        {
            className: "share_action",
            icon: ShareLoveIcon,
            alt: "Share Icon",
            label: "Share Oppai Dragon now!",
            wrapperClass: "main-action-wrpr",
            onClickFunction: handleShare,
        },
    ];

    return (
        <>
            <div className="cometchat-user-details__header">
                {/* <div className="cometchat-user-details__header-icon" onClick={onHide} aria-hidden="true" /> */}
                {/* <div className="cometchat-user-details__header-text">{getLocalizedString("my_bio")}</div> */}
                <div className="pwa-back-btn-custom" onClick={onHide} aria-hidden="true">
                    <LeftArrow />
                </div>
                <div className="cometchat-user-details__header-text">
                    <img src={main_logo} alt="Oppai Dragon" className="custom-site-logo" />
                </div>
            </div>

            <div className="cometchat-user-details__content">
                <div className="cometchat-user-details__content-avatar">
                    {messageActive === "online" && <div className={`status-dot cometchat-user-details__content-description online`}></div>}

                    <CometChatAvatar
                        // image={userDetail?.user_chat_waifus?.commetchat_waifu_user?.user_avatar?.match(/src=['"]([^'"]+)['"]/)?.[1] ?? ""}
                        image={user.getAvatar()}
                        name={user.getName()}
                    />
                </div>

                <div className="cometchat-user-details__user-info-wrap">
                    <div className="pwa-cometchat-user-details-wrap">
                        <div className="cometchat-user-details__content-title">{user.getName()}</div>

                        {/* {showStatus && (
                            <div>
                                <div
                                    className={`cometchat-user-details__content-description ${user.getStatus?.().toLowerCase() === "offline"
                                        ? "offline"
                                        : "online"
                                        }`}
                                >
                                    {getLocalizedString(
                                        `message_header_status_${user.getStatus?.().toLowerCase()}`
                                    )}
                                </div>
                            </div>
                        )} */}
                        <p className="pwa-cometchat-user-details__bio-subtext">{userDetail?.user_chat_waifus?.commetchat_waifu_user?.waifu_title ?? ""}</p>
                        <div className="cometchat-user-details__bio-text">{userDetail?.user_chat_waifus?.commetchat_waifu_user?.waifu_sub_title ?? ""}</div>
                    </div>

                    <div className="bio-other-actions">
                        {bioOtherAction.map((action) => (
                            <div className="bio-other-actions__btn-wrap" key={action.className}>
                                <div
                                    aria-hidden
                                    className={`bio_action ${action.wrapperClass || ""} ${action.className}`}
                                    onClick={action?.onClickFunction ? action?.onClickFunction : () => {}}
                                >
                                    <action.icon />
                                    {action.label}
                                </div>
                            </div>
                        ))}
                    </div>
                    {(userRole === OppaiDragonUserRole.CHAT_APP.ADMIN || userRole === OppaiDragonUserRole.CHAT_APP.WAIFU_USER) && (
                        <div className="cometchat-user-details__btn-wrap">
                            <div className="main-action-wrpr">
                                <div className="cometchat-user-details__mute-toggle">
                                    {(() => {
                                        let muteButtonText = "";
                                        if (loading) {
                                            muteButtonText = "Updating...";
                                        } else if (isMuted) {
                                            muteButtonText = "Unmute Chat";
                                        } else {
                                            muteButtonText = "Mute Chat";
                                        }
                                        return (
                                            <button onClick={toggleMute} className={`mute-button ${isMuted ? "muted" : ""}`} disabled={loading}>
                                                {muteButtonText}
                                            </button>
                                        );
                                    })()}
                                </div>

                                <div className="oppai-dragon-comet-chat-user-actions">
                                    <div className="cometchat-user-details__content-action">
                                        {filteredActionItems.map((actionItem) => (
                                            <div
                                                key={actionItem.name}
                                                className="cometchat-user-details__content-action-item"
                                                onClick={() => onUserActionClick(actionItem)}
                                                aria-hidden="true"
                                            >
                                                <div
                                                    className="cometchat-user-details__content-action-item-icon"
                                                    style={
                                                        actionItem.icon
                                                            ? {
                                                                  WebkitMask: `url(${actionItem.icon}) center center no-repeat`,
                                                              }
                                                            : undefined
                                                    }
                                                />
                                                <div className="cometchat-user-details__content-action-item-text">{actionItem.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
