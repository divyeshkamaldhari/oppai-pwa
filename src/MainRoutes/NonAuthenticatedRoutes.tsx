import { Route } from "react-router";

import NonAuthenticatedLayout from "../Layout/NonAuthenticatedLayout";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import ResetPassword from "../Pages/Auth/ResetPassword";
import { APP_ROUTE } from "../constants/AppRoutes";
import Login from "../Pages/Auth/Login";

const NonAuthenticatedRoutes = () => {
    return (
        <Route element={<NonAuthenticatedLayout />} path={APP_ROUTE.PWA_SCREEN}>
            <Route element={<Login />} path={APP_ROUTE.LOGIN} />
            <Route element={<ForgotPassword />} path={APP_ROUTE.FORGOT_PASSWORD} />
            <Route element={<ResetPassword />} path={APP_ROUTE.RESET_PASSWORD} />
        </Route>
    );
};

export default NonAuthenticatedRoutes;
