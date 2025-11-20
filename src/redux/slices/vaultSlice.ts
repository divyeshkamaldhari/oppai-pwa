import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { API_URL } from "../../constants/ApiRoute";
import executeHttp from "../../Service/api";

import { ICometChatWaifuUser, IMainWaifuDetail, IMainWaifuEntry } from "./storeSlice";

interface IVaultState {
    loading_new_releases: boolean;
    loading_paid_content: boolean;
    loading_fan_faves: boolean;
    loading_character_content: boolean;
    error: string | null;
    successMessage: string | null;
    vault_fatured_data: ICometChatWaifuUser[];
    vault_new_release: IMainWaifuEntry;
    vault_my_collection: IMainWaifuEntry;
    vault_paid_data: ICometChatWaifuUser[];
    vault_fan_fav: IMainWaifuEntry;
    vault_character_data: IMainWaifuDetail;
}

const initialState: IVaultState = {
    loading_new_releases: false,
    loading_paid_content: false,
    loading_fan_faves: false,
    loading_character_content: false,
    error: null,
    successMessage: null,
    vault_fatured_data: [],
    vault_paid_data: [],
    vault_new_release: {
        page: 0,
        per_page: 0,
        total: 0,
        total_pages: 0,
        themes: [],
        key: "",
    },
    vault_my_collection: {
        page: 0,
        per_page: 0,
        total: 0,
        total_pages: 0,
        themes: [],
        key: "",
    },
    vault_fan_fav: {
        page: 0,
        per_page: 0,
        total: 0,
        total_pages: 0,
        themes: [],
        key: "",
    },
    vault_character_data: {},
};

export const getVaultFeaturedData = createAsyncThunk<ICometChatWaifuUser[], void, { rejectValue: string }>(
    "vault/getVaultFeaturedData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.VAULT_FEATURES}`,
            });
            const responseData = response.data;

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "vault feature data load failed");
        }
    },
);

export const getVaultMyCollectionData = createAsyncThunk<IMainWaifuEntry, { page: number }, { rejectValue: string }>(
    "vault/getVaultMyCollectionData",
    async ({ page }, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.VAULT_MY_COLLECTION}`,
                data: {
                    page: page,
                    per_page: 10,
                },
            });
            const responseData = response.data;

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "vault feature data load failed");
        }
    },
);
export const getVaultPaidData = createAsyncThunk<{ data: ICometChatWaifuUser[] }, void, { rejectValue: string }>(
    "vault/getVaultPaidData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.VAULT_PAID_CONTENT}`,
            });
            const responseData = response?.data;

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "vault feature data load failed");
        }
    },
);

export const getVaultNewReleasedData = createAsyncThunk<IMainWaifuEntry, { page: number }, { rejectValue: string }>(
    "vault/getVaultNewReleasedData",
    async ({ page }, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.VAULT_NEW_RELEASES}`,
                data: {
                    page: page,
                    per_page: 10,
                },
            });
            const responseData = response.data;

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "vault feature data load failed");
        }
    },
);

export const getVaultNewReleasedDataPurchase = createAsyncThunk<IMainWaifuEntry, { page: number }, { rejectValue: string }>(
    "vault/getVaultNewReleasedDataPurchase",
    async ({ page }, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.VAULT_NEW_RELEASES}`,
                data: {
                    page: page,
                    per_page: 10,
                },
            });
            const responseData = response.data;

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "vault feature data load failed");
        }
    },
);

export const getVaultFanFavData = createAsyncThunk<IMainWaifuEntry, { page: number }, { rejectValue: string }>(
    "vault/getVaultFanFavData",
    async ({ page }, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.VAULT_FAN_FAVORITES}`,
                data: {
                    page: page,
                    per_page: 10,
                },
            });
            const responseData = response.data;

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "vault feature data load failed");
        }
    },
);

export const getVaultFanFavDataPurchase = createAsyncThunk<IMainWaifuEntry, { page: number }, { rejectValue: string }>(
    "vault/getVaultFanFavDataPurchase",
    async ({ page }, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.VAULT_FAN_FAVORITES}`,
                data: {
                    page: page,
                    per_page: 10,
                },
            });
            const responseData = response.data;

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "vault feature data load failed");
        }
    },
);

export const getVaultCharacterContentData = createAsyncThunk<IMainWaifuDetail, { page: number }, { rejectValue: string }>(
    "vault/getVaultCharacterContentData",
    async ({ page }, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.VAULT_CHARACTER_CONTENT}`,
                data: {
                    page: page,
                    per_page: 10,
                },
            });
            const responseData = response.data;

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "vault feature data load failed");
        }
    },
);

export const getVaultCharacterContentDataByKey = createAsyncThunk<IMainWaifuEntry, { page: number; key: string }, { rejectValue: string }>(
    "vault/getVaultCharacterContentDataByKey",
    async ({ page, key }, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.VAULT_CHARACTER_CONTENT_BY_KEY}`,
                data: {
                    page: page,
                    key: key,
                },
            });
            const responseData = response.data;

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "vault feature data load failed");
        }
    },
);

const vaultSlice = createSlice({
    name: "vault",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getVaultFeaturedData.pending, (state) => {
                state.error = null;
            })
            .addCase(getVaultFeaturedData.fulfilled, (state, action: PayloadAction<ICometChatWaifuUser[]>) => {
                state.vault_fatured_data = action.payload;
            })
            .addCase(getVaultFeaturedData.rejected, (state, action) => {
                state.error = action.payload || "User error";
            });
        builder
            .addCase(getVaultPaidData.pending, (state) => {
                state.loading_paid_content = true;
                state.error = null;
            })
            .addCase(getVaultPaidData.fulfilled, (state, action: PayloadAction<{ data: ICometChatWaifuUser[] }>) => {
                state.loading_paid_content = false;
                state.vault_paid_data = action.payload.data;
            })
            .addCase(getVaultPaidData.rejected, (state, action) => {
                state.error = action.payload || "User error";
                state.loading_paid_content = false;
            });
        builder
            .addCase(getVaultMyCollectionData.pending, (state) => {
                state.loading_new_releases = true;
                state.error = null;
            })
            .addCase(getVaultMyCollectionData.fulfilled, (state, action: PayloadAction<IMainWaifuEntry>) => {
                state.vault_my_collection.page = action.payload.page;
                state.vault_my_collection.per_page = action.payload.per_page;
                state.vault_my_collection.themes?.push(...(action.payload.themes ?? []));
                state.vault_my_collection.total = action.payload.total;
                state.loading_new_releases = false;
            })
            .addCase(getVaultMyCollectionData.rejected, (state, action) => {
                state.error = action.payload || "User error";
                state.loading_new_releases = false;
            });
        builder
            .addCase(getVaultNewReleasedData.pending, (state) => {
                state.loading_new_releases = true;
                state.error = null;
            })
            .addCase(getVaultNewReleasedData.fulfilled, (state, action: PayloadAction<IMainWaifuEntry>) => {
                state.vault_new_release.page = action.payload.page;
                state.vault_new_release.per_page = action.payload.per_page;
                state.vault_new_release.themes?.push(...(action.payload.themes ?? []));
                state.vault_new_release.total = action.payload.total;
                state.loading_new_releases = false;
            })
            .addCase(getVaultNewReleasedData.rejected, (state, action) => {
                state.loading_new_releases = false;
                state.error = action.payload || "User error";
            });
        builder
            .addCase(getVaultNewReleasedDataPurchase.pending, (state) => {
                state.loading_new_releases = true;
                state.error = null;
            })
            .addCase(getVaultNewReleasedDataPurchase.fulfilled, (state, action: PayloadAction<IMainWaifuEntry>) => {
                state.vault_new_release.page = action.payload.page;
                state.vault_new_release.per_page = action.payload.per_page;
                state.vault_new_release.themes = action.payload.themes ?? [];
                state.vault_new_release.total = action.payload.total;
                state.loading_new_releases = false;
            })
            .addCase(getVaultNewReleasedDataPurchase.rejected, (state, action) => {
                state.loading_new_releases = false;
                state.error = action.payload || "User error";
            });
        builder
            .addCase(getVaultCharacterContentData.pending, (state) => {
                state.loading_character_content = true;
                state.error = null;
            })
            .addCase(getVaultCharacterContentData.fulfilled, (state, action: PayloadAction<IMainWaifuDetail>) => {
                state.vault_character_data = action.payload;
                state.loading_character_content = false;
            })
            .addCase(getVaultCharacterContentData.rejected, (state, action) => {
                state.loading_character_content = false;
                state.error = action.payload || "User error";
            });
        builder
            .addCase(getVaultCharacterContentDataByKey.pending, (state) => {
                state.loading_character_content = true;
                state.error = null;
            })
            .addCase(getVaultCharacterContentDataByKey.fulfilled, (state, action: PayloadAction<IMainWaifuEntry>) => {
                const { key, page, themes = [], per_page, total, total_pages } = action.payload;
                const entry = state.vault_character_data?.[key];

                if (entry) {
                    if (Array.isArray(entry)) {
                        // Merge themes into each item
                        entry.forEach((e) => {
                            e.themes = [...e.themes, ...themes];
                        });
                    } else {
                        entry.themes = [...entry.themes, ...themes];
                    }
                } else {
                    // Ensure vault_character_data exists and initialize with page
                    if (!state.vault_character_data) {
                        state.vault_character_data = {};
                    }
                    state.vault_character_data[key] = { page, themes, per_page, total, total_pages, key };
                }
                state.loading_character_content = false;
            })

            .addCase(getVaultCharacterContentDataByKey.rejected, (state, action) => {
                state.loading_character_content = false;
                state.error = action.payload || "User error";
            });
        builder
            .addCase(getVaultFanFavData.pending, (state) => {
                state.loading_fan_faves = true;
                state.error = null;
            })
            .addCase(getVaultFanFavData.fulfilled, (state, action: PayloadAction<IMainWaifuEntry>) => {
                state.vault_fan_fav.page = action.payload.page;
                state.vault_fan_fav.per_page = action.payload.per_page;
                state.vault_fan_fav.themes?.push(...(action.payload.themes ?? []));
                state.vault_fan_fav.total = action.payload.total;
                state.loading_fan_faves = false;
            })
            .addCase(getVaultFanFavData.rejected, (state, action) => {
                state.loading_fan_faves = false;
                state.error = action.payload || "User error";
            });
        builder
            .addCase(getVaultFanFavDataPurchase.pending, (state) => {
                state.loading_fan_faves = true;
                state.error = null;
            })
            .addCase(getVaultFanFavDataPurchase.fulfilled, (state, action: PayloadAction<IMainWaifuEntry>) => {
                state.vault_fan_fav.page = action.payload.page;
                state.vault_fan_fav.per_page = action.payload.per_page;
                state.vault_fan_fav.themes = action.payload.themes ?? [];
                state.vault_fan_fav.total = action.payload.total;
                state.loading_fan_faves = false;
            })
            .addCase(getVaultFanFavDataPurchase.rejected, (state, action) => {
                state.loading_fan_faves = false;
                state.error = action.payload || "User error";
            });
    },
});

export default vaultSlice.reducer;
