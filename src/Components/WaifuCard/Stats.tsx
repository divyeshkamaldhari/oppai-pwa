import AlbumIcon from "../../assets/Icons/AlbumIcon";
import EyeIcon from "../../assets/Icons/EyeIcon";
import RatingIcon from "../../assets/Icons/RatingIcon";

interface IStats {
    galleryCount: number;
    viewsCount: number;
    ratingCount: number;
}

const Stats = ({ galleryCount, viewsCount, ratingCount }: IStats) => {
    return (
        !!(galleryCount || viewsCount || ratingCount) && (
            <div className="absolute left-2 top-2 flex flex-col w-7 items-center justify-center rounded-full bg-[#551DB5] py-2 px-1 z-[1] border border-[#7F3BF4] space-y-1">
                <div className="w-full flex flex-col items-center justify-center gap-[2px] opacity-[0.6]">
                    {!!galleryCount && (
                        <>
                            <AlbumIcon className="w-[14px] h-[10px]" />
                            <span className="text-[8px] text-white">{galleryCount}</span>
                        </>
                    )}
                </div>

                <div className="w-full flex flex-col items-center justify-center gap-[2px] opacity-[0.6]">
                    {!!viewsCount && (
                        <>
                            <EyeIcon className="w-[14px] h-[10px]" />
                            <span className="text-[8px] text-white">{viewsCount}</span>
                        </>
                    )}
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-[2px] opacity-[0.6]">
                    {!!ratingCount && (
                        <>
                            <RatingIcon className="w-[14px] h-[10px]" />
                            <span className="text-[8px] text-white">{ratingCount}</span>
                        </>
                    )}
                </div>
            </div>
        )
    );
};

export default Stats;
