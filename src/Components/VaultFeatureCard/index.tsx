import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import React, { useState } from "react";
import "swiper/css";

import { useAppSelector } from "../../redux";
import FeaturedCard from "../FeaturedCard";
import GalleryModal from "../GalleryModal";
import Loader from "../Loader";

const VaultFeatureCard: React.FC = () => {
    const { vault_fatured_data, vault_paid_data, loading_paid_content } = useAppSelector((store) => store.vault);
    const { userDetail } = useAppSelector((state) => state.user);

    const [contentPurchase, setContentPurchase] = useState(false);
    const [ageVerified, setAgeVerified] = useState(false);

    // const slides = useMemo(
    //     () =>
    //         vault_fatured_data.map((data) => (
    //             <SwiperSlide key={data.content_id}>
    //                 <FeaturedCard {...data} />
    //             </SwiperSlide>
    //         )),
    //     [vault_fatured_data],
    // );
    const handleContentPurchaseModal = () => {
        setContentPurchase(false);
    };

    if (vault_fatured_data.length === 0) return null;

    return (
        <div className="w-full">
            <Swiper
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                className="!pb-6 rounded-[21px] overflow-hidden
                [&_.swiper-pagination-bullet-active]:!bg-[#CE2A42] 
                [&_.swiper-pagination-bullet-active]:!opacity-100 
                [&_.swiper-pagination-bullet]:bg-white 
                [&_.swiper-pagination-bullet]:!opacity-100 
                [&_.swiper-pagination]:!bottom-[0px] 
                [&_.swiper-pagination]:pr-[49px]
                [&_.swiper-pagination>span]:transition-all
                [&_.swiper-pagination>span]:duration-200
                [&_.swiper-pagination>span]:ease-in
                [&_.swiper-pagination>span]:!mx-[2px]
                [&_.swiper-pagination]:!text-end"
                loop={true}
                modules={[Pagination, Autoplay]}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                slidesPerView={"auto"}
                spaceBetween={10}
            >
                {vault_fatured_data?.map((data) => {
                    return (
                        <SwiperSlide key={data.content_id}>
                            <FeaturedCard
                                banner={data.banner}
                                contentPurchase={contentPurchase}
                                content_id={data.content_id}
                                content_type={data.content_type}
                                gallery={data.gallery}
                                gallery_count={data.gallery_count}
                                gallery_thumbnail={data?.gallery_thumbnail}
                                price={data.price}
                                rating={data.rating}
                                setContentPurchase={setContentPurchase}
                                subtitle={data.subtitle}
                                title={data.title}
                                views={data.views}
                            />
                        </SwiperSlide>
                    );
                })}
                {/* {slides} */}
            </Swiper>
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
                    <div className="emerchant-pay-modal absolute top-0 h-full left-1/2 -translate-x-1/2 w-full z-[10]">
                        <Loader />
                    </div>
                ))}
        </div>
    );
};

export default VaultFeatureCard;
