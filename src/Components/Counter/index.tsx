import React from "react";

import MinusIcon from "../../assets/Icons/MinusIcon";
import PlusIcon from "../../assets/Icons/PlusIcon";

interface ICounter {
    count: number;
    incrementCount: () => void;
    decrementCounter: () => void;
    disableIncrement?: boolean;
    disableDecrement?: boolean;
}

const Counter: React.FC<ICounter> = ({ count, incrementCount, decrementCounter, disableDecrement, disableIncrement }) => {
    return (
        <div className="flex w-full max-w-[100px] justify-between gap-1 rounded-[20px] border border-[#D9DADB] px-4 py-2.5">
            <button
                className="transition-pwa h-5 w-5 border-none disabled:cursor-not-allowed disabled:opacity-20"
                disabled={disableDecrement}
                onClick={decrementCounter}
            >
                <MinusIcon />
            </button>
            <div className="flex h-5 w-5 items-center justify-center font-poppins text-sm font-normal text-white">{count}</div>
            <button
                className="transition-pwa h-5 w-5 border-none disabled:cursor-not-allowed disabled:opacity-20"
                disabled={disableIncrement}
                onClick={incrementCount}
            >
                <PlusIcon />
            </button>
        </div>
    );
};

export default Counter;
