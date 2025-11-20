import { useNavigate, useParams } from "react-router";
import { RefObject, useEffect, useRef, useState } from "react";
import { Spin } from "antd";

import {
    getVaultCharacterContentDataByKey,
    getVaultFanFavData,
    getVaultMyCollectionData,
    getVaultNewReleasedData,
    getVaultPaidData,
} from "../../redux/slices/vaultSlice";
import { ICometChatWaifuUser, IMainWaifuDetail, IMainWaifuEntry } from "../../redux/slices/storeSlice";
import MyCollectionIcon from "../../../public/assets/MyCollectionIcon.png";
import { useAppDispatch, useAppSelector } from "../../redux";
import LeftArrow from "../../assets/Icons/LeftArrow";
import WaifuCard from "../../Components/WaifuCard";
import Header from "../../Components/Header";
import useVaultDiscountTimer from "../../Components/ContentDiscountWrapper";
import GalleryModal from "../../Components/GalleryModal";
import Loader from "../../Components/Loader";

interface ICollection {
    fetchData?: boolean;
    scrollRef?: RefObject<HTMLDivElement | null>;
}

const Collection = ({ fetchData, scrollRef }: ICollection) => {
    const {
        vault_character_data,
        vault_fan_fav,
        vault_new_release,
        loading_new_releases,
        loading_fan_faves,
        loading_character_content,
        vault_my_collection,
        vault_paid_data,
        loading_paid_content,
    } = useAppSelector((store) => store.vault);
    const { userDetail } = useAppSelector((state) => state.user);
    const [contentPurchase, setContentPurchase] = useState(false);
    const [ageVerified, setAgeVerified] = useState(false);
    const handleContentPurchaseModal = () => {
        setContentPurchase(false);
    };
    const { collection } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const timeLeft = useVaultDiscountTimer();

    const sparedData: IMainWaifuDetail = {
        "My Collection": vault_my_collection,
        "Fan Faves!": vault_fan_fav,
        "New Releases": vault_new_release,
        ...vault_character_data,
    };

    const collectionParam = useRef(collection);

    const collectionData = sparedData[collection as string];

    const items: ICometChatWaifuUser[] = Array.isArray(collectionData) ? (collectionData[0]?.themes ?? []) : (collectionData?.themes ?? []);
    const currentEntry: IMainWaifuEntry | undefined = Array.isArray(collectionData) ? collectionData[0] : collectionData;
    const currentEntryRef = useRef(currentEntry);

    const isLoading =
        (collection === "My Collection" && loading_new_releases) ||
        (collection === "New Releases" && loading_new_releases) ||
        (collection === "Fan Faves!" && loading_fan_faves) ||
        (!["New Releases", "Fan Faves!", "My Collection"].includes(collection || "") && loading_character_content);

    const currentLoading = useRef(isLoading);

    const loadMore = () => {
        const entry = currentEntryRef.current;

        if (!entry || currentLoading.current) return;

        if (entry.per_page * entry.page < entry.total) {
            const nextPage = entry.page + 1;

            if (collectionParam.current === "My Collection") {
                dispatch(getVaultMyCollectionData({ page: nextPage }));
                dispatch(getVaultPaidData());
            } else if (collectionParam.current === "New Releases") {
                dispatch(getVaultNewReleasedData({ page: nextPage }));
            } else if (collectionParam.current === "Fan Faves!") {
                dispatch(getVaultFanFavData({ page: nextPage }));
            } else {
                dispatch(
                    getVaultCharacterContentDataByKey({
                        page: nextPage,
                        key: collectionParam.current as string,
                    }),
                );
            }
        }
    };

    useEffect(() => {
        if (fetchData) {
            loadMore();
        }
    }, [fetchData]);

    useEffect(() => {
        currentEntryRef.current = currentEntry;
        currentLoading.current = isLoading;
        collectionParam.current = collection;
    }, [currentEntry, isLoading, collection]);

    useEffect(() => {
        if (scrollRef?.current) {
            scrollRef.current.scrollTo({
                top: 0,
            });
        }
        if (collection && items && items.length === 0) {
            if (collectionParam.current === "My Collection") {
                dispatch(getVaultMyCollectionData({ page: 1 }));
                dispatch(getVaultPaidData());
            } else if (collectionParam.current === "New Releases") {
                dispatch(getVaultNewReleasedData({ page: 1 }));
            } else if (collectionParam.current === "Fan Faves!") {
                dispatch(getVaultFanFavData({ page: 1 }));
            } else {
                dispatch(
                    getVaultCharacterContentDataByKey({
                        page: 1,
                        key: collectionParam.current as string,
                    }),
                );
            }
        }
    }, [collection]);

    return (
        <div className="overflow-[unset] flex h-full w-[initial] flex-col text-white">
            <div className="sticky top-0 z-50 flex w-full items-center">
                {window.history.length > 1 && (
                    <div aria-hidden className="pwa-back-btn-custom z-[51]" onClick={() => navigate(-1)}>
                        <LeftArrow />
                    </div>
                )}
                <Header />
            </div>
            <div className="flex flex-col gap-3.5 px-4 relative">
                <h1 className="text-center flex items-center justify-center gap-2 font-luckiest-guy text-xl font-medium text-white">
                    {collection === "My Collection" && <img alt="my collection" className="w-6 h-6" src={MyCollectionIcon} />}
                    {collection}
                </h1>
                <div className="grid h-full w-full grid-cols-2 gap-x-2.5 gap-y-3.5">
                    {(collection === "My Collection" ? [...(vault_paid_data ?? []), ...items] : [...items])?.map((data) => (
                        <WaifuCard
                            key={data.content_id}
                            contentPurchase={contentPurchase}
                            content_id={data.content_id}
                            content_type_label={data.content_type}
                            discount_price={data?.discount_price}
                            free={data?.free || false}
                            gallery={data.gallery}
                            gallery_count={data.gallery_count}
                            gallery_thumbnail={data?.gallery_thumbnail}
                            hot_deal={data?.hot_deal}
                            price={data.price}
                            rating={data.rating}
                            setContentPurchase={setContentPurchase}
                            theme_name={data.theme_name}
                            thumb_image={data.thumb_image}
                            timeLeft={timeLeft}
                            views={data.views}
                            waifu_name={data.waifu_name}
                        />
                    ))}
                </div>
                {isLoading && (
                    <Spin rootClassName="relative left-0 [&_.ant-spin-dot-item]:bg-[#CE2A42] bg-[#381d6738] backdrop-blur-[10px]" size="large">
                        <div className="py-4 text-center text-white max-w-md bg-[#381D67]">Loading More Waifu data...</div>
                    </Spin>
                )}
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

export default Collection;
