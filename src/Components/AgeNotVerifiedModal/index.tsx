import { Modal } from "antd";
import React from "react";

import EighteenPlusIcon from "../../assets/Icons/EighteenPlusIcon";
import LeftArrow from "../../assets/Icons/LeftArrow";
import Header from "../Header";
import { useAppSelector } from "../../redux";
import unlock_crimson_heiress from "../../assets/verify-age-crimson-heries.png";
import unlock_general_of_north from "../../assets/verify-age-general-north.png";
import unlock_demon_princess from "../../assets/verify-age-demon-princess.png";
import unlock_overseer_of_guardians from "../../assets/verify-age-oversea.png";
import unlock_series_2_b_class from "../../assets/verify-age-series-2-b.png";
import unlock_thunder_priestess from "../../assets/verify-age-thunder.png";
import unlock_titan_slayer from "../../assets/verify-age-titan-slayer.png";
import unlock_subject_002 from "../../assets/verify-age-subject.png";
import unlock_oni_maid from "../../assets/verify-age-oni-maid.png";
import unlock_zoe_grey from "../../assets/verify-age-zoe.png";

interface IAgeNotVerifiedModal {
    open: boolean;
    handleOk?: () => void;
}

const AgeNotVerifiedModal: React.FC<IAgeNotVerifiedModal> = ({ open, handleOk }) => {
    const { userDetail } = useAppSelector((state) => state.user);

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
        <Modal
            destroyOnHidden
            className="!m-0 !mx-auto top-0 !w-full !max-w-md !p-0 [&_.ant-modal-content]:max-h-[calc(100vh-112px)] [&_.ant-modal-content]:bg-inherit [&_.ant-modal-content]:p-5 [&_.ant-modal-content]:text-white"
            closable={false}
            footer={null}
            maskClosable={false}
            open={open}
            rootClassName={`
                [&_.ant-modal-mask]:!backdrop-blur-[13px]
                [&_.ant-modal-mask]:!bg-[#130c1e8c]
                [&_.ant-modal-mask]:!max-w-md 
                [&_.ant-modal-mask]:mx-auto 
                [&_.ant-modal-wrap]:!top-0
                [&_.ant-modal-mask]:!top-0
                [&_.ant-modal-content]:!shadow-none
            `}
            title=""
        >
            <div className={`relative -mx-5 w-[initial] mt-8 overflow-hidden`}>
                <div className="mx-auto w-full max-w-[calc(100%-34px)]">
                    <div className="sticky top-0 flex w-full items-center rounded-t-[21px] overflow-hidden">
                        <div aria-hidden className="pwa-back-btn-custom z-[51]" onClick={handleOk}>
                            <LeftArrow />
                        </div>
                        <Header bg="#381D67" />
                    </div>
                </div>
                <div className={`relative mx-auto w-full max-w-[calc(100%-34px)] rounded-[21px] bg-[#381D67] py-5 px-8 !rounded-t-none`}>
                    <div className="relative z-10 flex h-full w-full flex-col gap-3 pr-[140px]">
                        <EighteenPlusIcon />
                        <h2 className="font-poppins text-lg font-semibold text-white">
                            Verify your age <span className="text-[#CE2A42] block w-full"> to view this content, Oppai Dragon </span>
                        </h2>
                        <p className="font-poppins text-xs font-normal text-white pr-3">
                            Yeah, I get it. It’s annoying. But it’s the law. Don’t blame me. You’ll be sent to our partner to confirm.
                        </p>
                        {/* <div
                            className="mt-1 rounded-full bg-[#CE2A42] px-5 py-2.5 text-center text-xs font-bold text-white cursor-pointer"
                            id="verifyMyAgeAtFeatureSection"
                        >
                            VERIFY MY AGE
                        </div> */}
                        <AgeVerificationButton isAccount={false} />
                        <p className="font-poppins text-xs font-normal text-white pr-3">PS: No worries. Neither they nor I see or store your info.</p>
                    </div>
                </div>
                <div className="absolute bottom-0 -right-4 z-[1] w-full max-w-[260px]">
                    <img
                        alt="modalAvatar"
                        className="h-full w-full object-contain"
                        fetchPriority="high"
                        loading="lazy"
                        // src={images["subject: 002".toLocaleLowerCase()]}
                        src={images[(userDetail?.user_chat_waifus?.commetchat_waifu_user?.display_name ?? "subject: 002").toLocaleLowerCase()]}
                    />
                    {/* <img alt="modalAvatar" className="h-full w-full object-contain" src={modalAvatar} /> */}
                </div>
            </div>
        </Modal>
    );
};

export default AgeNotVerifiedModal;

export const AgeVerificationButton = ({ isAccount }: { isAccount: boolean }) => {
    return (
        <div
            className={`mt-3 min-h-[38px] rounded-full border !px-7 !py-3 text-center font-poppins text-xs font-bold uppercase leading-none cursor-pointer transition-pwa 
            ${
                isAccount
                    ? "bg-transparent text-[#CE2A42] border-[#CE2A42] hover:bg-[#CE2A42] hover:text-white hover:border-[#CE2A42]"
                    : "bg-[#CE2A42] text-white border-[#CE2A42] hover:bg-white hover:text-[#CE2A42] hover:border-white"
            }`}
            id="verifyMyAgeAtFeatureSection"
        >
            VERIFY MY AGE
        </div>
    );
};
