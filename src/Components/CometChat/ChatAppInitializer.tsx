import { useEffect, useState } from "react";
import { CometChatHome } from "./components/CometChatHome/CometChatHome";
import "./styles/App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppSelector } from "../../redux";

const ChatAppInitializer = () => {
    const { userDetail } = useAppSelector((state) => state.user);

    // const [userUuid, setUserUuid] = useState(userDetail.user_chat_waifus.commetchat_user?.ID ? `users_${userDetail.user_chat_waifus.commetchat_user?.ID}` : "");
    const [selectedUserUuid, setSelectedUserUuid] = useState(
        userDetail.user_chat_waifus.commetchat_waifu_user?.ID ? `users_${userDetail.user_chat_waifus.commetchat_waifu_user?.ID}` : "",
    );

    useEffect(() => {
        // setUserUuid(userDetail.user_chat_waifus.commetchat_user?.ID ? `users_${userDetail.user_chat_waifus.commetchat_user?.ID}` : "");
        setSelectedUserUuid(userDetail.user_chat_waifus.commetchat_waifu_user?.ID ? `users_${userDetail.user_chat_waifus.commetchat_waifu_user?.ID}` : "");
    }, [userDetail]);

    return (
        <div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <CometChatHome theme={"dark"} selectedUserUuid={selectedUserUuid} />
        </div>
    );
};

export default ChatAppInitializer;
