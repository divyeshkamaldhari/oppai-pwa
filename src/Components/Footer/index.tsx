import React from "react";
import MainLogo from "../../assets/Icons/MainLogo";
import { Button } from "antd";
import facebook from "../../Components/CometChat/assets/Facebook.png";
import instagram from "../../Components/CometChat/assets/Twitter 3.png";
import visa from "../../Components/CometChat/assets/visa-logo.svg";
import master from "../../Components/CometChat/assets/MasterCard-logo.svg";
import legal from "../../Components/CometChat/assets/legal.webp";
import social from "../../Components/CometChat/assets/Social-Media-Icons.png-1.webp";
import { Link } from "react-router";
const quickLinks = [
    { label: "Password", href: "/password" },
    { label: "FAQs", href: "/faqs" },
];

const otakuLinks = [
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Title 18 Section 2257", href: "/title-18-section-2257-statement-oppai-dragon" },
    { label: "Complaint Form", href: "https://docs.google.com/forms/d/e/1FAIpQLSdfzjiQ-kl4cBY1dWMdldVyd-vUb5fR53avDGkWGa3-81HP2Q/viewform?pli=1" },
    { label: "Legal Notice", href: "/legal-notice" },
];

const Footer = () => {
    return (
        <footer className="border-t-[8px] border-[#ce2a42] bg-[#1a102b]">
            <div className="px-4 w-full">

                <div className="footer-top py-[30px]">
                    {/* Logo + tagline */}
                    <div className="flex flex-col items-center w-full mb-[30px]">
                        <MainLogo className="h-14 w-full max-w-40 mb-5" />
                        <p className="font-medium text-[13px] leading-[20px] text-[#b0b3b6]">Chat with your waifu, rise as the Oppai Dragon!</p>
                    </div>

                    {/* Links */}
                    <div className="flex justify-between ">
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-[#ffffffd9] font-bold text-[17px] leading-[24px] mb-2">Quick Links</h3>
                            <ul className="space-y-1 text-xs text-start ">
                                {quickLinks.map((item, i) => (
                                    <li key={i}>
                                        <Link to={item.href} className="hover:text-[#ce2a42]">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* Buttons */}
                            <div className="mt-3 flex flex-col gap-2">
                                <Button type="primary" className="bg-[#ce2a42]  rounded-md text-xs font-semibold">
                                    Login
                                </Button>
                                <Button type="primary" className="bg-[#ff3366]  rounded-md text-xs font-semibold">
                                    Sign Up
                                </Button>
                            </div>
                        </div>

                        {/* Otaku Code */}
                        <div>
                            <h3 className="text-[#ffffffd9] font-bold text-[17px] leading-[24px] mb-2">Otaku Code</h3>
                            <ul className="space-y-1 text-xs text-start">
                                {otakuLinks.map((item, i) => (
                                    <li key={i}>
                                        <Link to={item.href} className="hover:text-[#ce2a42]">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className="px-6 mt-6 text-xs text-start text-gray-300 flex flex-col gap-2">
                            <h3 className="text-[#ffffffd9] font-bold text-[17px] leading-[24px] mb-2">Contact Me</h3>
                            <p>zoe@oppaidragon.com</p>
                            <p>+1 (307) 429–3184</p>
                            <p>Hours: 6 PM – 2 AM ET</p>
                        </div>
                        <div className="flex flex-wrap gap-4 w-[30%]">
                            <img src={facebook} className="w-[40px] h-[40px]" alt="" />
                            <img src={instagram} className="w-[40px] h-[40px]" alt="" />
                            <img src={master} className="w-[40px] h-[40px]" alt="" />
                            <img src={visa} className="w-[40px] h-[40px]" alt="" />
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="border-t border-gray-700 py-3 mt-6 text-[10px] text-gray-400">
                        <img src={social} alt="" className="h-[56px] m-auto" />

                        <div className="flex justify-between mt-3 px-5">
                            <div className="">
                                <p> Page best viewed on mobile.</p>
                                <p>© 2025 Oppai Dragon</p>
                            </div>
                            <img src={legal} className="w-[99px]" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
