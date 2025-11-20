import { Modal } from "antd";
import React from "react";

import LeftArrow from "../../assets/Icons/LeftArrow";
import Header from "../Header";

import FaqsSection from "./FaqsSection";

interface IFaqsModal {
    open: boolean;
    handleOk: () => void;
}

const FaqsModal: React.FC<IFaqsModal> = ({ handleOk, open }) => {
    return (
        <Modal
            className="!top-0 !m-0 !mx-auto !h-dvh !w-full !max-w-md !bg-[#130C1E] !p-0 [&_.ant-modal-body]:bg-[#130C1E] [&_.ant-modal-content]:h-dvh [&_.ant-modal-content]:bg-transparent [&_.ant-modal-content]:p-0 [&_.ant-modal-content]:text-white"
            closable={false}
            footer={null}
            open={open}
            title=""
        >
            <div className="flex h-full w-[initial] flex-col overflow-x-visible overflow-y-scroll text-white">
                <div className="overflow-hidden">
                    <div className="sticky top-0 z-50 flex w-full items-center">
                        <div aria-hidden className="pwa-back-btn-custom z-[51]" onClick={handleOk}>
                            <LeftArrow />
                        </div>
                        <Header />
                    </div>
                    <div className="overflow-y-auto max-h-[calc(100dvh-89px)] h-full w-full">
                        <div className="px-4 text-white space-y-12">
                            <FaqsSection />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default FaqsModal;
