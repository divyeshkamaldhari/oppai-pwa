import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { Link } from "react-router";
import React, { useState } from "react";
import "swiper/css";

import { ICometChatWaifuUser, IMainWaifuDetail } from "../../redux/slices/storeSlice";
import MyCollectionIcon from "../../assets/Icons/MyCollectionIcon";
import { APP_ROUTE } from "../../constants/AppRoutes";
import WaifuCard from "../WaifuCard";
import { useAppSelector } from "../../redux";
import GalleryModal from "../GalleryModal";
import Loader from "../Loader";

interface IWaifuCard {
    title: string;
    waifu_Data: IMainWaifuDetail;
    fromStore?: boolean;
    timeLeft?: {
        hours: string;
        minutes: string;
        seconds: string;
        discountActive: boolean;
    };
}

const WaifuSection: React.FC<IWaifuCard> = ({ title, waifu_Data, fromStore = false, timeLeft }) => {
    const { vault_paid_data, loading_paid_content } = useAppSelector((store) => store.vault);
    const { userDetail } = useAppSelector((state) => state.user);

    const [contentPurchase, setContentPurchase] = useState(false);
    const [ageVerified, setAgeVerified] = useState(false);

    const handleContentPurchaseModal = () => {
        setContentPurchase(false);
    };
    const collectionData = waifu_Data[title];

    // // Always produce an array
    // const items: ICometChatWaifuUser[] = React.useMemo(() => {
    //     if (!collectionData) return [];

    //     return Array.isArray(collectionData) ? (collectionData[0]?.themes ?? []) : (collectionData?.themes ?? []);
    // }, [collectionData]);

    // // Merge vault + items for "My Collection"
    // const mergedItems = React.useMemo(() => {
    //     if (title === "My Collection") {
    //         return [...(vault_paid_data ?? []), ...items];
    //     }

    //     return items;
    // }, [title, vault_paid_data, items]);

    const items: ICometChatWaifuUser[] = Array.isArray(collectionData) ? (collectionData[0]?.themes ?? []) : (collectionData?.themes ?? []);

    if (items.length === 0) return null;

    return (
        <div className={`w-full px-4 ${title === "My Collection" ? "p-4 bg-[#291846]" : ""}`}>
            <div className="flex flex-col gap-3.5">
                <div className="flex flex-wrap items-center justify-between">
                    <p className="mr-auto w-full max-w-[calc(100%-110px)] flex items-center gap-2 font-poppins text-sm font-medium leading-[140%] text-white">
                        {title} {title === "My Collection" && <MyCollectionIcon />}
                    </p>
                    <Link
                        className=" view-all transition-pwa font-poppins text-xs font-bold uppercase text-white hover:text-[#f41132] hover:underline"
                        state={{ fromStore: fromStore }}
                        to={`${APP_ROUTE.VAULT_VIEW_collection}/${title}`}
                    >
                        view All
                    </Link>
                </div>
                <div className="h-full w-full">
                    <Swiper
                        className="!overflow-visible !pr-7 [&_.swiper-wrapper]:flex [&_.swiper-wrapper]:items-stretch"
                        freeMode={true}
                        modules={[FreeMode]}
                        slidesPerView={2}
                        spaceBetween={10}
                    >
                        {(title === "My Collection" ? [...(vault_paid_data ?? []), ...items] : [...items])?.slice(0, 10)?.map((data, index) => (
                            <SwiperSlide key={index + 1} className="flex !h-auto flex-col">
                                <WaifuCard
                                    contentPurchase={contentPurchase}
                                    content_id={data.content_id}
                                    content_type_label={data.content_type}
                                    discount_price={data?.discount_price}
                                    free={data?.free || false}
                                    gallery={data.gallery}
                                    gallery_count={data?.gallery_count}
                                    gallery_thumbnail={data?.gallery_thumbnail}
                                    hot_deal={data?.hot_deal}
                                    price={data.price}
                                    rating={data?.rating}
                                    setContentPurchase={setContentPurchase}
                                    theme_name={data.theme_name}
                                    thumb_image={data.thumb_image}
                                    timeLeft={timeLeft}
                                    views={data?.views}
                                    waifu_name={data?.waifu_name}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                {contentPurchase &&
                    (vault_paid_data.length > 0 || !loading_paid_content ? (
                        <GalleryModal
                            ageVerified={ageVerified}
                            content_id={vault_paid_data[0]?.content_id}
                            content_type_label={vault_paid_data[0]?.content_type}
                            gallery={vault_paid_data[0]?.gallery}
                            handleOk={handleContentPurchaseModal}
                            isPurchaseFlow={false}
                            loading={loading_paid_content}
                            open={contentPurchase}
                            price={0}
                            setAgeVerified={setAgeVerified}
                            setContentPurchase={setContentPurchase}
                            theme_name={vault_paid_data[0]?.theme_name}
                            userDetail={userDetail}
                            waifu_name={vault_paid_data[0]?.waifu_name}
                        />
                    ) : (
                        <div className="emerchant-pay-modal absolute top-0 left-1/2 -translate-x-1/2 w-full z-[10]">
                            <Loader />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default WaifuSection;
