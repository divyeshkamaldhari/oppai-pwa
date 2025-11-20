import { Modal } from "antd";
import React, { useState } from "react";

import LeftArrow from "../../assets/Icons/LeftArrow";
import Header from "../Header";

import TutorialStep1 from "./TutorialStep1";
import TutorialStep2 from "./TutorialStep2";

interface ITutorialModal {
    open: boolean;
    handleOk: () => void;
}

const TutorialModal: React.FC<ITutorialModal> = ({ handleOk, open }) => {
    const [step, setStep] = useState<number>(1);
    const handleBackButton = () => {
        setStep(1);
        handleOk();
    };

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
                        <div aria-hidden className="pwa-back-btn-custom z-[51]" onClick={handleBackButton}>
                            <LeftArrow />
                        </div>
                        <Header />
                    </div>
                    <div className="overflow-y-auto max-h-[calc(100dvh-89px)] h-full w-full">
                        {step === 1 ? <TutorialStep1 setStep={setStep} /> : <TutorialStep2 />}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default TutorialModal;
