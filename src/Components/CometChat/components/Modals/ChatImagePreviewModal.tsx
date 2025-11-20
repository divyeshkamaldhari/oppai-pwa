import LeftArrow from "../../../../assets/Icons/LeftArrow";
import { useState, useEffect } from "react";
import { Modal } from "antd";

interface IChatImagePreviewModal {
    chatImagePreviewUrl: string;
    setChatImagePreviewUrl: (url: string) => void;
}

const ChatImagePreviewModal = ({ chatImagePreviewUrl, setChatImagePreviewUrl }: IChatImagePreviewModal) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(!!chatImagePreviewUrl);

    useEffect(() => {
        setIsModalOpen(!!chatImagePreviewUrl);
    }, [chatImagePreviewUrl]);

    return (
        <Modal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            afterClose={() => setChatImagePreviewUrl("")}
            width="100%"
            footer={null}
            centered
            closable={false}
            className="w-full !max-w-md h-full !m-0
        [&_.ant-modal-content]:h-full
        [&_.ant-modal-body]:h-full
        [&_.ant-modal-content]:p-0 
        [&_.ant-modal-content]:!bg-[#130C1E]   
        [&_>div]:h-full"
        >
            <div className="sticky top-0 z-50 flex w-full items-center min-h-[73px] !bg-[#130c1e]">
                <div aria-hidden className="pwa-back-btn-custom z-[51] cursor-pointer" onClick={() => setIsModalOpen(false)}>
                    <LeftArrow />
                </div>
            </div>

            <div className="flex overflow-hidden px-[22px] -mt-[73px] !bg-[#130c1e] h-full max-h-[100dvh] overflow-y-auto">
                <div className="relative w-full rounded-[20px] my-auto ">
                    <div className="h-full w-full">
                        <img src={chatImagePreviewUrl} alt="Chat Preview" className="h-full w-full rounded-[20px] object-contain" />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ChatImagePreviewModal;
