import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { API_URL } from "../../constants/ApiRoute";
import executeHttp from "../../Service/api";
import { createSessionToken, getOriginalToken } from "../../utils/hash-token";

interface AuthState {
    token: string | null;
    loading: boolean;
    changePasswordLoading: boolean;
    forgotPasswordComplete: boolean;
    error: string | null;
    loginError: string | null;
    forgotPasswordError: string | null;
    changePasswordError: string | null;
    successMessage: string | null;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface ForgotPasswordPayload {
    email: string;
}

interface ChangePasswordPayload {
    old_password: string;
    new_password: string;
}

const initialState: AuthState = {
    token: getOriginalToken(),
    loading: false,
    changePasswordLoading: false,
    forgotPasswordComplete: false,
    error: null,
    loginError: null,
    forgotPasswordError: null,
    changePasswordError: null,
    successMessage: null,
};

export const login = createAsyncThunk<{ token: string; chat_purchase: boolean }, LoginPayload, { rejectValue: string }>(
    "auth/login",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.LOGIN}`,
                data: payload,
            });
            const token = response.data.token;
            const chat_purchase = response.data.chat_purchase;

            // localStorage.setItem("token", token);
            createSessionToken(token);

            return { token, chat_purchase };
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error?.message || "Login failed");
        }
    },
);

export const forgotPassword = createAsyncThunk<string, ForgotPasswordPayload, { rejectValue: string }>(
    "auth/forgotPassword",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.FORGOT_PASSWORD}`,
                data: payload,
            });

            return response.data.message ?? "Password reset link sent!";
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error.response?.data?.message ?? "Failed to send reset link");
        }
    },
);

export const changePassword = createAsyncThunk<string, ChangePasswordPayload, { rejectValue: string }>(
    "auth/changePassword",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await executeHttp({
                method: "POST",
                url: `${API_URL.USER.CHANGE_PASSWORD}`,
                data: payload,
            });

            const token = response.data.token;

            // localStorage.setItem("token", token);
            createSessionToken(token);

            return token;
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            return rejectWithValue(error?.message || "Failed to change password");
        }
    },
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            localStorage.clear();

            sessionStorage.clear();

            document.cookie.split(";").forEach((cookie) => {
                const name = cookie.split("=")[0].trim();

                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
            });
        },
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        setLogin: (state, action) => {
            state.token = action.payload.token;
            // localStorage.setItem("token", action.payload.token);
            createSessionToken(action.payload.token);
        },
        resteConfirm: (state) => {
            state.forgotPasswordComplete = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.loginError = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
                state.loading = false;
                state.token = action.payload.token;
                state.loginError = "";
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.loginError = action?.payload ?? "Login error";
            });
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.forgotPasswordError = null;
                state.successMessage = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload;
                state.forgotPasswordError = null;
                state.forgotPasswordComplete = true;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.forgotPasswordError = action.payload ?? "Error sending reset link";
            });
        builder
            .addCase(changePassword.pending, (state) => {
                state.changePasswordLoading = true;
                state.changePasswordError = null;
                state.successMessage = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.changePasswordLoading = false;
                state.changePasswordError = null;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.changePasswordLoading = false;
                state.changePasswordError = action.payload ?? "Error sending reset link";
            });
    },
});

export const { logout, clearMessages, setLogin, resteConfirm } = authSlice.actions;

export default authSlice.reducer;
