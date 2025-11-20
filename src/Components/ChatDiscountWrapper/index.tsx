import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { useAppSelector } from "../../redux";

dayjs.extend(utc);
dayjs.extend(timezone);

const useChatDiscountTimer = () => {
    const { userDetail } = useAppSelector((state) => state.user);
    const registerDate = userDetail?.register_date || null;

    const [timeLeft, setTimeLeft] = useState<{
        minutes: string;
        seconds: string;
        discountActive: boolean;
    }>({
        minutes: "00",
        seconds: "00",
        discountActive: false,
    });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Get user’s local timezone (works globally)
    const userTimezone = dayjs.tz.guess();

    // Parse date in UTC → convert to user’s timezone
    const start = registerDate ? dayjs.utc(registerDate, "MMMM D, YYYY hh:mm a").tz(userTimezone) : null;

    const end = start ? start.add(15.5, "minute").add(30, "second") : null;

    useEffect(() => {
        if (!start || !end || !start.isValid()) return;

        const updateTimer = () => {
            const now = dayjs();
            const diff = end.diff(now);

            if (diff <= 0) {
                setTimeLeft({ minutes: "00", seconds: "00", discountActive: false });
                if (intervalRef.current) clearInterval(intervalRef.current);

                return;
            }
            const minutes = Math.floor(diff / 1000 / 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft({
                minutes: String(minutes).padStart(2, "0"),
                seconds: String(seconds).padStart(2, "0"),
                discountActive: true,
            });
        };

        updateTimer();
        intervalRef.current = setInterval(updateTimer, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [registerDate, userTimezone]);

    return timeLeft;
};

export default useChatDiscountTimer;
