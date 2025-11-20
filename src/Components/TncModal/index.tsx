import React, { useEffect } from "react";
import { Modal } from "antd";

export interface ITncModal {
    open: boolean;
    handleOk: () => void;
    redirect_url: string;
}

const TncModal: React.FC<ITncModal> = ({ open, handleOk, redirect_url }) => {
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "tncScreenClose") {
                handleOk();
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return (
        <Modal
            destroyOnHidden
            className="!m-0 !mx-auto top-0 !w-full !max-w-md !p-0 [&_.ant-modal-content]:h-[100vh] [&_.ant-modal-body]:h-full [&_.ant-modal-content]:bg-inherit [&_.ant-modal-content]:p-0 [&_.ant-modal-content]:text-white"
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
            <div className="h-full overflow-hidden overflow-[unset] flex w-[initial] flex-col text-white  bg-[#140c20] [&_iframe]:h-full [&_iframe]:w-full">
                <div className="flex flex-col text-white h-full bg-[#140c20] overflow-y-auto">
                    <iframe key={`${redirect_url}-${open}`} allow="payment" className="w-full" src={redirect_url} title="payment tmc" />
                </div>
            </div>
        </Modal>
    );
};

export default TncModal;
