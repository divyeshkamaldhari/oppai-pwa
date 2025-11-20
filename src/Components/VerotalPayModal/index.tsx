import React, { useEffect, useRef, useState } from "react";
import { Modal } from "antd";

import { APP_ROUTE } from "../../constants/AppRoutes";
import LeftArrow from "../../assets/Icons/LeftArrow";
import Header from "../Header";

interface IVerotalPayModal {
    open: boolean;
    handleOk: () => void;
    sessionId: string;
}

const VerotalPayModal: React.FC<IVerotalPayModal> = ({ open, handleOk, sessionId }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [tncModalOpen, setTncModalOpen] = useState(false);

    const handleBack = () => {
        if (tncModalOpen) {
            setTncModalOpen(false);
            iframeRef.current?.contentWindow?.postMessage({ type: "tncScreenClose" }, "*");
        } else {
            handleOk();
        }
    };

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "tncScreen") {
                setTncModalOpen(true);
            }
        };

        window.addEventListener("message", handleMessage);

        return () => window.removeEventListener("message", handleMessage);
    }, []);

    return (
        <Modal
            destroyOnHidden
            className="!m-0 !mx-auto top-0 !w-full !max-w-md !p-0 [&_.ant-modal-content]:h-[100vh] [&_.ant-modal-body]:h-full [&_.ant-modal-content]:bg-inherit [&_.ant-modal-content]:p-5 [&_.ant-modal-content]:text-white"
            closable={false}
            footer={null}
            maskClosable={false}
            open={open}
            rootClassName="
            [&_.ant-modal-mask]:!backdrop-blur-[2px]
            [&_.ant-modal-mask]:!bg-[#130c1e8c]
            [&_.ant-modal-mask]:!top-0
            [&_.ant-modal-mask]:!max-w-md 
            [&_.ant-modal-mask]:mx-auto 
            [&_.ant-modal-wrap]:!top-0 
            [&_.ant-modal-content]:!shadow-none"
            title=""
        >
            <div className="h-full rounded-[21px] overflow-hidden overflow-y-auto flex w-[initial] flex-col text-white bg-[#381D67] [&_iframe]:h-full [&_iframe]:w-full">
                <div className="sticky top-0 z-50 flex w-full items-center">
                    <div aria-hidden className="pwa-back-btn-custom z-[51]" onClick={handleBack}>
                        <LeftArrow />
                    </div>
                    <Header bg="#381D67" />
                </div>
                {sessionId && (
                    <iframe
                        key={`${sessionId}-${open}`}
                        ref={iframeRef}
                        src={`${window.location.origin}${APP_ROUTE.VEROTAL_PAYMENT_VIEW}/${sessionId}`}
                        title="verotal pay"
                    />
                )}
            </div>
        </Modal>
    );
};

export default VerotalPayModal;
