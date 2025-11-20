import { CometChat } from "@cometchat/chat-sdk-javascript";
import {
    CalendarObject,
    CometChatMessageComposer,
    CometChatMessageEvents,
    CometChatMessageHeader,
    CometChatMessageList,
    CometChatMessageTemplate,
    CometChatUIKit,
    CometChatUIKitConstants,
    CometChatUIKitLoginListener,
    CometChatUserEvents,
    getLocalizedString,
    isMessageSentByMe,
    MessageBubbleAlignment,
    MessageReceiptUtils,
    Receipts,
} from "@cometchat/chat-uikit-react";
import { JSX, useEffect, useState } from "react";
import "../../styles/CometChatMessages/CometChatMessages.css";
import "../../styles/CometChatMessages/MessageComposer.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { CustomMessageHeader } from "../CustomMessageHeader/CustomMessageHeader";
import { COMETCHAT_CONSTANTS } from "../../AppConstants";
import { OppaiDragonUserRole } from "../../constant/AppUserRole";
import { CometChatSoundManager } from "../../utils/soundManager";
import blockIcon from "../../assets/block.svg";
import sentIcon from "../../assets/message-sent.svg";
import deliveredIcon from "../../assets/message-delivered.svg";
import readIcon from "../../assets/message-read.svg";
import UnlockChatModal from "../Modals/UnlockChatModal";
import { useAppSelector } from "../../../../redux";
import PixelatedImage from "./PixelatedImage";
import { isIphoneSafariOrChrome, isPWA } from "../../../../utils";
import ChatImagePreviewModal from "./../Modals/ChatImagePreviewModal";
import { API_URL } from "./../../../../constants/ApiRoute";

dayjs.extend(utc);
dayjs.extend(timezone);

interface MessagesViewProps {
    user?: CometChat.User;
    group?: CometChat.Group;
    headerMenu: () => JSX.Element;
    onThreadRepliesClick: (message: CometChat.BaseMessage) => void;
    showComposer?: boolean;
    isShowBackButton?: boolean;
    onBack?: () => void;
    showSideComponent?: any;
    userRole?: string | null;
}

const BLOCKED_WORDS_KEY = "blocked_words";

export const CometChatMessages = (props: MessagesViewProps) => {
    const { user, group, headerMenu, onThreadRepliesClick, showComposer, isShowBackButton, userRole, showSideComponent, onBack = () => {} } = props;
    const { userDetail } = useAppSelector((state) => state.user);

    const [showComposerState, setShowComposerState] = useState<boolean | undefined>(showComposer);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [templates, setTemplates] = useState<CometChatMessageTemplate[]>([]);
    // add state for chat unlock modal with moderator role specifc  in this itself
    const [isChatUnlocked, setIsChatUnlocked] = useState(false);
    const [isAgeVerified, setIsAgeVerified] = useState(false);
    const [chatImagePreviewUrl, setChatImagePreviewUrl] = useState<string>("");
    const [blockedWords, setBlockedWords] = useState<string[]>(() => {
        // First check sessionStorage
        const storedWords = sessionStorage.getItem(BLOCKED_WORDS_KEY);

        if (storedWords) {
            const parsedWords = JSON.parse(storedWords);
            return parsedWords;
        }
        return [];
    });

    function handleError(error: CometChat.CometChatException) {
        if (error?.code === "ERR_BLOCKED_BY_EXTENSION" && (error as any)?.source === "chat-api") {
            alert("Your message contains words that are not allowed.");
            return;
        }
        throw new Error("error from message composer");
    }

    const onNewMessage = (message: any) => {
        window.dispatchEvent(new CustomEvent("new-message-from-messages", { detail: message }));
    };

    useEffect(() => {
        const messageSentSub = CometChatMessageEvents.ccMessageSent.subscribe((message) => {
            onNewMessage(message);
        });

        return () => messageSentSub.unsubscribe();
    }, []);

    // Initialize sound manager to disable all sounds
    useEffect(() => {
        CometChatSoundManager.initializeSoundSettings().catch((err) => console.warn("Sound settings initialization failed:", err));
        CometChatSoundManager.startAudioMonitoring();
        CometChatSoundManager.forceDisableAllAudio();
    }, []);

    useEffect(() => {
        if (userDetail?.age_verified !== isAgeVerified) {
            setIsAgeVerified(userDetail?.age_verified);
        }
    }, [userDetail?.age_verified]);

    useEffect(() => {
        setIsChatUnlocked(userDetail?.chat_purchase);
    }, [userDetail?.chat_purchase]);

    useEffect(() => {
        setShowComposerState(showComposer);
        if (user?.getBlockedByMe?.()) {
            setShowComposerState(false);
        }
    }, [user, showComposer]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // Then fetch fresh data
        // Convert to Date object
        const date = new Date(userDetail.created_by ? userDetail.created_by : "");
        const userCreatedAt = Math.floor(date.getTime() / 1000);

        fetch(API_URL.USER.BAN_KEYWORDS)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data.keywords)) {
                    const words = data.keywords.map((word: string) => String(word));
                    setBlockedWords(words);
                    sessionStorage.setItem(BLOCKED_WORDS_KEY, JSON.stringify(words));
                }
            })
            .catch((error) => {
                // console.error("Failed to fetch blocked words:", error);
                // If fetch fails and no stored words, set empty array
                if (!sessionStorage.getItem(BLOCKED_WORDS_KEY)) {
                    setBlockedWords([]);
                }
            });
        let definedTemplates = CometChatUIKit.getDataSource().getAllMessageTemplates();
        const template = definedTemplates.map((t) => {
            // Text message template
            if (t.type === CometChatUIKitConstants.MessageTypes.text && t.category === CometChatUIKitConstants.MessageCategory.message) {
                t.bubbleView = (message: any, alignment: MessageBubbleAlignment) => {
                    const isSentByMe = isMessageSentByMe(message, CometChatUIKitLoginListener.getLoggedInUser()!);
                    let textMessage = "";
                    if (message.getText) {
                        textMessage = message.getText();
                    }
                    // Moderation logic
                    const moderationStatus = message.data.moderation?.status;
                    const isBlocked = containsBlockedWord(textMessage);
                    let statusIcon = sentIcon;
                    let statusAlt = "sent";
                    if (isSentByMe) {
                        if (message.getReadAt && message.getReadAt() > 0) {
                            statusIcon = readIcon;
                            statusAlt = "read";
                        } else if (message.getDeliveredAt && message.getDeliveredAt() > 0) {
                            statusIcon = deliveredIcon;
                            statusAlt = "delivered";
                        }
                    }
                    if (moderationStatus === "disapproved" || isBlocked) {
                        statusIcon = blockIcon;
                        statusAlt = "blocked";
                    }
                    // const isMessageTimeMoreThanUserCreate = message.sentAt >= userCreatedAt || false;
                    // if (isMessageTimeMoreThanUserCreate) {
                    return (
                        <div
                            className={`bubble-view ${isSentByMe ? "bubble-view__outgoing" : "bubble-view__incoming"} ${message.sender?.role?.toLowerCase()}`}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: isSentByMe ? "flex-end" : "flex-start",
                                margin: "8px 0",
                            }}
                        >
                            <div
                                className="bubble-view__content pwd-bubble-view_textContent"
                                style={{
                                    // background: isSentByMe ? "#5217BA" : "#fff",
                                    // color: isSentByMe ? "#fff" : "#222",
                                    // borderRadius: "20px",
                                    // padding: "10px 16px",
                                    maxWidth: "340px",
                                    minWidth: "100px",
                                    // boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                                    wordBreak: "break-word",
                                }}
                            >
                                <div className="bubble-view__content__text">{textMessage}</div>
                                <div className="bubble-view__content__time ">
                                    {formatTime(message.getSentAt())}
                                    {isSentByMe && <img src={statusIcon} alt={statusAlt} />}
                                </div>
                            </div>
                        </div>
                    );
                    // } else {
                    //     return <div></div>;
                    // }
                };
                return t;
            }
            // Image message template
            if (t.type === CometChatUIKitConstants.MessageTypes.image && t.category === CometChatUIKitConstants.MessageCategory.message) {
                t.bubbleView = (message: any, alignment: MessageBubbleAlignment) => {
                    const isSentByMe = isMessageSentByMe(message, CometChatUIKitLoginListener.getLoggedInUser()!);
                    const moderationStatus = message.data.moderation?.status;
                    let statusIcon = sentIcon;
                    let statusAlt = "sent";
                    if (isSentByMe) {
                        if (message.getReadAt && message.getReadAt() > 0) {
                            statusIcon = readIcon;
                            statusAlt = "read";
                        } else if (message.getDeliveredAt && message.getDeliveredAt() > 0) {
                            statusIcon = deliveredIcon;
                            statusAlt = "delivered";
                        }
                    }
                    if (moderationStatus === "disapproved") {
                        statusIcon = blockIcon;
                        statusAlt = "blocked";
                    }
                    const imageUrl = message.getAttachment && message.getAttachment().url;
                    // const isMessageTimeMoreThanUserCreate = message.sentAt >= userCreatedAt || false;
                    // if (isMessageTimeMoreThanUserCreate) {
                    return (
                        <div
                            className={`bubble-view ${isSentByMe ? "bubble-view__outgoing" : "bubble-view__incoming"}`}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: isSentByMe ? "flex-end" : "flex-start",
                                margin: "8px 0",
                            }}
                            onClick={() => {
                                isAgeVerified ? setChatImagePreviewUrl(imageUrl) : null;
                            }}
                        >
                            <div
                                className="bubble-view__content pwd-bubble-view_imgContent"
                                style={{
                                    background: isSentByMe ? "#7B5AED" : "#fff",
                                    color: isSentByMe ? "#fff" : "#222",
                                    // borderRadius: "18px",
                                    // padding: "8px",
                                    maxWidth: "340px",
                                    minWidth: "60px",
                                    // boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                                    // display: "flex",
                                    // justifyContent: "center",
                                    // alignItems: "center",
                                }}
                            >
                                {isAgeVerified ? (
                                    <img
                                        className="object-contain object-center"
                                        src={imageUrl}
                                        alt="sent-img"
                                        style={{
                                            maxWidth: "260px",
                                            maxHeight: "260px",
                                            borderRadius: "17px",
                                            display: "block",
                                            // filter: isAgeVerified ? "none" : "blur(5px)",
                                            // pointerEvents: isAgeVerified ? "auto" : "none",
                                            // userSelect: isAgeVerified ? "auto" : "none",
                                        }}
                                    />
                                ) : (
                                    <PixelatedImage imageUrl={imageUrl} />
                                )}
                                <div className="bubble-view__content__time">
                                    {formatTime(message.getSentAt())}
                                    {isSentByMe && <img src={statusIcon} alt={statusAlt} />}
                                </div>
                            </div>
                        </div>
                    );
                    // } else {
                    //     return <div></div>;
                    // }
                };
                return t;
            }
            return t;
        });
        setTemplates(template);
    }, [isAgeVerified]);

    useEffect(() => {
        async function markConversationAsRead() {
            let conversationId, conversationType;
            if (user) {
                conversationId = user.getUid();
                conversationType = CometChat.RECEIVER_TYPE.USER;
            } else if (group) {
                conversationId = group.getGuid();
                conversationType = CometChat.RECEIVER_TYPE.GROUP;
            } else {
                return;
            }

            // Fetch the conversation to get the last message
            const conversation = await CometChat.getConversation(conversationId, conversationType);
            const lastMessage = conversation.getLastMessage();
            if (lastMessage) {
                CometChat.markAsRead(lastMessage);
            }
        }
        markConversationAsRead();
    }, [user, group]);

    // function containsBlockedWord(text: string): boolean {
    //     const lowerText = text.toLowerCase();
    //     const blockkey = sessionStorage.getItem(BLOCKED_WORDS_KEY);
    //     if (!blockkey) return false;
    //     const words = JSON.parse(blockkey);
    //     return words.some((word: string) => lowerText.includes(word.toLowerCase()));
    // }

    function containsBlockedWord(text: string): boolean {
        const blockkey = sessionStorage.getItem(BLOCKED_WORDS_KEY);
        if (!blockkey) return false;

        const words: string[] = JSON.parse(blockkey);
        const lowerText = text.toLowerCase();

        // Escape regex special characters
        const escapeRegex = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        // Build regex with word boundaries
        const regex = new RegExp(`\\b(${words.map(escapeRegex).join("|")})\\b`, "i");

        return regex.test(lowerText);
    }
    function getDateFormat() {
        return new CalendarObject({
            today: "Last seen hh:mm A (ET)",
            yesterday: "Last seen [Yesterday] (ET)",
            otherDays: "Last seen MMMM D, h:mm A (ET)",
        });
    }

    function EnhanceClickableProfile({ enable = false }) {
        useEffect(() => {
            if (!enable) return;

            const interval = setInterval(() => {
                const avatar = document.querySelector(".cometchat-avatar__image") as HTMLElement | null;
                const name = document.querySelector(".cometchat-list-item__body-title") as HTMLElement | null;
                const subtitle = document.querySelector(".cometchat-message-header__subtitle") as HTMLElement | null;
                const info = document.querySelector(".cometchat-header__info") as HTMLElement | null;

                if (avatar && subtitle && info && name) {
                    avatar.style.cursor = "pointer";
                    subtitle.style.cursor = "pointer";
                    name.style.cursor = "pointer";

                    const triggerClick = () => info.click();

                    avatar.onclick = triggerClick;
                    subtitle.onclick = triggerClick;
                    name.onclick = triggerClick;

                    clearInterval(interval);
                }
            }, 300);
            return () => clearInterval(interval);
        }, [enable]);
        return null;
    }
    const userRole1 = window.localStorage.getItem("userRole");
    const listBodyElement = document.querySelector(".cometchat-list__body") as HTMLElement | null;
    if (listBodyElement) {
        userRole1 == "subscriber" && listBodyElement.classList.add("subscriber-list-body");
    }

    // Add custom bubble view for messages
    const formatTime = (timestamp: number): string => {
        const date = new Date(timestamp * 1000); // Convert to milliseconds
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
        return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    return (
        <div className="cometchat-messages-wrapper">
            <div className="cometchat-header-wrapper">
                <EnhanceClickableProfile enable={!!user?.getUid()} />
                {userRole1 === OppaiDragonUserRole.CHAT_APP.WAIFU_USER || userRole1 === OppaiDragonUserRole.CHAT_APP.ADMIN ? (
                    <>
                        <CometChatMessageHeader
                            user={user}
                            group={group}
                            auxiliaryButtonView={headerMenu()}
                            onBack={onBack}
                            showBackButton={isShowBackButton && isMobile}
                            hideVideoCallButton={true}
                            hideVoiceCallButton={true}
                            lastActiveAtDateTimeFormat={getDateFormat()}
                        />
                    </>
                ) : (
                    <CustomMessageHeader user={user} group={group} onBack={onBack} showSideComponent={showSideComponent} />
                )}
            </div>
            <div className="cometchat-message-list-wrapper">
                <CometChatMessageList
                    user={user}
                    group={group}
                    hideDateSeparator={false}
                    hideStickyDate={false}
                    showScrollbar={true}
                    separatorDateTimeFormat={new CalendarObject({
                      today: 'Today',
                      yesterday: 'Yesterday',
                      otherDays: 'MMM D, YYYY',
                    })}
                    stickyDateTimeFormat={new CalendarObject({
                      today: 'Today',
                      yesterday: 'Yesterday',
                      otherDays: 'MMM D, YYYY',
                    })}
                    onThreadRepliesClick={(message: any) => onThreadRepliesClick(message)}
                    templates={templates}
                />
            </div>
            {isChatUnlocked &&
                (showComposerState ? (
                    <div className={`cometchat-composer-wrapper ${isIphoneSafariOrChrome() && isPWA() ? "pb-11" : "pb-5"}`}>
                        <CometChatMessageComposer
                            user={user}
                            group={group}
                            onError={handleError}
                            hideImageAttachmentOption={CometChatUIKitLoginListener.getLoggedInUser()?.getRole() !== "waifu" ? true : false}
                            hideVideoAttachmentOption={CometChatUIKitLoginListener.getLoggedInUser()?.getRole() !== "waifu" ? true : false}
                            hideAudioAttachmentOption={CometChatUIKitLoginListener.getLoggedInUser()?.getRole() !== "waifu" ? true : false}
                            hideFileAttachmentOption={CometChatUIKitLoginListener.getLoggedInUser()?.getRole() !== "waifu" ? true : false}
                            disableSoundForMessage={true}
                            hideVoiceRecordingButton={true}
                            hideEmojiKeyboardButton={false}
                        />
                    </div>
                ) : (
                    <div
                        className="message-composer-blocked"
                        onClick={() => {
                            if (user) {
                                CometChat.unblockUsers([user?.getUid()]).then(() => {
                                    user.setBlockedByMe(false);
                                    CometChatUserEvents.ccUserUnblocked.next(user);
                                });
                            }
                        }}
                    >
                        <div className="message-composer-blocked__text">
                            {getLocalizedString("cannot_send_to_blocked_user")} <a href="#"> {getLocalizedString("click_to_unblock")}</a>
                        </div>
                    </div>
                ))}
            {!isChatUnlocked && <UnlockChatModal />}
            {chatImagePreviewUrl && <ChatImagePreviewModal chatImagePreviewUrl={chatImagePreviewUrl} setChatImagePreviewUrl={setChatImagePreviewUrl} />}
        </div>
    );
};
