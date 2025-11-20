import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { useAppDispatch } from "../../redux";
import { getVaultCharacterContentData } from "../../redux/slices/vaultSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

const ET_TZ = "America/New_York";

const useVaultDiscountTimer = () => {
    const dispatch = useAppDispatch();

    const [timeLeft, setTimeLeft] = useState({
        hours: "00",
        minutes: "00",
        seconds: "00",
        discountActive: true,
        inBreak: false, // track 1-min break
    });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const prefetchTriggered = useRef(false);

    // Get next cycle start (8 AM or 8 PM ET)
    const getNextCycleStart = (nowET: dayjs.Dayjs) => {
        const eightAM = nowET.hour(8).minute(0).second(0);
        const eightPM = nowET.hour(20).minute(0).second(0);

        if (nowET.isBefore(eightAM)) return eightAM;
        if (nowET.isBefore(eightPM)) return eightPM;

        return eightAM.add(1, "day"); // after 8 PM → next 8 AM
    };

    const updateTimer = async () => {
        const nowET = dayjs().tz(ET_TZ);
        const nextCycle = getNextCycleStart(nowET);

        // 1-min break before cycle starts
        const breakStart = nextCycle.subtract(1, "minute");

        const diff = nextCycle.diff(nowET);
        const diffToBreak = breakStart.diff(nowET);

        // Determine if we are in break period
        const inBreak = diffToBreak <= 0 && diff > 0;

        // Countdown display
        let displayDiff = inBreak ? diffToBreak + 60000 : diff; // show 11:59 during break

        if (displayDiff < 0) displayDiff = 0;

        const hours = Math.floor(displayDiff / (1000 * 60 * 60));
        const minutes = Math.floor((displayDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((displayDiff / 1000) % 60);

        setTimeLeft({
            hours: String(hours).padStart(2, "0"),
            minutes: String(minutes).padStart(2, "0"),
            seconds: String(seconds).padStart(2, "0"),
            discountActive: true,
            inBreak,
        });

        // Prefetch API 3s before cycle starts (only once)
        if (!prefetchTriggered.current && diff <= 5000 && diff > 3000) {
            prefetchTriggered.current = true;
            await dispatch(getVaultCharacterContentData({ page: 1 }));
        }

        // Reset prefetch after cycle starts
        if (diff <= 0) {
            prefetchTriggered.current = false;
        }
    };

    useEffect(() => {
        updateTimer(); // initial call
        intervalRef.current = setInterval(updateTimer, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return timeLeft;
};

export default useVaultDiscountTimer;
