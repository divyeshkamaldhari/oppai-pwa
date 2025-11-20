import { Button } from "antd";

import tutorial1 from "../../../public/assets/OD-WORKS1.png";
import tutorial2 from "../../../public/assets/OD-WORKS2.png";
import tutorial3 from "../../../public/assets/OD-WORKS3.png";
import tutorial4 from "../../../public/assets/OD-WORKS4.png";

const steps = [
    {
        img: tutorial1,
        text: "Chat with your waifu from 6 PM to 2 AM ET! 😏",
        bg: "#381D67",
        cardbg: "#271448",
    },
    {
        img: tutorial2,
        text: "View and download all her naughty content! 🔥",
        bg: "#5217BA",
        cardbg: "#271448",
    },
    {
        img: tutorial3,
        text: "Unlock chats, buy content, and treat your waifu! 💦",
        bg: "#381D67",
        cardbg: "#271448",
    },
    {
        img: tutorial4,
        text: "Verify your age to get full access to my content! 🔞",
        bg: "#5217BA",
        cardbg: "#271448",
    },
];

interface ITutorialStep1 {
    setStep: (vaule: number) => void;
}

const TutorialStep1: React.FC<ITutorialStep1> = ({ setStep }) => {
    return (
        <div className="flex flex-col items-center px-4">
            <div className="sec-head w-full">
                {/* <h1 className="text-center font-luckiest-guy text-[28px] leading-none font-medium tracking-wider text-white">YAY, YOU DID IT!</h1> */}
                <h1 className="text-center font-luckiest-guy text-[28px] leading-none font-medium tracking-wider mt-2">
                    HOW{" "}
                    <span className="text-red-500 font-luckiest-guy text-[28px] leading-none font-medium">
                        OPPAI <br />
                        DRAGON
                    </span>{" "}
                    WORKS!
                </h1>
            </div>

            <div className="form-card-section w-full flex flex-col gap-y-2 my-6">
                {steps.map((step, idx) => (
                    <div key={idx} className={`flex flex-row flex-wrap justify-between w-full pt-[10px] max-w-full items-center`}>
                        <div
                            className={`inner-card bg-[${step.bg}] rounded-[200px] flex items-center justify-between w-full flex-wrap p-[2px] pr-[64px] relative`}
                        >
                            <div className={`card-avatar w-[72px] h-[72px] rounded-full flex justify-center items-end bg-[rgba(0,0,0,0.3)] overflow-visible`}>
                                <img
                                    alt="waifu"
                                    className="min-w-full h-[calc(100%_+_12px)] object-contain w-full object-bottom rounded-b-[100px]"
                                    src={step.img}
                                />
                            </div>
                            <div className="card-avatar-info w-full max-w-[calc(100%_-72px-_16px)] py-2">
                                <p className="text-sm font-medium text-white">{step.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Button className="pwa-btn-sm " type="primary" onClick={() => setStep(2)}>
                COOL, GOT IT
            </Button>
        </div>
    );
};

export default TutorialStep1;
