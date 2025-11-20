import { Button, Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";

import LeftArrow from "../../assets/Icons/LeftArrow";
import OnlyLoader from "../Loader/OnlyLoader";
import Header from "../Header";
import { APP_ROUTE } from "../../constants/AppRoutes";

export interface IEMerchantPayModal {
    open: boolean;
    handleOk: () => void;
    redirect_url: string;
    handleLewdWarningOk: () => void;
}

const EMerchantPayModal: React.FC<IEMerchantPayModal> = ({ open, handleOk, redirect_url, handleLewdWarningOk }) => {
    const [loading, setLoading] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isPurchaseCallBack, setIsPurchaseCallBack] = useState(false);

    useEffect(() => {
        setLoading(true);
    }, [redirect_url]);

    useEffect(() => {
        const interval = setInterval(() => {
            try {
                if (iframeRef.current?.contentWindow) {
                    const currentUrl = iframeRef.current.contentWindow.location.href;
                    const url = new URL(currentUrl);

                    if (url.pathname === APP_ROUTE.PURCHASE_CALLBACK) {
                        setIsPurchaseCallBack(true);
                        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                    }
                }
            } catch (err) {
                console.log("err: ", err);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Modal
            destroyOnHidden
            className="!m-0 !mx-auto top-0 !w-full !max-w-md !p-0 [&_.ant-modal-content]:h-[100vh] [&_.ant-modal-body]:h-full [&_.ant-modal-content]:bg-inherit [&_.ant-modal-content]:p-5 [&_.ant-modal-content]:text-white eMerchantPayModal overflow-hidden max-h-[100dvh]"
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
            {redirect_url ? (
                <div className="h-full max-h-[100dvh-40px] rounded-[21px] overflow-hidden flex w-[initial] flex-col text-white  bg-[#381D67] [&_iframe]:h-full [&_iframe]:w-full">
                    <div className="sticky top-0 z-50 flex w-full items-center">
                        <div
                            aria-hidden
                            className={`pwa-back-btn-custom z-[51] ${isPurchaseCallBack ? "!cursor-not-allowed opacity-50" : ""}`}
                            onClick={() => {
                                if (isPurchaseCallBack) return;
                                handleLewdWarningOk();
                            }}
                        >
                            <LeftArrow />
                        </div>
                        <Header bg="#381D67" />
                    </div>

                    {loading && (
                        <div className="emerchant-pay-modal absolute top-0 h-full left-1/2 -translate-x-1/2 w-full z-[99]">
                            <OnlyLoader />
                        </div>
                    )}

                    {/* <div className="flex flex-col text-white h-full bg-[#381D67] overflow-y-auto"> */}
                    <div className="flex flex-col text-white h-full bg-[#381D67] overflow-hidden max-h-[100dvh-73px-20px]">
                        <div className={`emerchaant-iframe w-full ${isPurchaseCallBack ? "h-full" : ""}`}>
                            <iframe
                                key={`${redirect_url}-${open}`}
                                ref={iframeRef}
                                allow="payment"
                                className={`w-full ${isPurchaseCallBack ? "h-full" : "min-h-[calc(100dvh-113px)] !h-[calc(100dvh-113px)]"}`}
                                title="emerchant-pay"
                                onLoad={() => {
                                    setTimeout(() => {
                                        setLoading(false);
                                    }, 100);
                                }}
                                src={redirect_url}
                                // sandbox="allow-same-origin "
                                // src={`${window.location.origin}${APP_ROUTE.PURCHASE_CALLBACK}?purchaseStatus=success`}
                            />
                        </div>
                        {/* {!loading && (
                            <div className="modal-bottom-row mt-auto px-2">
                                <div className="comment-msg-wrapper text-center">
                                    <p className="w-full max-w-[265px] mx-auto uppercase text-[9px] text-center">
                                        Securely enter your payment details above. It&apos;s a one-time payment only. No hidden charges or annoying rebills.
                                        Billed as &quot;O-DRAGON&quot; to keep our little lewd secret.
                                    </p>
                                    <small className="w-full text-[9px] text-center text-[#959FAA]">- Zoe, Creator of Oppai Dragon 💖</small>
                                </div>
                                <div className="modal-bottom-banner w-full">
                                    <div className="img-wrap relative w-full pt-[52%]">
                                        <img
                                            alt="modalAvatar"
                                            className="absolute object-top top-0 left-0 h-full w-full object-cover"
                                            src={modalBottomAvatar}
                                        />
                                    </div>
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>
            ) : (
                <div>
                    <h1>Payment Fail</h1>
                    <Button type="primary" onClick={handleOk}>
                        Close
                    </Button>
                </div>
            )}
        </Modal>
    );
};

export default EMerchantPayModal;
