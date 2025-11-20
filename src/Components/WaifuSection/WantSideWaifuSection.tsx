import waifuSide1 from "../../assets/modal-avatar7.png";
import waifuSide2 from "../../assets/modal-avatar6.png";

const WantSideWaifuSection = () => {
    return (
        <div className="w-full px-4">
            <div className="relative -mx-4 w-[initial] h-full">
                <div className="absolute bottom-0 left-0 z-[1] w-full max-w-[220px] flex">
                    <img alt="Gift" className="h-full w-full object-contain  z-[1]" src={waifuSide1} />
                </div>
                <div className="relative mx-auto w-full max-w-[calc(100%-34px)] rounded-[20px] bg-[#750717] px-14 py-[29px] min-h-[200px] ">
                    <div className="relative z-10 flex h-full w-full">
                        <h2 className="font-luckiest-guy uppercase text-[32px] text-white leading-[90%] text-center w-full pt-2">
                            Want side <br /> <span className="font-luckiest-guy text-[#E84A61]">waifus?</span>
                        </h2>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 z-[1] w-full max-w-[220px] flex">
                    <img alt="modalAvatar" className="h-full w-full object-contain z-[1]" src={waifuSide2} />
                </div>
            </div>
        </div>
    );
};

export default WantSideWaifuSection;
