import { useLocation } from "react-router";
import React, { useEffect } from "react";

import { updateNotification } from "../../redux/slices/userSlice";
import VaultFeatureCard from "../../Components/VaultFeatureCard";
import { useAppDispatch, useAppSelector } from "../../redux";
import WaifuSection from "../../Components/WaifuSection";
import { APP_ROUTE } from "../../constants/AppRoutes";
import Header from "../../Components/Header";
import {
    getVaultCharacterContentData,
    getVaultFanFavData,
    getVaultFeaturedData,
    getVaultMyCollectionData,
    getVaultNewReleasedData,
    getVaultPaidData,
} from "../../redux/slices/vaultSlice";
import WantSideWaifuSection from "../../Components/WaifuSection/WantSideWaifuSection";
import useVaultDiscountTimer from "../../Components/ContentDiscountWrapper";

const Vault = () => {
    const { vault_character_data, vault_new_release, vault_fan_fav, vault_my_collection } = useAppSelector((store) => store.vault);
    const { userDetail } = useAppSelector((store) => store.user);
    const timeLeft = useVaultDiscountTimer();

    const dispatch = useAppDispatch();
    const location = useLocation();
    const path = location.pathname;

    // Notification setup
    useEffect(() => {
        if (path === APP_ROUTE.VAULT) {
            dispatch(updateNotification({ notification_type: "vault" }));
        }
    }, [path]);

    // Fetch vault data
    useEffect(() => {
        dispatch(getVaultFeaturedData());
        dispatch(getVaultPaidData());
        dispatch(getVaultNewReleasedData({ page: 1 }));
        dispatch(getVaultFanFavData({ page: 1 }));
        dispatch(getVaultCharacterContentData({ page: 1 }));
        dispatch(getVaultMyCollectionData({ page: 1 }));
    }, []);

    // --- Determine where to show WantSideWaifuSection ---
    const displayName = userDetail?.user_chat_waifus?.commetchat_waifu_user?.display_name?.toLowerCase() || "";

    const characterKeys = Object.keys(vault_character_data) || [];

    // Find all indexes matching "displayName x hentai" or "displayName x ecchi"
    const matchIndexes = characterKeys
        .map((data, index) => {
            const lowerData = data.toLowerCase();

            if (lowerData.includes(`${displayName} x hentai`) || lowerData.includes(`${displayName} x ecchi`)) {
                return index;
            }

            return null;
        })
        .filter((i) => i !== null);

    // Determine final banner placement index
    const bannerIndex = matchIndexes.length > 0 ? matchIndexes[matchIndexes.length - 1] + 1 : 0;

    return (
        <div className="overflow-[unset] flex h-full w-[initial] flex-col text-white">
            <div className="sticky top-0 z-50 w-full">
                <Header />
            </div>
            <div className="flex w-full flex-col gap-y-8 overflow-hidden">
                {!userDetail.master_access && (
                    <div className="w-full px-4">
                        <VaultFeatureCard />
                    </div>
                )}
                <WaifuSection title="My Collection" waifu_Data={{ "My Collection": vault_my_collection }} />
                {!userDetail.master_access && (
                    <>
                        <WaifuSection title="New Releases" waifu_Data={{ "New Releases": vault_new_release }} />
                        <WaifuSection title="Fan Faves!" waifu_Data={{ "Fan Faves!": vault_fan_fav }} />
                        {characterKeys.map((data, index) => (
                            <React.Fragment key={data}>
                                {index === bannerIndex && <WantSideWaifuSection />}
                                <WaifuSection timeLeft={timeLeft} title={data} waifu_Data={vault_character_data} />
                            </React.Fragment>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default Vault;
