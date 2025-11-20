import t1 from "../../Components/CometChat/assets/free-Waifu1-lg.png";
import t2 from "../../Components/CometChat/assets/free-Waifu2-lg.png";
import t3 from "../../Components/CometChat/assets/free-Waifu3-lg.png";
import step_1_image from "../../Components/CometChat/assets/step-item-lg-1.png";
import step_2_image from "../../Components/CometChat/assets/step-item-lg-2.png";
import step_3_image from "../../Components/CometChat/assets/step-item-lg-3.png";

const TutorialStep2 = () => {
    return (
        <div className="flex flex-col items-center px-4">
            <div className="w-full">
                <div className="sec-head w-full">
                    <h1 className="text-center font-luckiest-guy text-[28px] leading-none font-medium tracking-wider text-white">
                        INSTALL THE <br />
                        <span className="text-red-500 font-luckiest-guy text-[28px] leading-none font-medium">OPPAI DRAGON</span> APP
                    </h1>
                    {/* <h2 className="text-center font-luckiest-guy text-[22px] leading-none font-medium tracking-wider mt-2 text-red-500">
                        Wanna have waifus and lewd content just one click away?
                    </h2> */}
                </div>

                <div className="pixel-preview-wrapper my-6">
                    <div className="pixel-preview flex justify-center flex-wrap w-auto gap-y-[10px] mx-[-5px]">
                        <div className="pixel-img-wrapper px-[5px] w-full max-w-[33.33%] mx-0">
                            <div className="img-wrap w-full rounded-[14px] border-[3px] border-[#ce2a42] overflow-hidden aspect-[1/1]">
                                <img alt="CONTENT" className="w-full h-full object-cover" loading="lazy" src={t1} />
                            </div>
                        </div>
                        <div className="pixel-img-wrapper px-[5px] w-full max-w-[33.33%] mx-0">
                            <div className="img-wrap w-full rounded-[14px] border-[3px] border-[#ce2a42] overflow-hidden aspect-[1/1]">
                                <img alt="CONTENT" className="w-full h-full object-cover" loading="lazy" src={t2} />
                            </div>
                        </div>
                        <div className="pixel-img-wrapper px-[5px] w-full max-w-[33.33%] mx-0">
                            <div className="img-wrap w-full rounded-[14px] border-[3px] border-[#ce2a42] overflow-hidden aspect-[1/1]">
                                <img alt="CONTENT" className="w-full h-full object-cover" loading="lazy" src={t3} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full mb-[15px]">
                    <p className="text-center font-normal text-white text-[14px]">
                        {/* Then install the Oppai Dragon app now <br /> to unlock it! <strong>I’ll show you how!</strong> */}
                        Wanna have waifus and lewd content just one click away?
                    </p>
                </div>

                <div className="instructions-wrapper">
                    <div className="instructions-head mb-[18px]">
                        <p className="text-center text-[#ce2a42] text-[18px] font-semibold">Follow the steps below</p>
                    </div>

                    <div className="steps-box p-[23px_18px] rounded-[21px] bg-[#381d67] w-full">
                        <h3 className="text-white text-center text-[18px] font-semibold mb-2">On Chrome</h3>
                        <div className="step-wrapper flex w-full flex-col gap-[19px] mb-[30px]">
                            <div className="step-item w-full flex flex-col gap-[11px] text-center step-1 ">
                                <p className="text-sm font-medium text-white">
                                    1. Tap the <strong>share</strong> icon
                                </p>
                                <div className="img-wrapper">
                                    <img alt="On Chrome" className="w-full h-auto " loading="lazy" src={step_1_image} />
                                </div>
                            </div>
                            <div className="step-item w-full flex flex-col gap-[11px] text-center step-2">
                                <p className="text-sm font-medium text-white">
                                    2. Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>
                                </p>
                                <div className="img-wrapper">
                                    <img alt="On Chrome" className="w-full h-auto " loading="lazy" src={step_2_image} />
                                </div>
                            </div>
                            <div className="step-item w-full flex flex-col gap-[11px] text-center step-3">
                                <p className="text-sm font-medium text-white">
                                    3. Tap <strong>&quot;Install&quot;</strong> to confirm
                                </p>
                                <div className="img-wrapper">
                                    <img alt="On Chrome" className="w-full h-auto " loading="lazy" src={step_3_image} />
                                </div>
                            </div>
                        </div>

                        <div className="card-footer">
                            <h2 className="text-white text-[22px] text-center font-normal mb-0 leading-[100%] font-luckiest-guy">
                                YATTA! OPPAI DRAGON IS NOW <br />
                                <span className="text-[#ce2a42] font-luckiest-guy">JUST ONE TAP AWAY</span>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialStep2;
