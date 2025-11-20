import { Navigate, Outlet } from "react-router";

import { APP_ROUTE } from "../constants/AppRoutes";
import MainLogo from "../assets/Icons/MainLogo";
import { useAppSelector } from "../redux";

const NonAuthenticatedLayout = () => {
    const { token } = useAppSelector((state) => state.auth);

    return token ? (
        <Navigate to={APP_ROUTE.VAULT} />
    ) : (
        <div className="mx-auto flex h-dvh max-h-dvh w-full max-w-md flex-col bg-[#130C1E] text-white overflow-x-auto">
            <div className="flex w-full flex-col">
                <div className="sticky top-0 z-50 flex w-full items-center justify-center p-4 bg-[#130C1E]">
                    <MainLogo className="h-14 w-full max-w-40" />
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default NonAuthenticatedLayout;
