import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import MessageIcon from "../../../../assets/Icons/MessageIcon";
import { useAppSelector } from "../../../../redux";
import { isIphoneSafariOrChrome, isPWA } from "../../../../utils";
import AgeNotVerifiedModal from "../../../AgeNotVerifiedModal";
import useChatDiscountTimer from "../../../ChatDiscountWrapper";
import PurchaseButton from "../../../PurchaseButton";
import unlock_crimson_heiress from "../../assets/unlock_crimson_heiress.png";
import unlock_demon_princess from "../../assets/unlock_demon_princess.png";
import unlock_general_of_north from "../../assets/unlock_general_of_north.png";
import unlock_oni_maid from "../../assets/unlock_oni_maid.png";
import unlock_overseer_of_guardians from "../../assets/unlock_overseer_of_guardians.png";
import unlock_series_2_b_class from "../../assets/unlock_series_2_b_class.png";
import unlock_subject_002 from "../../assets/unlock_subject_002.png";
import unlock_thunder_priestess from "../../assets/unlock_thunder_priestess.png";
import unlock_titan_slayer from "../../assets/unlock_titan_slayer.png";
import unlock_zoe_grey from "../../assets/unlock_zoe_grey.png";
import "../../styles/Modals/UnlockChatModal.css";

dayjs.extend(customParseFormat);

const UnlockChatModal = () => {
    const { userDetail } = useAppSelector((state) => state.user);
    const { chatPurchaseDetails } = useAppSelector((state) => state.chat);
    const [ageVerified, setAgeVerified] = useState(false);
    const { minutes, seconds, discountActive } = useChatDiscountTimer();
    const chatPrice = discountActive ? chatPurchaseDetails?.discount_price : chatPurchaseDetails?.price;

    const handleOk = () => {
        setAgeVerified(false);
    };

    const images: Record<string, string> = {
        "zoe grey": unlock_zoe_grey,
        "series 2: b-class": unlock_series_2_b_class,
        "thunder priestess": unlock_thunder_priestess,
        "overseer of guardians": unlock_overseer_of_guardians,
        "general of the north": unlock_general_of_north,
        "titan slayer": unlock_titan_slayer,
        "demon princess": unlock_demon_princess,
        "oni maid": unlock_oni_maid,
        "crimson heiress": unlock_crimson_heiress,
        "subject: 002": unlock_subject_002,
    };

    return (
        <>
            <div className={`cometchat-unlock-chat-modal-container ${isIphoneSafariOrChrome() && isPWA() ? "mb-16" : "mb-10"}`}>
                <div className={`cometchat-composer-wrapper cometchat-unlock-chat-modal ${discountActive ? "pt-16" : ""}`}>
                    {discountActive && (
                        <div className="absolute top-[19px] left-0 w-full bg-[#1CBD43] px-[33px] pb-1 pt-1.5 font-poppins text-sm font-bold uppercase leading-[140%]">
                            50% OFF ENDS IN
                            <div className="inline-flex pwa-clock">
                                <span>{minutes}</span>:<span>{seconds}</span>
                            </div>
                        </div>
                    )}
                    <div className="flex mb-4">
                        <MessageIcon />
                    </div>
                    <div className="flex flex-col w-full z-[5]">
                        <h3>
                            <strong>Oh no! </strong>You haven't unlocked the chat yet!
                        </h3>
                        <p>
                            I’m waiting inside, don’t be shy… One-time payment, no rebills. Plus, Epic Waifu Pack (100+ pics) included! Hurry, spots are limited 😘
                        </p>
                    </div>
                    <div className="unlock-button-container">
                        <PurchaseButton
                            amount={Number(chatPrice)}
                            btnClass="unlock-button !p-[9px] !text-xs"
                            btnText="UNLOCK THE CHAT"
                            isChatPurchase={true}
                            productDescription="UNLOCK THE CHAT"
                            productId={chatPurchaseDetails?.id as number}
                            userId={userDetail.id}
                            ageVerified={ageVerified}
                            setAgeVerified={setAgeVerified}
                            qty={1}
                        />
                    </div>
                </div>
                <div className="cometchat-unlock-chat-modal__image">
                    <img
                        src={images[(userDetail?.user_chat_waifus?.commetchat_waifu_user?.display_name ?? "subject: 002").toLocaleLowerCase()]}
                        alt="Unlock chat waifu"
                    />
                </div>
            </div>
            <AgeNotVerifiedModal open={!userDetail.age_verified && ageVerified} handleOk={handleOk} />
        </>
    );
};

export default UnlockChatModal;
