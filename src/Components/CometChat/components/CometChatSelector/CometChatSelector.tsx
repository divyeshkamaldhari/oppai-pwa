import { Call, CometChat, Conversation, Group, User } from "@cometchat/chat-sdk-javascript";
import {
    CometChatAvatar,
    CometChatConversations,
    CometChatMessageEvents,
    CometChatOption,
    CometChatUIKitLoginListener,
    CometChatUsers,
} from "@cometchat/chat-uikit-react";
import React, { Dispatch, SetStateAction, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { COMETCHAT_CONSTANTS } from "../../AppConstants";
import muteIcon from "../../assets/MuteIcon.svg";
import userIcon from "../../assets/user.svg";
import "../../styles/CometChatSelector/CometChatSelector.css";
import FriendListItem from "../FriendListItem/FriendListItem";
import { OppaiDragonUserRole } from "../../constant/AppUserRole";
import mainLogo from "../../assets/main_logo.svg";
import { AppContext } from "../../context/AppContext";
import { useAppSelector } from "../../../../redux";

export interface Friend {
    uid: string;
    name: string;
    avatar?: string;
    status?: string;
    hasBlockedMe?: boolean;
    blockedByMe?: boolean;
    statusMessage?: string;
    role?: string;
    lastActiveAt?: number;
    conversationId?: string;
    deactivatedAt?: number;
}

interface SelectorProps {
    group?: Group;
    showJoinGroup?: boolean;
    activeTab?: string;
    activeItem?: User | Group | Conversation | Call;
    onSelectorItemClicked?: (input: User | Group | Conversation | Call, type: string) => void;
    onProtectedGroupJoin?: (group: Group) => void;
    showCreateGroup?: boolean;
    setShowCreateGroup?: Dispatch<SetStateAction<boolean>>;
    onHide?: () => void;
    onNewChatClicked?: () => void;
    onGroupCreated?: (group: Group) => void;
    selectedUserUuid: String;
}

export const CometChatSelector = (props: SelectorProps, selectedUserUuid: string) => {
    const { userDetail } = useAppSelector((state) => state.user);
    const {
        group,
        showJoinGroup,
        activeItem,
        activeTab,
        onSelectorItemClicked = () => {},
        onProtectedGroupJoin = () => {},
        showCreateGroup,
        setShowCreateGroup = () => {},
        onHide = () => {},
        onNewChatClicked = () => {},
        onGroupCreated = () => {},
    } = props;

    const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>();
    const [defaultUser, setDefaultUser] = useState<CometChat.User | null>();
    const navigate = useNavigate();
    const { setAppState } = useContext(AppContext);
    const [blockedUsers, setBlockedUsers] = useState<Set<string>>(new Set());
    const [refreshConversations, setRefreshConversations] = useState(0);
    const [mutedUsers, setMutedUsers] = useState<Set<string>>(new Set());
    
    // AFK Message System State
    const [userMessageCount, setUserMessageCount] = useState(0);
    const [lastWaifuReplyTime, setLastWaifuReplyTime] = useState<number>(Date.now());
    const [afkTimeoutId, setAfkTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const isSendingAFKRef = useRef(false); // Prevent duplicate AFK messages
    const lastAFKSentRef = useRef<{ userId: string; timestamp: number } | null>(null); // Track last AFK message sent
    const userMessageCountRef = useRef(0); // Track message count synchronously
    const processedMessagesRef = useRef<Set<string>>(new Set()); // Track processed messages to prevent duplicates

    useEffect(() => {
        const fetchMutedUsers = async () => {
            try {
                const loggedInUser = await CometChat.getLoggedinUser();
                if (!loggedInUser) throw new Error("User not logged in");

                const uid = loggedInUser.getUid();

                const res = await fetch(
                    `https://${COMETCHAT_CONSTANTS.APP_ID}.api-${COMETCHAT_CONSTANTS.REGION}.cometchat.io/${COMETCHAT_CONSTANTS.COMET_CHAT_API_VERSION}/notifications/v1/preferences/mute?uid=${uid}`,
                    {
                        headers: {
                            accept: "application/json",
                            apikey: COMETCHAT_CONSTANTS.REST_API_KEY,
                            "content-type": "application/json",
                        },
                    },
                );

                const result = await res.json();
                const muted = result?.data?.mutedConversations || [];
                const ids = new Set<string>(muted.map((m: any) => m.id as string));
                setMutedUsers(ids);
            } catch (err) {
                console.error("Failed to fetch muted users", err);
            }
        };

        fetchMutedUsers();
    }, []);

    useEffect(() => {
        const handleConversationUpdate = () => {
            setRefreshConversations((prev) => prev + 1);
        };

        window.addEventListener("conversationUpdated", handleConversationUpdate);

        return () => {
            window.removeEventListener("conversationUpdated", handleConversationUpdate);
        };
    }, []);

    // useEffect(() => {
    //     const handleConversationUpdate = (e: any) => {
    //         const updatedConversation = e.detail;
    //         //console.log("External conversation update triggered:", updatedConversation);
    //     };

    //     window.addEventListener("conversationUpdated", handleConversationUpdate);

    //     return () => {
    //         window.removeEventListener("conversationUpdated", handleConversationUpdate);
    //     };
    // }, []);

    const getOptions = (): CometChatOption[] => [
        new CometChatOption({
            id: "logged-in-user",
            title: loggedInUser?.getName() ?? "",
            iconURL: userIcon,
        }),
    ];

    const conversationsHeaderView = () => {
        return (
            <div className="cometchat-conversations-header">
                <a
                    href="/account"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "10px" }}
                    className="clickable-logo cometchat-conversations-header__title"
                >
                    <img src={mainLogo} alt="Oppai App Logo" style={{ height: "35px", objectFit: "contain" }} />
                </a>
            </div>
        );
    };

    // // Check if any waifu users are online
    // const checkWaifuOnlineStatus = useCallback(async (): Promise<boolean> => {
    //     try {
    //         const usersRequest = new CometChat.UsersRequestBuilder()
    //             .setLimit(100)
    //             .build();
            
    //         const users = await usersRequest.fetchNext();
    //         const waifuUsers = users.filter(user => 
    //             user.getRole() === OppaiDragonUserRole.CHAT_APP.WAIFU_USER
    //         );
            
    //         // Check if any waifu is online
    //         return waifuUsers.some(waifu => waifu.getStatus() === "online");
    //     } catch (error) {
    //         console.error("Error checking waifu online status:", error);
    //         return false;
    //     }
    // }, []);

    // Check if AFK message should be sent
    // const shouldSendAFKMessage = useCallback(async (currentMessageCount: number): Promise<boolean> => {
    //     // Check if any waifu is online - if online, don't send AFK
    //     const isAnyWaifuOnline = await checkWaifuOnlineStatus();
    //     console.log("isAnyWaifuOnline", isAnyWaifuOnline);
    //     if (isAnyWaifuOnline) {
    //         return false; // Don't send AFK if any waifu is online
    //     }
        
    //     // Check time-based condition (1 hour since last waifu activity)
    //     const oneHourAgo = Date.now() - (2 * 60 * 1000);
    //     const hasBeenOneHour = lastWaifuReplyTime < oneHourAgo;
    //     console.log("hasBeenOneHour", hasBeenOneHour);
    //     console.log("oneHourAgo", oneHourAgo);
    //     console.log("currentMessageCount", currentMessageCount);
        
    //     // Check message count condition (10 consecutive user messages)
    //     const hasTenMessages = currentMessageCount === 10;
        
    //     // Send AFK if EITHER condition is met (whichever happens first)
    //     return hasBeenOneHour || hasTenMessages;
    // }, [checkWaifuOnlineStatus, lastWaifuReplyTime]);

    // const sendAutoReply = useCallback(async (receiverId: string, senderId: string, currentMessageCount: number) => {
    //     // Prevent duplicate AFK messages - check if we're already sending
    //     if (isSendingAFKRef.current) {
    //         console.log("AFK message already being sent, skipping...");
    //         return;
    //     }

    //     // Check if we just sent an AFK message to this user recently (within last 5 seconds)
    //     const now = Date.now();
    //     if (lastAFKSentRef.current && 
    //         lastAFKSentRef.current.userId === senderId && 
    //         (now - lastAFKSentRef.current.timestamp) < 5000) {
    //         console.log("AFK message already sent to this user recently, skipping...");
    //         return;
    //     }

    //     // Check if we should send AFK message based on new logic
    //     const shouldSendAFK = await shouldSendAFKMessage(currentMessageCount);
    //     console.log("shouldSendAFK", shouldSendAFK);
    //     if (!shouldSendAFK) {
    //         return; // Don't send AFK message
    //     }

    //     // Set flag to prevent duplicate sends
    //     isSendingAFKRef.current = true;

    //     try {
    //         // Send AFK message with new content
    //         const sendMessageBaseUrl = `https://${COMETCHAT_CONSTANTS.APP_ID}.api-${COMETCHAT_CONSTANTS.REGION}.cometchat.io/${COMETCHAT_CONSTANTS.COMET_CHAT_API_VERSION}/messages`;
    //         const response = await fetch(sendMessageBaseUrl, {
    //             method: "POST",
    //             headers: {
    //                 accept: "application/json",
    //                 apikey: COMETCHAT_CONSTANTS.REST_API_KEY,
    //                 "content-type": "application/json",
    //                 onBehalfOf: receiverId, // Waifu's ID
    //             },
    //             body: JSON.stringify({
    //                 category: "message",
    //                 type: "text",
    //                 data: {
    //                     text: "Oh no, sweetie, I'm AFK rn! I've been on ~7-11 PM Eastern Time (ET) most days lately. Remember, I'm real, not a bot 🥰 Text me and I'll reply soon! PS: Bored? Check my pics, read my emails, or just swing by later! Urgent Qs? Hit up Zoe via email 💌",
    //                 },
    //                 receiver: senderId,
    //                 receiverType: "user",
    //             }),
    //         });
            
    //         const result = await response.json();

    //         // Mark message as unread
    //         if (result.data) {
    //             const markUnreadUrl = `https://${COMETCHAT_CONSTANTS.APP_ID}.api-${COMETCHAT_CONSTANTS.REGION}.cometchat.io/${COMETCHAT_CONSTANTS.COMET_CHAT_API_VERSION}/users/${senderId}/conversation/read`;

    //             await fetch(markUnreadUrl, {
    //                 method: "DELETE",
    //                 headers: {
    //                     accept: "application/json",
    //                     apikey: COMETCHAT_CONSTANTS.REST_API_KEY,
    //                     "content-type": "application/json",
    //                     onBehalfOf: receiverId, // Waifu's ID
    //                 },
    //                 body: JSON.stringify({
    //                     messageId: result.data.id,
    //                 }),
    //             });

    //             // Reset counters after successfully sending AFK message - only once
    //             userMessageCountRef.current = 0;
    //             setUserMessageCount(0);
    //             setLastWaifuReplyTime(Date.now());
                
    //             // Track that we sent AFK message to this user
    //             lastAFKSentRef.current = {
    //                 userId: senderId,
    //                 timestamp: Date.now()
    //             };
                
    //             // Clear timeout after sending AFK message
    //             if (afkTimeoutId) {
    //                 clearTimeout(afkTimeoutId);
    //                 setAfkTimeoutId(null);
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Error sending AFK message:", error);
    //     } finally {
    //         // Reset flag after a short delay to allow the message to be processed
    //         setTimeout(() => {
    //             isSendingAFKRef.current = false;
    //         }, 2000);
    //     }
    // }, [shouldSendAFKMessage, afkTimeoutId]);

    const isWithinOfficeHours = () => {
        const now = new Date();

        // Get current hour in ET (24-hour format)
        const etHourStr = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York",
            hour: "numeric",
            hour12: false,
        }).format(now);

        const hour = parseInt(etHourStr, 10);
        if (hour >= 2 && hour < 18) {
            return false; // do NOT send
        }

        return true; // send AFK message
    };
    
    const sendAutoReply = useCallback(async (receiverId: string, senderId: string) => {
        console.log("isWithinOfficeHours", isWithinOfficeHours());
        if (!isWithinOfficeHours()) {
            // Message send करें
            const sendMessageBaseUrl = `https://${COMETCHAT_CONSTANTS.APP_ID}.api-${COMETCHAT_CONSTANTS.REGION}.cometchat.io/${COMETCHAT_CONSTANTS.COMET_CHAT_API_VERSION}/messages`;
            const response = await fetch(sendMessageBaseUrl, {
                method: "POST",
                headers: {
                    accept: "application/json",
                    apikey: COMETCHAT_CONSTANTS.REST_API_KEY,
                    "content-type": "application/json",
                    onBehalfOf: receiverId, // Mod की ID
                },
                body: JSON.stringify({
                    category: "message",
                    type: "text",
                    data: {
                        text: "Oh no, sweetie, I'm AFK rn! I've been on ~7-11 PM Eastern Time (ET) most days lately. Remember, I'm real, not a bot 🥰 Text me and I'll reply soon! PS: Bored? Check my pics, read my emails, or just swing by later! Urgent Qs? Hit up Zoe via email 💌",
                    },
                    receiver: senderId,
                    receiverType: "user",
                }),
            });

            const result = await response.json();

            // Unread mark करने के लिए सही parameters
            if (result.data) {
                const markUnreadUrl = `https://${COMETCHAT_CONSTANTS.APP_ID}.api-${COMETCHAT_CONSTANTS.REGION}.cometchat.io/${COMETCHAT_CONSTANTS.COMET_CHAT_API_VERSION}/users/${senderId}/conversation/read`;

                await fetch(markUnreadUrl, {
                    method: "DELETE",
                    headers: {
                        accept: "application/json",
                        apikey: COMETCHAT_CONSTANTS.REST_API_KEY,
                        "content-type": "application/json",
                        onBehalfOf: receiverId, // Mod की ID - जो message का sender है
                    },
                    body: JSON.stringify({
                        messageId: result.data.id,
                    }),
                });
            }
        }
    }, []);

    const handleNewMessage = useCallback(
        async (newMessage: any) => {
            const rawDetail = newMessage;
            const loggedInUser = CometChatUIKitLoginListener.getLoggedInUser();

            if (!rawDetail || !loggedInUser) {
                console.error("Message or logged-in user missing");
                return;
            }

            const message = rawDetail?.message ?? rawDetail;
            const senderId = message?.sender?.uid ?? message?.senderId ?? message?.uid ?? undefined;

            const receiverId = message?.receiver?.uid ?? message?.receiver ?? message?.receiverId ?? undefined;

            const loggedInUserId = loggedInUser.getUid();
            if (
                senderId &&
                receiverId &&
                loggedInUserId !== receiverId &&
                message?.receiverType === CometChat.RECEIVER_TYPE.USER &&
                message?.category === CometChat.CATEGORY_MESSAGE
            ) {
                try {
                    const receiverUser = await CometChat.getUser(receiverId);

                    if (receiverUser?.getRole() === OppaiDragonUserRole.CHAT_APP.WAIFU_USER) {
                        sendAutoReply(receiverId, senderId);
                    }
                } catch (error) {
                    console.error("Failed to fetch receiver user:", error);
                }
            }
        },
        [sendAutoReply],
    );


    const [friends, setFriends] = useState<Friend[]>([]);

    useEffect(() => {
        const limit = 50;
        const friendsRequest = new CometChat.UsersRequestBuilder().setLimit(limit).build();

        friendsRequest.fetchNext().then(
            (userList) => {
                setFriends(userList as Friend[]);
            },
            (error) => {
                console.error("Error fetching friend list:", error);
            },
        );
    }, []);

    useEffect(() => {
        // const DEFAULT_MESSAGE = "Hey 🥰";
        const DEFAULT_RECEIVER_TYPE = CometChat.RECEIVER_TYPE.USER;
        const ZOE_UID =
            (selectedUserUuid ?? userDetail.user_chat_waifus.commetchat_waifu_user?.ID) ? `users_${userDetail.user_chat_waifus.commetchat_waifu_user?.ID}` : ""; // User : Zoe's actual UID

        const initChatWithZoe = async (loggedInUser: CometChat.User) => {
            if (!loggedInUser) return;

            const isSubscriber = loggedInUser.getRole() === "subscriber";
            if (!isSubscriber) return;

            if (ZOE_UID === loggedInUser.getUid()) {
                console.warn("Skipping self conversation load with Zoe");
                return;
            }

            try {
                const conversation = await CometChat.getConversation(ZOE_UID, DEFAULT_RECEIVER_TYPE);
                // const lastMessage = conversation?.getLastMessage();

                // const lastMessageText = lastMessage && "getText" in lastMessage && typeof lastMessage.getText === "function" ? lastMessage.getText() : null;

                // const isMessageInvalid = !lastMessageText || typeof lastMessageText !== "string" || lastMessageText.trim() === "";

                // if (!lastMessage || isMessageInvalid) {
                //     await sendDefaultMessage(ZOE_UID);
                //     return;
                // }
                onSelectorItemClicked(conversation, "updateSelectedItem");
            } catch (error: unknown) {
                // const err = error as { code?: string; status?: number };

                // if (
                //     err?.code === "ERR_CONVERSATION_NOT_FOUND" ||
                //     err?.code === "ERR_CONVERSATION_NOT_ACCESSIBLE" ||
                //     err?.status === 403 ||
                //     err?.status === 404
                // ) {
                //     await sendDefaultMessage(ZOE_UID);
                // } else {
                console.error("Unexpected error fetching Zoe conversation:", error);
                // }
            }
        };

        // const sendDefaultMessage = async (receiverId: string) => {
        //     const textMessage = new CometChat.TextMessage(receiverId, DEFAULT_MESSAGE, DEFAULT_RECEIVER_TYPE);

        //     try {
        //         const sentMsg = await CometChat.sendMessage(textMessage);
        //         //console.log("Hey 🥰 message sent to Zoe:", sentMsg);

        //         setTimeout(async () => {
        //             try {
        //                 const updatedConversation = await CometChat.getConversation(receiverId, DEFAULT_RECEIVER_TYPE);
        //                 if (updatedConversation) {
        //                     onSelectorItemClicked(updatedConversation, "updateSelectedItem");
        //                     const customEvent = new CustomEvent("conversationUpdated", {
        //                         detail: updatedConversation,
        //                     });
        //                     window.dispatchEvent(customEvent);
        //                 }
        //             } catch (err) {
        //                 console.error("Failed to fetch updated conversation after message:", err);
        //             }
        //         }, 200);
        //     } catch (err) {
        //         console.error("Failed to send message to Zoe:", err);
        //     }
        // };

        const loggedInUser = CometChatUIKitLoginListener.getLoggedInUser() as CometChat.User;
        setLoggedInUser(loggedInUser);

        if (loggedInUser) {
            const role = loggedInUser.getRole();
            if (role === "subscriber") {
                initChatWithZoe(loggedInUser);
            }
        }
    }, [userDetail]);

    useEffect(() => {
        const wrapper = document.querySelector(".conversations-wrapper") as HTMLElement;
        if (wrapper) {
            if (loggedInUser?.getRole() === "subscriber") {
                wrapper.style.display = "none";
            } else {
                wrapper.style.display = "flex";
            }
        }
    }, [loggedInUser]);

    useEffect(() => {
        const messageSentSub = CometChatMessageEvents.ccMessageSent.subscribe((message) => {
            handleNewMessage(message);
        });

        return () => messageSentSub.unsubscribe();
    }, [handleNewMessage]);

    const CustomLeadingView = (conversation: Conversation) => {
        const conversationObj = conversation.getConversationWith();
        const isUser = conversationObj instanceof CometChat.User;
        const isGroup = conversationObj instanceof CometChat.Group;

        const avatar = isUser ? (conversationObj as CometChat.User).getAvatar() : (conversationObj as CometChat.Group).getIcon();
        const name = conversationObj.getName();

        const uid = isUser ? (conversationObj as CometChat.User).getUid() : null;
        const isMuted = uid ? mutedUsers.has(uid) : false;

        return (
            <div className="conversations__leading-view" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div className="comet-chat-user-avtar">
                    <CometChatAvatar image={avatar} name={name} />
                </div>
                <div className="comet-chat-user-muted-icon">
                    {isMuted && (
                        <img className="img-svg-muted" id="muted-icon" src={muteIcon} alt="Muted" title="Muted" style={{ width: "18px", height: "18px" }} />
                    )}
                </div>
            </div>
        );
    };

    useEffect(() => {
        const handleBlockedStatusChanged = async (e: Event) => {
            setRefreshConversations((prev) => prev + 1);
        };
        const handleMuteStatusChanged = async (e: Event) => {
            const customEvent = e as CustomEvent;
            try {
                const loggedInUser = await CometChat.getLoggedinUser();
                if (!loggedInUser) throw new Error("User not logged in");

                const uid = loggedInUser.getUid();

                const res = await fetch(
                    `https://${COMETCHAT_CONSTANTS.APP_ID}.api-${COMETCHAT_CONSTANTS.REGION}.cometchat.io/${COMETCHAT_CONSTANTS.COMET_CHAT_API_VERSION}/notifications/v1/preferences/mute?uid=${uid}`,
                    {
                        headers: {
                            accept: "application/json",
                            apikey: COMETCHAT_CONSTANTS.REST_API_KEY,
                            "content-type": "application/json",
                        },
                    },
                );

                const result = await res.json();
                const muted = result?.data?.mutedConversations || [];
                const ids = new Set<string>(muted.map((m: any) => m.id as string));
                setMutedUsers(ids);

                setRefreshConversations((prev) => prev + 1);
            } catch (err) {
                console.error("Error handling muteStatusChanged:", err);
            }
        };

        window.addEventListener("muteStatusChanged", handleMuteStatusChanged);
        window.addEventListener("blockingUserChanged", handleBlockedStatusChanged);

        return () => {
            window.removeEventListener("muteStatusChanged", handleMuteStatusChanged);
            window.removeEventListener("blockingUserChanged", handleBlockedStatusChanged);
        };
    }, []);

    return (
        <div className="oppai-dragon-comet-chat chat-list">
            {loggedInUser?.getRole() !== "subscriber" && (
                <div style={{ width: "100%", borderRight: " 1px solid #eee" }}>
                    {activeTab === "chats" ? (
                        <CometChatConversations
                            hideDeleteConversation={true}
                            key={refreshConversations}
                            // activeConversation={activeItems as Conversation}
                            onSelect={(e) => {
                                onSelectorItemClicked(e, "updateSelectedItem");
                            }}
                            headerView={conversationsHeaderView()}
                            onItemClick={(e) => {
                                onSelectorItemClicked(e, "updateSelectedItem");
                            }}
                            options={getOptions}
                            leadingView={CustomLeadingView}
                        />
                    ) : activeTab === "users" ? (
                        <CometChatUsers
                            activeUser={activeItem as CometChat.User}
                            onItemClick={(e) => {
                                onSelectorItemClicked(e, "updateSelectedItemUser");
                            }}
                        />
                    ) : null}
                </div>
            )}
        </div>
    );
};
