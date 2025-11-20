import { useEffect, useState } from "react";

import OnlyLoader from "../../Components/Loader/OnlyLoader";
import { useAppDispatch, useAppSelector } from "../../redux";
import { completePaymentOrder, failPaymentOrder } from "../../redux/slices/purchaseSlice";

const PurchaseCallback = () => {
    const { order_id, transaction_id, product_id } = useAppSelector((state) => state.purchase);
    const dispatch = useAppDispatch();
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const rawStatus = params.get("purchaseStatus");
        let purchaseStatus = rawStatus;
        let item = params.get("item");

        if (!item && purchaseStatus?.includes("=")) {
            const [cleanStatus, itemVal] = purchaseStatus.split("=");

            purchaseStatus = cleanStatus;
            item = itemVal;
        }

        if (window.parent) {
            if (purchaseStatus === "cancelled" || purchaseStatus === "failed") {
                dispatch(failPaymentOrder({ transaction_id, order_id }))
                    .unwrap()
                    .then(() => {
                        window.parent.postMessage({ type: "emerchantpay", status: purchaseStatus }, window.origin);
                    });
            }

            if (purchaseStatus === "success") {
                dispatch(completePaymentOrder({ transaction_id, order_id, product_id }))
                    .unwrap()
                    .then(() => {
                        window.parent.postMessage({ type: "emerchantpay", status: purchaseStatus, item: item || null }, window.origin);
                        window.parent.postMessage({ type: "purchaseSuccess", item: item || null }, window.origin);
                    });
            }
        }

        const timer = setTimeout(() => {
            setShowLoader(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (showLoader) {
        return (
            <div className="purchasecallback absolute top-0 left-0 z-40 h-full overflow-hidden w-full">
                <OnlyLoader isPurchaseCallBack={true} />
            </div>
        );
    }

    return null;
};

export default PurchaseCallback;
