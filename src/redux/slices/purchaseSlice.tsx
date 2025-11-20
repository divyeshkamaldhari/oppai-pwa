import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { API_URL } from "../../constants/ApiRoute";
import executeHttp from "../../Service/api";

interface IPurchaseState {
    order_id: number;
    transaction_id: string;
    product_id: string | number | { [id: string]: string };
    loading: boolean;
    isChat: boolean;
    error: string | null;
}

export interface IchatPurchaseLoadPayload {
    name?: string;
    price?: number;
    product_id?: number | string;
    product_ids?: {
        [x: string]: number;
    };
    type?: string;
    order_id?: number;
    qty?: number;
    transaction_id?: string;
}

interface IchatPurchaseLoadResponce {
    status: string;
    total: string;
    order_id: number;
    qty: number;
}

const ORDER_ID_KEY = "order_id";
const TRANSACTION_ID_KEY = "transaction_id";
const CHAT_ID_KEY = "isChat";
const PRODUCT_ID_KEY = "product_id";
const REFRESH_TOKEN = "refresh_token";

const saveToLocalStorage = (key: string, value: number | string | boolean) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key: string, fallback: number | string | boolean) => {
    const item = localStorage.getItem(key);

    return item ? JSON.parse(item) : fallback;
};

const removeFromLocalStorage = (key: string) => {
    localStorage.removeItem(key);
};

const initialState: IPurchaseState = {
    order_id: getFromLocalStorage(ORDER_ID_KEY, 0),
    product_id: getFromLocalStorage(PRODUCT_ID_KEY, 0),
    transaction_id: getFromLocalStorage(TRANSACTION_ID_KEY, ""),
    loading: true,
    isChat: getFromLocalStorage(CHAT_ID_KEY, false),
    error: null,
};

export const createPaymentOrder = createAsyncThunk<IchatPurchaseLoadResponce, IchatPurchaseLoadPayload, { rejectValue: string }>(
    "purchase/createPaymentOrder",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.CREATE_PENDING_ORDER}`,
                data: payload,
            });
            const responseData = response.data;

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "Chat Amount load failed");
        }
    },
);

export const completePaymentOrder = createAsyncThunk<IchatPurchaseLoadResponce, IchatPurchaseLoadPayload, { rejectValue: string }>(
    "purchase/completePaymentOrder",
    async ({ order_id, transaction_id, product_id }, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.COMPLETE_ORDER}`,
                data: { order_id, transaction_id, product_id },
            });
            const responseData = response.data;

            saveToLocalStorage(REFRESH_TOKEN, response.data?.refresh_token);

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "Chat Amount load failed");
        }
    },
);

export const failPaymentOrder = createAsyncThunk<IchatPurchaseLoadResponce, IchatPurchaseLoadPayload, { rejectValue: string }>(
    "purchase/failPaymentOrder",
    async ({ order_id, transaction_id }, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.FAIL_ORDER}`,
                data: { order_id, transaction_id },
            });
            const responseData = response.data;

            return responseData;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message || "Chat Amount load failed");
        }
    },
);

const purchaseSlice = createSlice({
    name: "purchase",
    initialState,
    reducers: {
        setChatStatus: (state) => {
            state.isChat = true;
            saveToLocalStorage(CHAT_ID_KEY, true);
        },
        reSetChatStatus: (state) => {
            state.isChat = false;
            removeFromLocalStorage(CHAT_ID_KEY);
        },
        setTransectionId: (state, action: PayloadAction<{ transaction_id: string; product_id: string | number | { [id: string]: string } }>) => {
            state.transaction_id = action.payload.transaction_id;
            state.product_id = action.payload.product_id;

            saveToLocalStorage(TRANSACTION_ID_KEY, action.payload.transaction_id);
            saveToLocalStorage(PRODUCT_ID_KEY, JSON.stringify(action.payload.product_id));
        },
        resetPurchaseState: (state) => {
            state.order_id = 0;
            state.transaction_id = "";
            state.error = null;
            removeFromLocalStorage(ORDER_ID_KEY);
            removeFromLocalStorage(TRANSACTION_ID_KEY);
            removeFromLocalStorage(PRODUCT_ID_KEY);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentOrder.pending, (state) => {
                state.error = null;
            })
            .addCase(createPaymentOrder.fulfilled, (state, action: PayloadAction<IchatPurchaseLoadResponce>) => {
                state.order_id = action.payload.order_id;
                saveToLocalStorage(ORDER_ID_KEY, action.payload.order_id);
            })
            .addCase(createPaymentOrder.rejected, (state, action) => {
                state.error = action.payload || "User error";
            })
            .addCase(completePaymentOrder.fulfilled, (state) => {
                state.order_id = 0;
                state.transaction_id = "";
                removeFromLocalStorage(ORDER_ID_KEY);
                removeFromLocalStorage(TRANSACTION_ID_KEY);
                removeFromLocalStorage(PRODUCT_ID_KEY);
            })
            .addCase(failPaymentOrder.fulfilled, (state) => {
                state.order_id = 0;
                state.transaction_id = "";
                removeFromLocalStorage(ORDER_ID_KEY);
                removeFromLocalStorage(TRANSACTION_ID_KEY);
                removeFromLocalStorage(PRODUCT_ID_KEY);
            });
    },
});

export const { setChatStatus, reSetChatStatus, setTransectionId } = purchaseSlice.actions;
export default purchaseSlice.reducer;
