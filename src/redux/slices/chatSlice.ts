import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { API_URL } from "../../constants/ApiRoute";
import executeHttp from "../../Service/api";

interface IchatDetails {
    id: number;
    price: string;
    discount_price: string;
}

interface IChatPurchaseLoad {
    chat_details: IchatDetails[];
}

interface ChatState {
    unreadCount: number;
    storeCount: number;
    vaultCount: number;
    chatPurchaseDetails: IchatDetails | null;
}

const initialState: ChatState = {
    unreadCount: parseInt(localStorage.getItem("unreadCount") || "0", 10),
    storeCount: 0,
    vaultCount: 0,
    chatPurchaseDetails: null,
};

export const chatPurchaseLoad = createAsyncThunk<IChatPurchaseLoad, void, { rejectValue: string }>("chat/chatPurchaseLoad", async (_, { rejectWithValue }) => {
    try {
        const response = await executeHttp({
            method: "POST",
            url: `${API_URL.USER.CHAT_PURCHASE}`,
        });
        const responseData = response.data;

        return responseData;
    } catch (err) {
        const error = err as AxiosError<{ message?: string }>;

        return rejectWithValue(error.response?.data?.message || "Chat Amount load failed");
    }
});

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setUnreadCount(state, action) {
            state.unreadCount = action.payload;
            localStorage.setItem("unreadCount", String(action.payload));
        },
        incrementUnreadCount(state) {
            state.unreadCount += 1;
            localStorage.setItem("unreadCount", String(state.unreadCount));
        },
        clearUnreadCount(state) {
            state.unreadCount = 0;
            localStorage.removeItem("unreadCount");
        },
    },
    extraReducers: (builder) => {
        builder.addCase(chatPurchaseLoad.fulfilled, (state, action: PayloadAction<IChatPurchaseLoad>) => {
            state.chatPurchaseDetails = action.payload.chat_details[0];
        });
    },
});

export const { setUnreadCount, incrementUnreadCount, clearUnreadCount } = chatSlice.actions;
export default chatSlice.reducer;
