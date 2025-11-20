import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { API_URL } from "../../constants/ApiRoute";
import executeHttp from "../../Service/api";

export interface ICometChatWaifuUser {
    content_id: number;
    waifu_name: string;
    theme_name: string;
    thumb_image: string;
    publish_time: string;
    price: number;
    content_type: string;
    gallery: string[];
    content_status: string;
    banner: string;
    subtitle: string;
    title: string;
    free?: boolean;
    gallery_count: number;
    rating: number;
    views: number;
    gallery_thumbnail?: string[];
    hot_deal?: boolean;
    discount_price?: number;
}

interface IStoreLoadResponse {
    waifu_details: IMainWaifuDetail;
}

export interface IGiftDetails {
    id: number;
    image: string;
    is_favorite: boolean;
    max_qty: number;
    price_html: string;
    title: string;
}

export interface IMainWaifuEntry {
    themes: ICometChatWaifuUser[];
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    key: string;
}

export type IMainWaifuDetail = Record<string, IMainWaifuEntry | IMainWaifuEntry[]>;

interface IStoreState {
    loading: boolean;
    error: string | null;
    successMessage: string | null;
    waifu_details: IMainWaifuDetail;
    gift_details: IGiftDetails[];
}

export const getStoreData = createAsyncThunk<IStoreLoadResponse, void, { rejectValue: string }>("store/getStoreData", async (_, { rejectWithValue }) => {
    try {
        const response = await executeHttp({
            method: "GET",
            url: `${API_URL.USER.WAIFU_DETAILS}`,
        });
        const responseData = response.data;

        return responseData;
    } catch (err) {
        const error = err as AxiosError<{ message?: string }>;

        return rejectWithValue(error.response?.data?.message || "store load failed");
    }
});

export const getStoreGiftData = createAsyncThunk<IGiftDetails[], void, { rejectValue: string }>("store/getStoreGiftData", async (_, { rejectWithValue }) => {
    try {
        const response = await executeHttp({
            method: "POST",
            url: `${API_URL.USER.STORE_GIFT_PRODUCT}`,
        });
        const responseData = response.data;

        return responseData;
    } catch (err) {
        const error = err as AxiosError<{ message?: string }>;

        return rejectWithValue(error.response?.data?.message || "store load failed");
    }
});

const initialState: IStoreState = {
    loading: true,
    error: null,
    successMessage: null,
    waifu_details: {},
    gift_details: [],
};

const storeSlice = createSlice({
    name: "store",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStoreData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStoreData.fulfilled, (state, action: PayloadAction<IStoreLoadResponse>) => {
                state.waifu_details = action.payload.waifu_details;
            })
            .addCase(getStoreData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "User error";
            });
        builder
            .addCase(getStoreGiftData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStoreGiftData.fulfilled, (state, action: PayloadAction<IGiftDetails[]>) => {
                state.gift_details = action.payload;
            })
            .addCase(getStoreGiftData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "User error";
            });
    },
});

export default storeSlice.reducer;
