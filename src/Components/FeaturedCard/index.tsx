import { Button } from "antd";
import React, { useEffect, useState } from "react";

import AgeNotVerifiedModal from "../AgeNotVerifiedModal";
import { useAppSelector } from "../../redux";
import GalleryModal from "../GalleryModal";
import Stats from "../WaifuCard/Stats";

interface IFeaturedCard {
    title: string;
    subtitle: string;
    content_type: string;
    content_id: number;
    price: number;
    banner: string;
    gallery: string[];
    gallery_count: number;
    rating: number;
    views: number;
    gallery_thumbnail?: string[];
    contentPurchase: boolean;
    setContentPurchase: (vaule: boolean) => void;
}

const FeaturedCard: React.FC<IFeaturedCard> = ({
    content_type,
    subtitle,
    title,
    banner,
    gallery,
    content_id,
    price,
    gallery_count,
    views,
    rating,
    gallery_thumbnail,
    contentPurchase,
    setContentPurchase
}) => {
    const { userDetail } = useAppSelector((state) => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ageVerified, setAgeVerified] = useState(false);
    const isPurchaseFlow = !!(gallery_thumbnail && gallery_thumbnail?.length > 0);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        setAgeVerified(false);
    };

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

    const bgColor = typeColors[content_type.toLowerCase()] ?? "bg-[#BA176D]";

    return (
        <>
            <div className="relative h-full w-full rounded-[21px] overflow-hidden ">
                <div className="h-full w-full rounded-[21px]  pt-[47%]">
                    <Stats galleryCount={gallery_count} ratingCount={rating} viewsCount={views} />
                    <div className="absolute left-0 top-0 h-full w-full">
                        <img
                            alt="waifu-dp"
                            className={`h-full w-full object-cover object-center rounded-[21px] transition-opacity duration-500`}
                            fetchPriority="high"
                            loading="eager"
                            src={banner}
                        />
                        <div className="absolute left-0 top-0 h-full w-full  bg-[linear-gradient(180deg,_rgba(0,0,0,0)_-27.4%,_#000_100%)]" />
                    </div>
                    <div
                        className={`absolute right-0 top-4 max-w-[100px] min-w-[61px] rounded-l-xl px-2 py-1.5 text-[10px] text-center overflow-hidden font-bold overflow-ellipsis whitespace-nowrap uppercase leading-[10px] ${bgColor}`}
                    >
                        {content_type}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full rounded-[21px] p-3">
                    <div className="flex justify-between">
                        <div className="mr-auto flex w-full max-w-[calc(100%-144px)] flex-col">
                        <h2 className="font-poppins text-[22px] pwa-title font-semibold leading-6 whitespace-nowrap overflow-hidden text-ellipsis">
                            {title}
                        </h2>
                            <p className="font-poppins text-[10px] font-normal leading-none">{subtitle}</p>
                        </div>

                        <Button className="pwa-btn-sm max-w-[124px] !px-2 !font-poppins !text-xs uppercase !leading-none" type="primary" onClick={showModal}>
                            {isPurchaseFlow ? "UNLOCK THIS" : "OPEN NOW"}
                        </Button>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <GalleryModal
                    ageVerified={ageVerified}
                    content_id={content_id}
                    content_type_label={content_type}
                    gallery={isPurchaseFlow ? gallery_thumbnail : gallery}
                    handleOk={handleOk}
                    isPurchaseFlow={isPurchaseFlow}
                    loading={false}
                    open={isModalOpen}
                    price={price}
                    setAgeVerified={setAgeVerified}
                    setContentPurchase={setContentPurchase}
                    theme_name={subtitle}
                    userDetail={userDetail}
                    waifu_name={title}
                />
            )}
            <AgeNotVerifiedModal handleOk={handleOk} open={!isPurchaseFlow && isModalOpen && !userDetail.age_verified} />
            <AgeNotVerifiedModal handleOk={handleOk} open={!userDetail.age_verified && ageVerified} />
        </>
    );
};

export default FeaturedCard;
