/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button, Checkbox } from "antd";

import modalBottomAvatar from "../../../public/assets/modal-avatar5.png";
import TncModal from "../../Components/TncModal";
import { FRONTEND_BASE_URL } from "../../constants/EnvConstants";

declare global {
    interface Window {
        Flowguard?: any;
    }
}

const VerotalPayment = () => {
    const [flowguardInstance, setFlowguardInstance] = useState<any>(null);
    const [paymentStart, setPaymentStart] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState<string>("");
    const { sessionId } = useParams();
    const [accepted, setAccepted] = useState(false);
    const [errors, setErrors] = useState<{
        cardNumber?: string;
        expDate?: string;
        cvv?: string;
        cardholder?: string;
        submit?: string;
    }>({});

    const handlePay = () => {
        if (flowguardInstance) {
            flowguardInstance?.submit();
            setPaymentStart(true);
        }
    };

    function handleClick(ele: string) {
        flowguardInstance?.getElement(ele).focus();
    }

    useEffect(() => {
        setTimeout(() => {
            if (window.Flowguard && sessionId) {
                setAccepted(false);
                const instance = new window.Flowguard({
                    sessionId: sessionId,
                    cardNumber: {
                        target: "#card-number-element",
                        onChange: (error: { errorDescription: string }) => {
                            setErrors((prev) => ({
                                ...prev,
                                cardNumber: error ? error.errorDescription : "",
                            }));
                        },
                    },
                    cvv: {
                        target: "#cvv-element",
                        onChange: (error: { errorDescription: string }) => {
                            setErrors((prev) => ({
                                ...prev,
                                cvv: error ? error.errorDescription : "",
                            }));
                        },
                    },
                    cardholder: {
                        target: "#cardholder-element",
                        placeholder: "Name on your card",
                        onChange: (error: { errorDescription: string }) => {
                            setErrors((prev) => ({
                                ...prev,
                                cardholder: error ? error.errorDescription : "",
                            }));
                        },
                    },
                    expDate: {
                        target: "#exp-date-element",
                        onChange: (error: { errorDescription: string }) => {
                            setErrors((prev) => ({
                                ...prev,
                                expDate: error ? error.errorDescription : "",
                            }));
                        },
                    },
                    price: { target: "#price-element" },
                    onSubmitError: (error: any) => {
                        setErrors({
                            cardNumber: "",
                            expDate: "",
                            cvv: "",
                            cardholder: "",
                            submit: "",
                        });

                        if (error) {
                            setErrors((prev) => ({
                                ...prev,
                                submit: error.errorDescription || "",
                                cardNumber: error.elementsErrors?.cardNumber?.errorDescription || "",
                                expDate: error.elementsErrors?.expDate?.errorDescription || "",
                                cvv: error.elementsErrors?.cvv?.errorDescription || "",
                                cardholder: error.elementsErrors?.cardholder?.errorDescription || "",
                            }));
                            setPaymentStart(false);
                        }
                    },
                    styles: {
                        input: {
                            base: {
                                "background-color": "rgba(255, 255, 255, 0)",
                                "font-size": "16px",
                                "padding-top": "10px",
                                "padding-right": "10px",
                                "padding-bottom": "10px",
                                "padding-left": "10px",
                                color: "#ffffff",
                                border: "1px solid #ffffff",
                            },
                        },
                        price: {
                            base: { color: "#ffffff" },
                            title: { color: "#ffffff" },
                            value: { color: "#ffffff" },
                        },
                    },
                });

                setFlowguardInstance(instance);
            }
        }, 800);
    }, [sessionId]);

    return (
        <>
            <div className="flex flex-col text-white px-4 h-full bg-[#381D67]">
                <h1 className="text-lg font-poppins font-semibold text-center">Just one step left, Oppai Dragon!</h1>
                <div className="w-full px-[10px] py-6">
                    <div className="flex flex-col gap-4">
                        <div className="input-wrapper">
                            <span role="none" onClick={() => handleClick("cardNumber")}>
                                Card number
                            </span>
                            <div className="!h-10 !flex !items-center !border !border-white" id="card-number-element" />
                            {errors.cardNumber && <p className="text-red-600 text-xs mt-2">{errors.cardNumber}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4 ">
                            <div className="input-wrapper">
                                <span role="none" onClick={() => handleClick("expDate")}>
                                    Expiration date
                                </span>
                                <div className="!h-10 !flex !items-center !border !border-white" id="exp-date-element" />
                                {errors.expDate && <p className="text-red-600 text-xs mt-2">{errors.expDate}</p>}
                            </div>

                            <div className="input-wrapper">
                                <span role="none" onClick={() => handleClick("cvv")}>
                                    CVV
                                </span>
                                <div className="!h-10 !flex !items-center !border !border-white" id="cvv-element" />
                                {errors.cvv && <p className="text-red-600 text-xs mt-2">{errors.cvv}</p>}
                            </div>
                        </div>
                        <div className="input-wrapper">
                            <span role="none" onClick={() => handleClick("Cardholder")}>
                                Cardholder
                            </span>
                            <div className="!h-10 !flex !items-center !border !border-white" id="cardholder-element" />
                            {errors.cardholder && <p className="text-red-600 text-xs mt-2">{errors.cardholder}</p>}
                        </div>
                        <div id="price-element" />
                    </div>
                    <div className="flex gap-4 items-center mt-4 checkbox-field">
                        <Checkbox checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                        <p className="font-poppins text-xs font-normal">
                            I accept the{" "}
                            <strong
                                aria-hidden
                                className="font-bold"
                                onClick={() => {
                                    setRedirectUrl(`${FRONTEND_BASE_URL}/terms-of-service/`);
                                    window.parent.postMessage({ type: "tncScreen" }, window.origin);
                                }}
                            >
                                Terms of Service&nbsp;
                            </strong>
                            and&nbsp;
                            <strong
                                aria-hidden
                                className="font-bold"
                                onClick={() => {
                                    setRedirectUrl(`${FRONTEND_BASE_URL}/privacy-policy/`);
                                    window.parent.postMessage({ type: "tncScreen" }, window.origin);
                                }}
                            >
                                Refund Policy
                            </strong>
                            .
                        </p>
                    </div>
                    <Button
                        className="!w-full !h-[34px] !rounded-none !border !text-white !border-white !mt-8 !bg-[#0ca789] hover:!bg-white hover:!text-black disabled:!bg-gray-400 disabled:!cursor-not-allowed transition-pwa uppercase tracking-[2px] font-semibold"
                        disabled={!accepted}
                        loading={paymentStart}
                        onClick={handlePay}
                    >
                        Pay Now
                    </Button>
                </div>

                <div className="modal-bottom-row mt-auto">
                    <div className="comment-msg-wrapper text-center">
                        <p className="w-full max-w-[265px] mx-auto uppercase text-[9px] text-center">
                            Securely enter your payment details above. It&apos;s a one-time payment only. No hidden charges or annoying rebills. Billed as
                            &quot;O-DRAGON&quot; to keep our little lewd secret.
                        </p>
                        <small className="w-full text-[9px] text-center text-[#959FAA]">- Zoe, Creator of Oppai Dragon 💖</small>
                    </div>
                    <div className="modal-bottom-banner w-full">
                        <div className="img-wrap relative w-full pt-[52%]">
                            <img alt="modalAvatar" className="absolute object-top top-0 left-0 h-full w-full object-cover" src={modalBottomAvatar} />
                        </div>
                    </div>
                </div>
            </div>
            <TncModal handleOk={() => setRedirectUrl("")} open={!!redirectUrl} redirect_url={redirectUrl} />
        </>
    );
};

export default VerotalPayment;
