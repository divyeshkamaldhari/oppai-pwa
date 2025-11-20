import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

import { getStoreGiftData, IGiftDetails } from "../../redux/slices/storeSlice";
import { useAppDispatch, useAppSelector } from "../../redux";
import PurchaseButton from "../../Components/PurchaseButton";
import LeftArrow from "../../assets/Icons/LeftArrow";
import HeartIcon from "../../assets/Icons/HeartIcon";
import Counter from "../../Components/Counter";
import Header from "../../Components/Header";
import AgeNotVerifiedModal from "../../Components/AgeNotVerifiedModal";

const Gift = () => {
    const { gift_details } = useAppSelector((store) => store.store);
    const { userDetail } = useAppSelector((state) => state.user);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [quantities, setQuantities] = useState<{ [giftId: number]: number }>({});

    const [ageVerified, setAgeVerified] = useState(false);

    function calculateTotalAmount(giftDetails: IGiftDetails[], quantities: { [x: string]: number;[x: number]: number }) {
        return giftDetails.reduce((total: number, gift: { id: string | number; price_html: string }) => {
            const qty = quantities[gift.id] || 0;
            const price = parseFloat(gift.price_html) || 0;

            return total + price * qty;
        }, 0);
    }

    function calculateTotalQTY(giftDetails: IGiftDetails[], quantities: { [x: string]: number;[x: number]: number }) {
        return giftDetails.reduce((total: number, gift: { id: string | number; price_html: string }) => {
            const qty = quantities[gift.id] || 0;

            return total + qty;
        }, 0);
    }

    const totalAmount = calculateTotalAmount(gift_details, quantities);
    const totalQTY = calculateTotalQTY(gift_details, quantities);

    const idString = Object.entries(quantities)
        .filter(([_, qty]) => qty > 0)
        .map(([id]) => id)
        .join("-");

    const entries = Object.entries(quantities).filter(([_, qty]) => qty > 0);

    const idArray = entries.length < 1 ? 0 : Object.fromEntries(entries);

    useEffect(() => {
        if (gift_details?.length) {
            const initialQuantities = gift_details.reduce(
                (acc, gift) => {
                    acc[gift.id] = gift.title === "Bubble Tea" ? 1 : 0;

                    return acc;
                },
                {} as { [giftId: number]: number },
            );

            setQuantities(initialQuantities);
        }
    }, [gift_details]);

    const incrementMatch = (giftId: number, maxQty: number) => {
        setQuantities((prev) => ({
            ...prev,
            [giftId]: Math.min(prev[giftId] + 1, maxQty),
        }));
    };

    const decrementMatch = (giftId: number) => {
        setQuantities((prev) => ({
            ...prev,
            [giftId]: Math.max(prev[giftId] - 1, 0),
        }));
    };

    const bgColors = ["bg-[#381D67]", "bg-[#5217BA]", "bg-[#750717]"];

    const handleOk = () => {
        setAgeVerified(false);
    };

    useEffect(() => {
        dispatch(getStoreGiftData());
    }, []);

    return (
        <>
            <div className="overflow-[unset] flex h-full w-[initial] flex-col text-white">
                <div className="sticky top-0 z-50 flex w-full items-center">
                    {window.history.length > 1 && (
                        <div aria-hidden className="pwa-back-btn-custom z-[51]" onClick={() => navigate(-1)}>
                            <LeftArrow />
                        </div>
                    )}
                    <Header />
                </div>
                <div className="flex flex-col gap-8 px-4">
                    <h1 className="text-center font-luckiest-guy text-[25px] font-normal leading-7 text-white">
                        Show me you&apos;re my #1. <span className="text-[#CE2A42] block w-full font-luckiest-guy">Spoil me with my fave gifts!</span>
                    </h1>
                    <div className="flex w-full flex-col gap-2">
                        {gift_details?.map((gift, i) => {
                            const count = quantities[gift.id] || 0;
                            const maxQty = gift.max_qty;

                            return (
                                <div key={gift.title} className="pt-[6px]">
                                    <div
                                        key={gift.id}
                                        className={`relative flex rounded-[100px] items-center p-[3px] ${bgColors[i % bgColors.length]} text-white`}
                                    >
                                        {gift.is_favorite && (
                                            <div className="absolute -top-[5px] left-0 z-[1] flex items-center gap-1 rounded-full bg-[#5B8A11] px-2 py-1 text-[7px] font-bold uppercase leading-[10px] tracking-[1.5px]">
                                                <HeartIcon />
                                                my fave
                                            </div>
                                        )}
                                        <div className="h-[70px] w-[70px]">
                                            <div className="relative h-full w-full rounded-full bg-[#0000004D]">
                                                <div className="relative aspect-square h-full w-full pt-[100%]">
                                                    <img
                                                        alt="gift-image"
                                                        className="absolute left-1/2 top-1/2 z-[5] h-full w-full max-w-[42px] -translate-x-1/2 -translate-y-1/2 object-contain object-center"
                                                        loading="lazy"
                                                        src={gift.image}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full max-w-[calc(100%-70px)] flex-wrap items-center justify-between gap-y-2 px-4">
                                            <div className="flex w-full max-w-[calc(100%-100px)] flex-col gap-1.5 pr-2">
                                                <p className="font-poppins text-sm font-semibold leading-none text-white">{gift.title}</p>
                                                <p className="font-poppins text-xs font-medium leading-none text-white">${gift.price_html} only</p>
                                            </div>
                                            <Counter
                                                count={count}
                                                decrementCounter={() => decrementMatch(gift.id)}
                                                disableDecrement={count <= 0}
                                                disableIncrement={count >= maxQty}
                                                incrementCount={() => incrementMatch(gift.id, maxQty)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-center">
                        <PurchaseButton
                            ageVerified={ageVerified}
                            amount={Number(totalAmount)}
                            btnClass="!w-max !px-10 !py-4 !font-bold uppercase !leading-5"
                            btnText="SHOW HER MY LOVE"
                            isChatPurchase={false}
                            productDescription={`Purchase gift for waifu.`}
                            productId={idString}
                            productIds={idArray}
                            qty={totalQTY}
                            setAgeVerified={setAgeVerified}
                            type="gift"
                            userId={userDetail.id}
                        />
                    </div>
                </div>
            </div>
            <AgeNotVerifiedModal handleOk={handleOk} open={!userDetail.age_verified && ageVerified} />
        </>
    );
};

export default Gift;
