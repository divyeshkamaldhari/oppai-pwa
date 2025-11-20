import { Link } from "react-router";

import modalAvatar from "../../../public/assets/modal-avatar4.png";
import GiftImage from "../../../public/assets/Gift-img.png";
import { APP_ROUTE } from "../../constants/AppRoutes";

const GiftCard = () => {
    return (
        <div className="w-full px-4">
            <div className="relative -mx-4 w-[initial]">
                <div className="relative mx-auto w-full max-w-[calc(100%-34px)] rounded-[21px] bg-[#CE2A42] p-[22px]">
                    <div className="relative z-10 flex h-full w-full flex-col gap-3 pr-[120px]">
                        <h2 className="font-poppins text-lg font-semibold text-white leading-[133%]">
                            Show me you&apos;re my #1. Spoil me with my fave gifts!
                        </h2>
                        <Link className="w-fit rounded-full bg-white px-5 py-2.5 text-center text-xs font-bold text-[#CE2A42]" to={APP_ROUTE.GIFT}>
                            SHOW HER MY LOVE
                        </Link>
                    </div>
                    <div className="absolute bottom-0 right-[22px] w-full max-w-[176px]">
                        <img alt="Gift" className="h-full w-full object-contain" src={GiftImage} />
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 z-[1] w-full max-w-[184px]">
                    <img alt="modalAvatar" className="h-full w-full object-contain" src={modalAvatar} />
                </div>
            </div>
        </div>
    );
};

export default GiftCard;
