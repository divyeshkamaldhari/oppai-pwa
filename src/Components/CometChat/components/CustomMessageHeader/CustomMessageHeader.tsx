import { CometChat } from "@cometchat/chat-sdk-javascript";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { CometChatAvatar } from "@cometchat/chat-uikit-react";
import "../../components/CustomMessageHeader/CustomMessageHeader.css";
import main_logo from "../../../../assets/opaiLogo.png";
import { useAppSelector } from "../../../../redux";
import { AppContext } from "../../context/AppContext";

export const CustomMessageHeader = ({
    user,
    group,
    onBack,
    showSideComponent,
}: {
    user?: CometChat.User;
    group?: CometChat.Group;
    showSideComponent?: any;
    onBack?: () => void;
}) => {
    const { userDetail } = useAppSelector((state) => state.user);
    const { setMessageActive } = useContext(AppContext);
    const [status, setStatus] = useState(user?.getStatus() || "offline");
    const [lastActiveAt, setLastActiveAt] = useState(user?.getLastActiveAt());
    const [lastSeenLabel, setLastSeenLabel] = useState("");

    useEffect(() => {
        if (!user) return;

        // Initial fetch to make sure latest user info
        CometChat.getUser(user.getUid()).then((freshUser) => {
            setStatus(freshUser.getStatus());
            setLastActiveAt(freshUser.getLastActiveAt());
        });

        const listenerID = `user_listener_${user.getUid()}`;
        CometChat.addUserListener(
            listenerID,
            new CometChat.UserListener({
                onUserOnline: (onlineUser: any) => {
                    if (onlineUser.getUid() === user.getUid()) {
                        setStatus("online");
                        setMessageActive("online");
                    }
                },
                onUserOffline: (offlineUser: any) => {
                    if (offlineUser.getUid() === user.getUid()) {
                        setStatus("offline");
                        setLastActiveAt(offlineUser.getLastActiveAt());
                        setMessageActive("offline");
                    }
                },
            }),
        );

        return () => {
            CometChat.removeUserListener(listenerID);
        };
    }, [user]);

    const formatLastActiveTime = (lastActiveAt?: number) => {
        if (status === "online") return "Online";
        if (!lastActiveAt) return "Last seen a while ago";

        const lastActiveTime = dayjs(lastActiveAt * 1000);
        const now = dayjs();

        const diffInMinutes = now.diff(lastActiveTime, "minute");
        const diffInHours = now.diff(lastActiveTime, "hour");

        if (diffInMinutes < 1) {
            return "Last seen a while ago";
        } else if (diffInMinutes < 60) {
            return `Last seen ${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `Last seen ${lastActiveTime.format("h:mm A")}`;
        } else {
            return `Last seen ${lastActiveTime.format("MMMM D, h:mm A")}`;
        }
    };

    // ⏳ real-time auto update
    useEffect(() => {
        const updateLabel = () => {
            setLastSeenLabel(formatLastActiveTime(lastActiveAt));
        };

        updateLabel(); // run on mount

        const interval = setInterval(updateLabel, 60000); // update every 1 minute

        return () => clearInterval(interval);
    }, [lastActiveAt, status]);
    const getDisplayName = () => {
        if (user) return user.getName();
        if (group) return group.getName();
        return "";
    };
    return (
        <div className="custom-message-header__right">
            {user && (
                <div className="custom-message-header__avatar" onClick={showSideComponent} style={{ cursor: "pointer", position: "relative" }}>
                    <CometChatAvatar image={user.getAvatar()} name={user.getName()} />
                    {status === "online" && (
                        <div
                            style={{
                                width: "12px",
                                height: "12px",
                                backgroundColor: "green",
                                borderRadius: "50%",
                                position: "absolute",
                                bottom: "0",
                                right: "0",
                                border: "2px solid white",
                            }}
                        />
                    )}
                </div>
            )}
            <div className="custom-message-header__center">
                <div className="custom-message-header__name">{getDisplayName()}</div>
                {user && <div className="custom-message-header__last-active">{lastSeenLabel}</div>}
            </div>
            <div className="custom-message-header__left">
                <img src={main_logo} alt="Oppai Dragon" className="custom-message-header__logo" />
            </div>
        </div>
    );
};
