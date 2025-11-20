import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { API_URL } from "../../constants/ApiRoute";
import executeHttp from "../../Service/api";
import { RootState } from "../store";
import { createSessionToken } from "../../utils/hash-token";

import { getStoreData } from "./storeSlice";
import {
    getVaultCharacterContentData,
    getVaultFanFavData,
    getVaultFeaturedData,
    getVaultMyCollectionData,
    getVaultNewReleasedData,
    getVaultPaidData,
} from "./vaultSlice";

interface ICometChatUser {
    ID: number;
    user_firstname: string;
    user_lastname: string;
    nickname: string;
    user_nicename: string;
    display_name: string;
    user_email: string;
    user_url: string;
    user_registered: string;
    user_description: string;
    user_avatar: string;
    waifu_title: string;
    waifu_sub_title: string;
}

interface Itext {
    commetchat_user: ICometChatUser;
    commetchat_waifu_user: ICometChatUser;
}

interface IUserLoadResponse {
    id: number;
    email: string;
    name: string;
    phone: string;
    content_type: string;
    new_content_valut: string | boolean;
    new_store_vault: string | boolean;
    age_verified: boolean;
    chat_purchase: boolean;
    user_chat_waifus: Partial<Itext>;
    created_by?: string;
    payment: string;
    message: string;
    status: string;
    view_count?: number;
    free_label?: string;
    register_date?: string;
    master_access?: boolean;
}

interface IUserState {
    userDetail: IUserLoadResponse;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
    paymentMethod: string;
}
const initialState: IUserState = {
    userDetail: {
        id: 0,
        name: "",
        email: "",
        phone: "",
        content_type: "",
        payment: "",
        message: "",
        status: "",
        new_content_valut: "",
        new_store_vault: "",
        chat_purchase: false,
        age_verified: false,
        user_chat_waifus: {},
    },
    loading: true,
    error: null,
    successMessage: null,
    paymentMethod: "",
};

export const userLoad = createAsyncThunk<IUserLoadResponse, void, { rejectValue: string }>("user/userLoad", async (_, { rejectWithValue }) => {
    try {
        // Enhanced cache busting for iPhone Safari
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const cacheBuster = `c=${timestamp}&_t=${timestamp}&r=${random}&_r=${random}&_cb=${timestamp}`;

        const response = await executeHttp({
            method: "GET",
            url: `${API_URL.USER.LOAD}?${cacheBuster}`,
            headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
                Pragma: "no-cache",
                Expires: "0",
                "If-Modified-Since": "0",
                "If-None-Match": "*",
                "X-Requested-With": "XMLHttpRequest",
                "X-Cache-Buster": timestamp.toString(),
            },
            rest: {
                validateStatus: (status) => status < 500,
            },
        });
        const responseData = response.data;

        if (responseData?.newToken) {
            createSessionToken(responseData.newToken);
        }

        return responseData;
    } catch (err) {
        const error = err as AxiosError<{ message?: string }>;

        return rejectWithValue(error.response?.data?.message || "User load failed");
    }
});

export const paymentMethod = createAsyncThunk<IUserLoadResponse, void, { rejectValue: string }>("user/paymentMethod", async (_, { rejectWithValue }) => {
    try {
        const response = await executeHttp({
            method: "POST",
            url: `${API_URL.USER.PAYMENT_METHOD}`,
        });
        const responseData = response.data;

        return responseData;
    } catch (err) {
        const error = err as AxiosError<{ message?: string }>;

        return rejectWithValue(error.response?.data?.message || "User load failed");
    }
});

export const saveAgeVerified = createAsyncThunk<IUserLoadResponse, { DOB_OF_USER: string; age_verified: boolean }, { rejectValue: string }>(
    "user/saveAgeVerified",
    async ({ DOB_OF_USER, age_verified }, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.AGE_VERIFIED}`,
                data: {
                    date_of_birth: DOB_OF_USER,
                    age_verified: age_verified,
                },
            });
            const responseData = response.data;

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "User load failed");
        }
    },
);

export const updateNotification = createAsyncThunk<IUserLoadResponse, { notification_type: string }, { rejectValue: string }>(
    "user/updateNotification",
    async ({ notification_type }, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.UPDATE_NOTIFICATION}`,
                data: {
                    notification_type: notification_type,
                    update: 0,
                },
            });
            const responseData = response.data;

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "User load failed");
        }
    },
);

export const getNewContent = createAsyncThunk<IUserLoadResponse, void, { rejectValue: string }>(
    "user/getNewContent",
    async (_, { rejectWithValue, dispatch, getState }) => {
        try {
            const response = await executeHttp({
                method: "GET",
                url: `${API_URL.USER.NEW_CONTENT}`,
            });
            const responseData = response.data;

            const state = getState() as RootState;

            if (
                (responseData.new_content_valut && responseData.new_content_valut !== state.user.userDetail.new_content_valut) ||
                (responseData.new_store_vault && responseData.new_store_vault !== state.user.userDetail.new_store_vault)
            ) {
                dispatch(getStoreData());
                dispatch(getVaultPaidData());
                dispatch(getVaultFeaturedData());
                dispatch(getVaultNewReleasedData({ page: 1 }));
                dispatch(getVaultMyCollectionData({ page: 1 }));
                dispatch(getVaultFanFavData({ page: 1 }));
                dispatch(getVaultCharacterContentData({ page: 1 }));
            }

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "Chat Amount load failed");
        }
    },
);

export const updateVaultFreeNotification = createAsyncThunk<IUserLoadResponse, void, { rejectValue: string }>(
    "user/updateVaultFreeNotification",
    async (_, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "GET",
                url: `${API_URL.USER.UPDATE_VAULT_FREE_NOTIFICATION}`,
            });
            const responseData = response.data;

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "Update vault free notification failed");
        }
    },
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLoadingFalse: (state) => {
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLoad.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userLoad.fulfilled, (state, action: PayloadAction<IUserLoadResponse>) => {
                state.userDetail = action.payload;
            })
            .addCase(userLoad.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "User error";
            });
        builder
            .addCase(saveAgeVerified.pending, (state) => {
                state.error = null;
            })
            .addCase(saveAgeVerified.fulfilled, (state, action: PayloadAction<IUserLoadResponse>) => {
                state.userDetail.age_verified = action.payload.age_verified;
            })
            .addCase(saveAgeVerified.rejected, (state, action) => {
                state.error = action.payload || "User error";
            });
        builder
            .addCase(paymentMethod.pending, (state) => {
                state.error = null;
            })
            .addCase(paymentMethod.fulfilled, (state, action: PayloadAction<IUserLoadResponse>) => {
                state.paymentMethod = action.payload.payment;
            })
            .addCase(paymentMethod.rejected, (state, action) => {
                state.error = action.payload || "User error";
            });
        builder
            .addCase(updateNotification.pending, (state) => {
                state.error = null;
            })
            .addCase(updateNotification.fulfilled, (state, action: PayloadAction<IUserLoadResponse>) => {
                if (action.payload.message === "Store notification updated" && action.payload.status === "success") {
                    state.userDetail.new_store_vault = false;
                } else if (action.payload.message === "Vault notification updated" && action.payload.status === "success") {
                    state.userDetail.new_content_valut = false;
                }
            })
            .addCase(updateNotification.rejected, (state, action) => {
                state.error = action.payload || "User error";
            });
        builder.addCase(getNewContent.fulfilled, (state, action: PayloadAction<IUserLoadResponse>) => {
            state.userDetail.new_content_valut = action.payload.new_content_valut;
            state.userDetail.new_store_vault = action.payload.new_store_vault;
            state.userDetail.age_verified = action.payload.age_verified;
        });
        builder
            .addCase(updateVaultFreeNotification.pending, (state) => {
                state.error = null;
            })
            .addCase(updateVaultFreeNotification.fulfilled, (state, action: PayloadAction<IUserLoadResponse>) => {
                state.userDetail.free_label = action.payload.free_label;
            })
            .addCase(updateVaultFreeNotification.rejected, (state, action) => {
                state.error = action.payload || "User error";
            });
    },
});

export const { setLoadingFalse } = userSlice.actions;
export default userSlice.reducer;
