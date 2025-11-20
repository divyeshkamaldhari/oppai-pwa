import { Route } from "react-router";

import { APP_ROUTE } from "../constants/AppRoutes";
import MainLayout from "../Layout/MainLayout";
import Account from "../Pages/Account";
import Chat from "../Pages/Chat";
import Collection from "../Pages/Collection";
import Gift from "../Pages/Gift";
import Store from "../Pages/Store";
import Vault from "../Pages/Vault";

const AuthenticatedRoutes = () => {
    return (
        <Route element={<MainLayout />} path={APP_ROUTE.PWA_SCREEN}>
            <Route element={<Store />} path={APP_ROUTE.STORE} />
            <Route element={<Gift />} path={APP_ROUTE.GIFT} />
            <Route element={<Chat />} path={APP_ROUTE.CHAT} />
            <Route element={<Vault />} path={APP_ROUTE.VAULT} />
            <Route element={<Collection />} path={APP_ROUTE.VAULT_VIEW} />
            <Route element={<Account />} path={APP_ROUTE.ACCOUNT} />
        </Route>
    );
};

export default AuthenticatedRoutes;
