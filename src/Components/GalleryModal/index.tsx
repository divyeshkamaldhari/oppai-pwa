import type { Swiper as SwiperType } from "swiper";

import { Modal } from "antd";
import React, { useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs, Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import LeftArrow from "../../assets/Icons/LeftArrow";
import LockIcon from "../../assets/Icons/LockIcon";
import PurchaseButton from "../PurchaseButton";
import Header from "../Header";
import Loader from "../Loader";

import PixelatedGalleryImage from "./PixelatedGalleryImage";

interface IGalleryModal {
    open: boolean;
    handleOk: () => void;
    gallery: string[];
    waifu_name: string;
    theme_name: string;
    loading?: boolean;
    isPurchaseFlow: boolean;
    ageVerified: boolean;
    price: number;
    content_id: number;
    setAgeVerified: (value: boolean) => void;
    userDetail: { id: number };
    content_type_label: string;
    setContentPurchase: (value: boolean) => void;
}

const GalleryModal: React.FC<IGalleryModal> = ({
    open,
    handleOk,
    gallery,
    theme_name,
    waifu_name,
    loading,
    isPurchaseFlow,
    ageVerified,
    price,
    content_id,
    setAgeVerified,
    userDetail,
    content_type_label,
    setContentPurchase,
}) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <Modal
            className="!top-0 !m-0 !mx-auto !h-dvh !w-full !max-w-md !bg-[#130C1E] !p-0 [&_.ant-modal-body]:bg-[#130C1E] [&_.ant-modal-content]:h-dvh [&_.ant-modal-content]:bg-transparent [&_.ant-modal-content]:p-0 [&_.ant-modal-content]:text-white"
            closable={false}
            footer={null}
            open={open}
            title=""
        >
            <div className="overflow-[unset] flex h-full w-[initial] flex-col text-white">
                <div className="sticky top-0 z-50 flex w-full items-center">
                    <div aria-hidden className="pwa-back-btn-custom z-[51]" onClick={handleOk}>
                        <LeftArrow />
                    </div>
                    <Header />
                </div>
                {loading ? (
                    <div className="emerchant-pay-modal absolute top-0 h-full left-1/2 -translate-x-1/2 w-full z-[10]">
                        <Loader />
                    </div>
                ) : (
                    <div className="flex flex-col gap-y-4 overflow-hidden px-[22px] pb-[16px]">
                        <div className="flex w-full items-center justify-between gap-1 flex-wrap">
                            <p className="font-poppins text-lg font-semibold text-white">{theme_name}</p>
                            <p className="font-poppins text-sm font-normal text-white">{waifu_name}</p>
                        </div>
                        <div className="flex h-full w-full flex-col gap-3.5">
                            <div className="w-full">
                                <Swiper
                                    virtual
                                    className="mySwiper2 h-full w-full !overflow-visible [&_.swiper-button-next.swiper-button-disabled]:hidden [&_.swiper-button-next:after]:text-base [&_.swiper-button-next:after]:font-extrabold [&_.swiper-button-next:after]:text-white [&_.swiper-button-next:hover]:bg-[#f41132] [&_.swiper-button-next]:-right-4 [&_.swiper-button-next]:h-[35px] [&_.swiper-button-next]:w-[35px] [&_.swiper-button-next]:rounded-full [&_.swiper-button-next]:bg-[#CE2A42] [&_.swiper-button-next]:transition-all [&_.swiper-button-next]:duration-200 [&_.swiper-button-next]:ease-in [&_.swiper-button-prev.swiper-button-disabled]:hidden [&_.swiper-button-prev:after]:text-base [&_.swiper-button-prev:after]:font-extrabold [&_.swiper-button-prev:after]:text-white [&_.swiper-button-prev:hover]:bg-[#f41132] [&_.swiper-button-prev]:-left-4 [&_.swiper-button-prev]:h-[35px] [&_.swiper-button-prev]:w-[35px] [&_.swiper-button-prev]:rounded-full [&_.swiper-button-prev]:bg-[#CE2A42] [&_.swiper-button-prev]:transition-all [&_.swiper-button-prev]:duration-200 [&_.swiper-button-prev]:ease-in"
                                    loop={true}
                                    modules={[Navigation, Thumbs, Virtual]}
                                    navigation={true}
                                    spaceBetween={22}
                                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                                >
                                    {gallery?.map((image_url, index) => (
                                        <SwiperSlide key={image_url} virtualIndex={index}>
                                            <div className="relative aspect-video h-full w-full rounded-[21px] pt-[146%]">
                                                <div className="absolute left-0 top-0 h-full w-full">
                                                    {isPurchaseFlow ? (
                                                        <PixelatedGalleryImage className={"rounded-[20px]"} imageUrl={image_url} />
                                                    ) : (
                                                        <img
                                                            alt="waifu-dp"
                                                            className="h-full w-full rounded-[20px] object-cover"
                                                            loading="lazy"
                                                            src={image_url}
                                                        />
                                                    )}
                                                </div>
                                                {isPurchaseFlow && (
                                                    <div className="absolute top-0 z-10 flex w-full h-full flex-col items-center justify-center rounded-3xl border-2 p-10 sm:p-16 md:p-20 bg-white/5 backdrop-blur-[8px]">
                                                        <LockIcon className="" />

                                                        <div className="w-full max-w-[240px] rounded-3xl bg-[#381D67] shadow-lg z-[2] relative mt-2">
                                                            <PurchaseButton
                                                                activeIndex={activeIndex}
                                                                ageVerified={ageVerified}
                                                                amount={Number(price)}
                                                                btnClass="absolute w-full -top-4 !opacity-100"
                                                                btnText="unlock this"
                                                                isChatPurchase={false}
                                                                productDescription={`${waifu_name}-${theme_name}-${content_type_label}`}
                                                                productId={content_id}
                                                                qty={1}
                                                                setAgeVerified={setAgeVerified}
                                                                setContentPurchase={setContentPurchase}
                                                                slideIndex={index}
                                                                userId={userDetail.id}
                                                            />

                                                            <p className="px-4 pb-4 pt-12 text-center text-xs text-white/90">
                                                                Easy peasy: <b>Buy the pack once. Own the pack forever.</b>
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                            <div className="-mx-[22px] w-[initial]">
                                <Swiper
                                    virtual
                                    className="mySwiper h-full w-full !px-[22px] [&_.swiper-slide]:border-transparent [&_.swiper-slide]:transition-border [&_.swiper-slide]:duration-200 [&_.swiper-slide]:ease-in"
                                    freeMode={true}
                                    loop={false}
                                    modules={[FreeMode, Navigation, Thumbs, Virtual]}
                                    slideToClickedSlide={true}
                                    slidesPerView={5}
                                    spaceBetween={10}
                                    watchSlidesProgress={true}
                                    onSwiper={setThumbsSwiper}
                                >
                                    {gallery?.map((image_url, index) => (
                                        <SwiperSlide key={image_url} virtualIndex={index}>
                                            <div
                                                className={`relative aspect-[3/4] h-full w-full rounded-[10px] pt-[146%] ${activeIndex === index ? "border-[#CE2A42] border-2" : "border-transparent border"}`}
                                            >
                                                <div className="absolute left-0 top-0 h-full w-full">
                                                    {isPurchaseFlow ? (
                                                        <PixelatedGalleryImage className={"rounded-[10px]"} imageUrl={image_url} />
                                                    ) : (
                                                        <img alt="waifu-dp" className="h-full w-full rounded-[10px]" loading="lazy" src={image_url} />
                                                    )}
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default GalleryModal;
