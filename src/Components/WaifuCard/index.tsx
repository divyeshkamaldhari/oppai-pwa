import { useEffect, useState } from "react";
import { Button } from "antd";

import AgeNotVerifiedModal from "../AgeNotVerifiedModal";
import { useAppDispatch, useAppSelector } from "../../redux";
import GalleryModal from "../GalleryModal";
import { updateVaultFreeNotification } from "../../redux/slices/userSlice";

import Stats from "./Stats";

interface IWaifuCard {
    theme_name: string;
    thumb_image: string;
    content_id: number;
    price: number;
    waifu_name: string;
    content_type_label: string;
    gallery: string[];
    free?: boolean;
    gallery_count: number;
    rating: number;
    views: number;
    gallery_thumbnail?: string[];
    hot_deal?: boolean;
    discount_price?: number;
    timeLeft?: {
        hours: string;
        minutes: string;
        seconds: string;
        discountActive: boolean;
    };
    contentPurchase: boolean;
    setContentPurchase: (vaule: boolean) => void;
}

const WaifuCard: React.FC<IWaifuCard> = ({
    theme_name,
    waifu_name,
    content_type_label,
    thumb_image,
    gallery,
    price,
    content_id,
    free,
    gallery_count,
    views,
    rating,
    gallery_thumbnail,
    hot_deal,
    discount_price,
    timeLeft,
    setContentPurchase,
    contentPurchase,
}) => {
    const { userDetail } = useAppSelector((state) => state.user);
    const { minutes, seconds, hours } = timeLeft || {};

    const dispatch = useAppDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ageVerified, setAgeVerified] = useState(false);
    const isPurchaseFlow = !!(gallery_thumbnail && gallery_thumbnail?.length > 0);
    const isHotDealActive = hot_deal && timeLeft?.discountActive;

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        setAgeVerified(false);
    };

    useEffect(() => {
        if (userDetail?.age_verified && userDetail?.free_label === "" && free && isModalOpen) {
            dispatch(updateVaultFreeNotification());
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (contentPurchase) {
            setIsModalOpen(false);
        }
    }, [contentPurchase]);

    const typeColors: Record<string, string> = {
        hentai: "bg-[#BA176D]",
        ecchi: "bg-[#1E7D35]",
        error: "bg-[#BA176D]",
    };

    const bgColor = typeColors[content_type_label?.toLowerCase()] ?? "bg-[#BA176D]";

    return (
        <>
            <div
                className={`relative anim-border-box  waifu-card transition-pwa flex h-full flex-col overflow-hidden rounded-b-[30px] rounded-t-[21px] bg-[#381D67] hover:bg-[#5217BA] ${isHotDealActive ? "active-hotDeal" : ""}`}
            >
                <Stats galleryCount={gallery_count} ratingCount={rating} viewsCount={views} />
                <div className="relative h-full w-full bg-[#381D67] rounded-t-[20px]">
                    <div className="relative aspect-square h-full w-full pt-[100%] ">
                        <img
                            alt="waifu-dp"
                            className="absolute left-0 top-0 h-full w-full rounded-[20px] object-cover object-[0px_-6px]"
                            loading="lazy"
                            src={thumb_image}
                        />
                    </div>
                    <div
                        className={`absolute right-0 top-4 max-w-[100px] min-w-[61px] rounded-l-xl px-2 py-1.5 text-[10px] text-center overflow-hidden font-bold overflow-ellipsis whitespace-nowrap uppercase leading-[10px] ${bgColor}`}
                    >
                        {content_type_label}
                    </div>
                    {free && (
                        <div
                            className={`free-label  absolute right-0 bottom-0 w-full px-2 py-1 text-[12px] text-[#381D67] text-center overflow-hidden font-bold overflow-ellipsis whitespace-nowrap uppercase leading-[10px] tracking-[23%] bg-white`}
                        >
                            free
                        </div>
                    )}
                    {isHotDealActive && (
                        <div className="shine-doodle absolute right-0 bottom-0 w-full bg-[#1CBD43] px-1 pb-1 pt-1.5 font-poppins text-sm text-xs font-bold uppercase leading-[140%] flex justify-center items-center gap-y-1 gap-x-3 flex-wrap">
                            30% OFF
                            <div className="inline-flex pwa-clock !ml-0">
                                <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex h-full flex-col items-center justify-center gap-2.5 py-[13px] z-[2] bg-[#381D67] rounded-b-[30px]">
                    <div className="flex flex-col items-center gap-y-[4px] px-1">
                        <h3 className="text-center font-poppins text-base font-semibold leading-[100%]">{theme_name}</h3>
                        <p className="font-poppins text-xs font-normal leading-[140%] text-center">{waifu_name}</p>
                    </div>
                    <div className="mt-auto w-full px-3">
                        <Button className="pwa-btn-sm w-full !px-2 !font-poppins !text-xs uppercase !leading-none" type="primary" onClick={showModal}>
                            {isPurchaseFlow ? "I WANT IT" : "OPEN NOW"}
                        </Button>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <GalleryModal
                    ageVerified={ageVerified}
                    content_id={content_id}
                    content_type_label={content_type_label}
                    gallery={isPurchaseFlow ? gallery_thumbnail : gallery}
                    handleOk={handleOk}
                    isPurchaseFlow={isPurchaseFlow}
                    loading={false}
                    open={isModalOpen}
                    price={isHotDealActive && discount_price ? discount_price : price}
                    setAgeVerified={setAgeVerified}
                    setContentPurchase={setContentPurchase}
                    theme_name={theme_name}
                    userDetail={userDetail}
                    waifu_name={waifu_name}
                />
            )}
            <AgeNotVerifiedModal handleOk={handleOk} open={!isPurchaseFlow && isModalOpen && !userDetail.age_verified} />
            <AgeNotVerifiedModal handleOk={handleOk} open={!userDetail.age_verified && ageVerified} />
        </>
    );
};

export default WaifuCard;
