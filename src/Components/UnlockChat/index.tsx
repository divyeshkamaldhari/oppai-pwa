import { useState } from "react";

import chatUnlock from "../../../public/assets/modal-avatar2.png";
import VerifiedIcon from "../../assets/Icons/VerifiedIcon";
import PurchaseButton from "../PurchaseButton";
import { useAppSelector } from "../../redux";
import AgeNotVerifiedModal from "../AgeNotVerifiedModal";
import useChatDiscountTimer from "../ChatDiscountWrapper";

const UnlockChat = () => {
    const { chatPurchaseDetails } = useAppSelector((state) => state.chat);
    const { userDetail } = useAppSelector((state) => state.user);
    const [ageVerified, setAgeVerified] = useState(false);
    const { discountActive } = useChatDiscountTimer();
    const chatPrice = discountActive ? chatPurchaseDetails?.discount_price : chatPurchaseDetails?.price;

    const handleOk = () => {
        setAgeVerified(false);
    };

    return (
        <>
            <div className="w-full px-4">
                <div className="h-full w-full overflow-hidden rounded-[21px] bg-[#381D67]">
                    <div className="my-[13px] bg-[#1CBD43] ps-[22px] pb-1 pt-1.5 font-poppins text-sm font-bold uppercase leading-[140%]">
                        Hurry up… I’m getting lonely in the chat!
                    </div>
                    <div className="relative pb-6 pr-16 ps-[22px]">
                        <h1 className="font-poppins text-lg font-semibold leading-6 text-white">Wanna be my Oppai Dragon? Unlock the chat!</h1>
                        <div className="mt-2 flex flex-col gap-1.5">
                            <p className="flex items-start gap-1 font-poppins text-[13px] font-normal leading-[110%]">
                                <VerifiedIcon className="my-auto w-2 h-2" /> Start DM’ing me privately!{" "}
                            </p>
                            <p className="flex items-start gap-1 font-poppins text-[13px] font-normal leading-[110%]">
                                <VerifiedIcon className="my-auto w-2 h-2" />{" "}
                                <span>
                                    <strong>Bonus:</strong> Epic Waifu Pack (100+ pics)
                                </span>
                            </p>
                            <p className="flex items-start gap-1 font-poppins text-[13px] font-normal leading-[110%]">
                                <VerifiedIcon className="my-auto w-2 h-2" />{" "}
                                <span>
                                    <strong>Bonus:</strong> Eligible for special drops
                                </span>
                            </p>
                            <p className="flex items-start gap-1 font-poppins text-[13px] font-normal leading-[110%]">
                                <VerifiedIcon className="w-2 h-2 my-auto" /> Hurry, only a few spots left!
                            </p>
                            <p className="flex items-start gap-1 font-poppins text-[13px] font-normal leading-[110%]">
                                <VerifiedIcon className="w-2 h-2 my-auto" /> PS: I’m a real human waifu, not AI!
                            </p>
                        </div>
                        <div className="mt-4 w-full flex items-center gap-2 relative z-[1]">
                            <PurchaseButton
                                ageVerified={ageVerified}
                                amount={Number(chatPrice)}
                                btnClass="pwa-btn-sm  !w-max !px-6 !text-xs !font-bold"
                                btnText="I WANNA CHAT"
                                isChatPurchase={true}
                                productDescription="UNLOCK THE CHAT"
                                productId={chatPurchaseDetails?.id as number}
                                qty={1}
                                setAgeVerified={setAgeVerified}
                                userId={userDetail.id}
                            />
                            {userDetail?.view_count && <div className="badge-btn">❤ {userDetail.view_count}</div>}
                        </div>
                        <div className="absolute -right-[44px] bottom-0 max-w-[180px]">
                            <img alt="chat-unlock" className="h-full w-full object-contain" src={chatUnlock} />
                        </div>
                    </div>
                </div>
            </div>
            <AgeNotVerifiedModal handleOk={handleOk} open={!userDetail.age_verified && ageVerified} />
        </>
    );
};

export default UnlockChat;
