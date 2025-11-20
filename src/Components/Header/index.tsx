import main_logo from "../../assets/opaiLogo.png";

const Header = ({ bg = "#130C1E" }: { bg?: string }) => {
    return (
        <div className={`relative flex min-h-[73px] w-full items-center justify-center self-stretch bg-[${bg}] px-4 py-2`}>
            <img alt="Oppai Dragon" className="custom-site-logo" src={main_logo} />
        </div>
    );
};

export default Header;
