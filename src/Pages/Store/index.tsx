import { useEffect } from "react";
import { useLocation } from "react-router";

import GiftCard from "../../Components/GiftCard";
import Header from "../../Components/Header";
import UnlockChat from "../../Components/UnlockChat";
import WaifuSection from "../../Components/WaifuSection";
import { APP_ROUTE } from "../../constants/AppRoutes";
import { useAppDispatch, useAppSelector } from "../../redux";
import { getStoreData } from "../../redux/slices/storeSlice";
import { updateNotification } from "../../redux/slices/userSlice";
import useVaultDiscountTimer from "../../Components/ContentDiscountWrapper";

const Store = () => {
    const { waifu_details } = useAppSelector((store) => store.store);
    const { userDetail } = useAppSelector((store) => store.user);
    const dispatch = useAppDispatch();
    const timeLeft = useVaultDiscountTimer();

    const location = useLocation();
    const path = location.pathname;

    useEffect(() => {
        if (path === APP_ROUTE.STORE) {
            dispatch(updateNotification({ notification_type: "store" }));
        }
    }, [path]);

    useEffect(() => {
        if (!userDetail?.master_access) {
            dispatch(getStoreData());
        }
    }, []);

    return (
        <div className="overflow-[unset] flex h-full w-[initial] flex-col text-white">
            <div className="sticky top-0 z-50 w-full">
                <Header />
            </div>
            <div className="flex w-full flex-col gap-y-8 overflow-hidden">
                {userDetail?.master_access ? (
                    <></>
                ) : (
                    <>
                        {!userDetail.chat_purchase && <UnlockChat />}
                        {waifu_details && Object.keys(waifu_details).map((data) => {
                            return <WaifuSection key={data} fromStore={true} title={data} waifu_Data={waifu_details} timeLeft={timeLeft} />;
                        })}
                    </>
                )}
                <GiftCard />
            </div>
        </div>
    );
};

export default Store;
