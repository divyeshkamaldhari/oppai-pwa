import { useEffect } from "react";

import { AGE_CHECKER_KEY, BACKEND_URL } from "../../constants/EnvConstants";
import { useAppDispatch, useAppSelector } from "../../redux";
import { initAgeChecker, initAgeCheckerUploadWatcher } from "../../utils/ageChecker";

const AgeCheckerWrapper: React.FC = () => {
    const { userDetail } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        initAgeChecker(userDetail, dispatch, AGE_CHECKER_KEY, BACKEND_URL);
    }, [userDetail, dispatch, AGE_CHECKER_KEY, BACKEND_URL]);

    useEffect(() => {
        const cleanup = initAgeCheckerUploadWatcher();

        return cleanup;
    }, []);

    return null;
};

export default AgeCheckerWrapper;
