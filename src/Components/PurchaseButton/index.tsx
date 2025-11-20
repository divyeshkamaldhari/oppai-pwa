import { useEffect, useState } from "react";
import { Button, notification } from "antd";
import axios from "axios";

import {
    createPaymentOrder,
    getFromLocalStorage,
    IchatPurchaseLoadPayload,
    reSetChatStatus,
    setChatStatus,
    setTransectionId,
} from "../../redux/slices/purchaseSlice";
import { generateTransectionId, parseXML } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../redux";
import { APP_ROUTE } from "../../constants/AppRoutes";
import EMerchantPayModal from "../EMerchantPayModal";
import { API_URL } from "../../constants/ApiRoute";
import VerotalPayModal from "../VerotalPayModal";
import executeHttp from "../../Service/api";
import LewdWarningModal from "../LewdWarningModal";
import { DEVLOPMENT_ENVIRONMENT } from "../../constants/EnvConstants";

interface IPurchaseButton {
    btnText: string;
    btnClass: string;
    isChatPurchase?: boolean;
    amount: number;
    productId: number | string;
    userId: number;
    qty: number;
    productDescription: string;
    ageVerified: boolean;
    setAgeVerified: (data: boolean) => void;
    type?: string;
    productIds?:
        | {
              [x: string]: number;
          }
        | number;
    activeIndex?: number;
    slideIndex?: number;
    setContentPurchase?: (value: boolean) => void;
}

const PurchaseButton: React.FC<IPurchaseButton> = ({
    btnClass,
    btnText,
    isChatPurchase = false,
    amount,
    productId,
    userId,
    productDescription,
    ageVerified,
    setAgeVerified,
    type = "",
    qty,
    productIds,
    activeIndex = 1,
    slideIndex = 1,
    setContentPurchase,
}) => {
    const { userDetail, paymentMethod } = useAppSelector((state) => state.user);
    const { isChat } = useAppSelector((state) => state.purchase);
    const [api, contextHolder] = notification.useNotification();
    const [redirectUrl, setRedirectUrl] = useState<string>("");
    const [lewdWarningModalOpen, setLewdWarningModalOpen] = useState<boolean>(false);

    const [sessionId, setSessionId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const body = document.body;

    const chatSuccess = `${window.location.origin}${APP_ROUTE.PURCHASE_CALLBACK}?purchaseStatus=success&item=chat`;
    const CollectionSuccess = `${window.location.origin}${APP_ROUTE.PURCHASE_CALLBACK}?purchaseStatus=success`;
    let successUrl = isChat ? chatSuccess : CollectionSuccess;
    const cancleUrl = `${window.location.origin}${APP_ROUTE.PURCHASE_CALLBACK}?purchaseStatus=cancelled`;
    const failureUrl = `${window.location.origin}${APP_ROUTE.PURCHASE_CALLBACK}?purchaseStatus=failed`;
    const notificationUrl = `${window.location.origin}${APP_ROUTE.PURCHASE_CALLBACK}?purchaseStatus=notification`;
    const transectionId = `${generateTransectionId()}-${productId}-${userId}`;

    const startEMPPurchase = async () => {
        successUrl = getFromLocalStorage("isChat", false) ? chatSuccess : CollectionSuccess;
        setLoading(true);
        const xmlData = `
            <?xml version="1.0" encoding="UTF-8"?>
            <wpf_payment>
            <transaction_id>${transectionId}</transaction_id>
            <amount>${Math.round(amount * 100)}</amount>
            <currency>USD</currency>
            <description>${productDescription}</description>
            <notification_url>${notificationUrl}</notification_url>
            <return_success_url>${successUrl}</return_success_url>
            <return_cancel_url>${cancleUrl}</return_cancel_url>
            <return_failure_url>${failureUrl}</return_failure_url>
            <transaction_types>
                ${DEVLOPMENT_ENVIRONMENT === "prod" ? '<transaction_type name="sale"/>' : '<transaction_type name="sale3d"/>'}
            </transaction_types>
            </wpf_payment>
        `;
        // ${DEVLOPMENT_ENVIRONMENT === "prod" ? `<transaction_type name="apple_pay" payment_subtype="sale"/>` : ``}
        //  <transaction_type name="sale3d"/>
        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: API_URL.USER.EMERCHANT_PAYMENT,
            headers: {
                "Content-Type": "application/json",
            },
            data: { data: xmlData },
        };

        try {
            const response = await axios.request(config);
            const parsed = parseXML(response.data);

            if (parsed.redirect_url) {
                setRedirectUrl(parsed.redirect_url);
                // dispatch(setTransectionId({ transaction_id: transectionId, product_id: productId }));
                // let payload: IchatPurchaseLoadPayload;

                // if (type === "gift" && typeof productIds === "object") {
                //     payload = { name: userDetail.name, price: amount, type: "gift", product_ids: productIds };
                // } else {
                //     payload = { name: userDetail.name, price: amount, product_id: productId, qty };
                // }

                let payload: IchatPurchaseLoadPayload;

                if (type === "gift" && typeof productIds === "object") {
                    payload = { name: userDetail.name, price: amount, type: "gift", product_ids: productIds };
                    dispatch(setTransectionId({ transaction_id: transectionId, product_id: productIds }));
                } else {
                    payload = { name: userDetail.name, price: amount, product_id: productId, qty };
                    dispatch(setTransectionId({ transaction_id: transectionId, product_id: productId }));
                }
                dispatch(createPaymentOrder(payload));
            } else if (parsed.technical_message && parsed.status === "error") {
                throw new Error(parsed.technical_message);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log("Error:", error);
            openNotification();
        } finally {
            setLoading(false);
        }
    };

    const startVerotalPurchase = async () => {
        successUrl = getFromLocalStorage("isChat", false) ? chatSuccess : CollectionSuccess;
        setLoading(true);
        const updatedAmount = `${amount.toFixed(2)}`;

        try {
            const reqPayload = {
                amount: updatedAmount,
                currency: "USD",
                successUrl: successUrl,
                declineUrl: cancleUrl,
                postbackUrl: failureUrl,
                email: userDetail.email,
            };

            const response = await executeHttp({
                url: API_URL.USER.VEROTAL_PAYMENT,
                method: "POST",
                data: { data: reqPayload },
            });
            const id = response?.data;

            setSessionId(id.sessionId);
            let payload: IchatPurchaseLoadPayload;

            if (type === "gift" && typeof productIds === "object") {
                payload = { name: userDetail.name, price: amount, type: "gift", product_ids: productIds };
                dispatch(setTransectionId({ transaction_id: transectionId, product_id: productIds }));
            } else {
                payload = { name: userDetail.name, price: amount, product_id: productId, qty };
                dispatch(setTransectionId({ transaction_id: transectionId, product_id: productId }));
            }

            dispatch(createPaymentOrder(payload));
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("❌ Error starting purchase:", error);
            openNotification();
        } finally {
            setLoading(false);
        }
    };

    const startPurchase = async () => {
        if (isChatPurchase) {
            dispatch(setChatStatus());
        } else {
            dispatch(reSetChatStatus());
        }

        if (!userDetail.age_verified) {
            setAgeVerified(true);
        } else if (paymentMethod === "Emerchantpay") {
            startEMPPurchase();
        } else if (paymentMethod === "Verotel") {
            startVerotalPurchase();
        } else {
            openNotification();
        }

        // body.classList.add("no-scroll");
    };

    const handleOk = () => {
        setRedirectUrl("");
        setSessionId("");
        setLewdWarningModalOpen(false);
        body.classList.remove("no-scroll");
    };

    const handleLewdWarningOk = () => {
        setLewdWarningModalOpen(true);
    };

    const handlePaymentAfterCancel = () => {
        if (redirectUrl === "") {
            startPurchase();
        }
        setLewdWarningModalOpen(false);
    };

    const openNotification = () => {
        api.error({
            message: "Purchase Failed 😭",
            description: "Uh oh… your payment didn’t go through! Try again with another card or check with your bank.",
            placement: "topRight",
        });
    };

    const openSuccessNotification = () => {
        api.success({
            message: "Purchase Successful 🎉",
            description: "Yatta! Your payment went through. Enjoy your purchase, Otaku! Big thanks!",
            placement: "topRight",
        });
    };

    useEffect(() => {
        if (activeIndex === slideIndex && ageVerified && userDetail.age_verified) {
            startPurchase();
        }
    }, [userDetail.age_verified]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event?.data?.type === "emerchantpay") {
                if (redirectUrl !== "" || sessionId !== "") {
                    // if (event?.data?.status === "cancelled") {
                    //     setRedirectUrl("");
                    //     setSessionId("");
                    //     handleLewdWarningOk();
                    // }
                    if (event?.data?.status === "cancelled" || event?.data?.status === "failed") {
                        handleOk();
                        openNotification();
                    }
                    if (event?.data?.status === "success" || event?.data?.status?.includes("success")) {
                        console.log('event?.data: ', event?.data);
                        handleOk();
                        openSuccessNotification();
                        if (event.data.item === null || event?.data?.item !== "chat") {
                            setContentPurchase?.(true);
                        }
                    }
                }
            }
        };

        window.addEventListener("message", handleMessage);

        return () => window.removeEventListener("message", handleMessage);
    }, [redirectUrl]);

    return (
        <>
            {contextHolder}
            <Button className={btnClass} loading={loading} type="primary" onClick={startPurchase}>
                {btnText}
            </Button>
            {!!redirectUrl && (
                <EMerchantPayModal handleLewdWarningOk={handleLewdWarningOk} handleOk={handleOk} open={!!redirectUrl} redirect_url={redirectUrl} />
            )}
            {!!sessionId && <VerotalPayModal handleOk={handleOk} open={!!sessionId} sessionId={sessionId} />}
            {lewdWarningModalOpen && <LewdWarningModal handleOk={handleOk} handlePaymentAfterCancel={handlePaymentAfterCancel} open={lewdWarningModalOpen} />}
        </>
    );
};

export default PurchaseButton;
