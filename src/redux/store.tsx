import { combineReducers, configureStore, createListenerMiddleware, UnknownAction } from "@reduxjs/toolkit";

import userSlice, { userLoad } from "./slices/userSlice";
import authSlice, { logout } from "./slices/authSlice";
import purchaseSlice from "./slices/purchaseSlice";
import storeSlice from "./slices/storeSlice";
import vaultSlice from "./slices/vaultSlice";
import chatSlice from "./slices/chatSlice";

const appReducer = combineReducers({
    auth: authSlice,
    user: userSlice,
    chat: chatSlice,
    store: storeSlice,
    vault: vaultSlice,
    purchase: purchaseSlice,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: UnknownAction) => {
    if (action.type === logout.type) {
        state = undefined;
    }

    return appReducer(state, action);
};

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
    actionCreator: userLoad.rejected,
    effect: async (_, listenerApi) => {
        listenerApi.dispatch(logout());
    },
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
