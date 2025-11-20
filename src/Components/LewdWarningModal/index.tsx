import { Button, Modal } from "antd";
import React from "react";

import waifusLewd from "../../assets/Payment Waifus Cropped.webp";
import lewdFooter from "../../assets/Trustpilot.png";
import Header from "../Header";

interface ILewdWarningModal {
    open: boolean;
    handleOk: () => void;
    handlePaymentAfterCancel: () => void;
}

const LewdWarningModal: React.FC<ILewdWarningModal> = ({ open, handleOk, handlePaymentAfterCancel }) => {
    return (
        <Modal
            destroyOnHidden
            className="!m-0 !mx-auto top-0 !w-full !max-w-md !p-0 [&_.ant-modal-content]:h-[100vh] [&_.ant-modal-body]:h-full [&_.ant-modal-body]:flex [&_.ant-modal-content]:bg-inherit [&_.ant-modal-content]:p-5 [&_.ant-modal-content]:text-white"
            closable={false}
            footer={null}
            maskClosable={false}
            open={open}
            rootClassName="
            [&_.ant-modal-mask]:!backdrop-blur-[0px]
            [&_.ant-modal-mask]:!bg-[#130c1ef5]
            [&_.ant-modal-mask]:!top-0
            [&_.ant-modal-mask]:!max-w-md 
            [&_.ant-modal-mask]:mx-auto 
            [&_.ant-modal-wrap]:!top-0 
            [&_.ant-modal-content]:!shadow-none"
            title=""
        >
            <div className="h-full rounded-[21px] overflow-hidden overflow-y-auto flex w-[initial] flex-col text-white bg-[#381D67] my-auto">
                <div className="sticky top-0 z-50 flex w-full items-center">
                    <Header bg="#381D67" />
                </div>
                <div className="pt-9 px-5 mb-3">
                    <div className="sec-head w-full">
                        <h1 className="text-center font-luckiest-guy text-[28px] font-normal leading-7 text-white">
                            You’re bout to <span className="text-[#CE2A42] block w-full font-luckiest-guy">miss the lewd fun!</span>
                        </h1>
                    </div>
                    <div className="mt-[22px]">
                        <p className="text-center text-white text-xs font-normal leading-[normal]">
                            You sure you wanna cancel the payment? <br />
                            <span className="font-bold inline">It’s just a one-time payment. No hidden charges or annoying rebills.</span> Billed as ‘O-Dragon’
                            to keep it our little lewd secret.
                        </p>
                        <p className="text-center text-white text-10px mt-3 text-[10px]">- Zoe, Creator of Oppai Dragon 💖</p>
                    </div>
                    <div className="flex justify-center flex-col gap-4 mt-4 max-w-[184px] mx-auto w-full">
                        <Button className="pwa-btn-sm !text-sm" type="primary" onClick={handlePaymentAfterCancel}>
                            I WANT IT NOW
                        </Button>
                        <Button className="pwa-btn-sm !text-sm pwa-btn-gray-outline" type="primary" onClick={handleOk}>
                            PISS OFF MY WAIFU
                        </Button>
                    </div>
                </div>
                <div className="flex justify-center mt-auto w-full relative">
                    <img alt="lewd waifu" className="w-full h-full" loading="lazy" src={waifusLewd} />
                    <div className="absolute bottom-6 w-[calc(100%-48px)] max-w-[304px] left-1/2 -translate-x-1/2 bg-black z-[1] rounded-[13px]">
                        <img alt="lewd footer" className="w-full h-full" loading="lazy" src={lewdFooter} />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default LewdWarningModal;
