import { saveAgeVerified } from "../redux/slices/userSlice";
import { AppDispatch } from "../redux/store";

interface IAgeCheckerCustomer {
    dob_year: number;
    dob_month: number;
    dob_day: number;
}

interface IAgeCheckerCommonConfig {
    key: string;
    allow_close?: boolean;
    onclosed?: () => void;
    onpresubmit?: (data: { customer: IAgeCheckerCustomer }, done: () => void, cancel: () => void) => void;
    element?: string;
    rename_element?: boolean;
}

interface IAgeCheckerConfig {
    autoload?: boolean;
    background?: string;
    accent_color?: string;
    path?: string;
    onready?: () => void;
}

interface IAgeCheckerAPIType {
    createInstance: (config: IAgeCheckerCommonConfig) => void;
}

declare global {
    interface Window {
        AgeCheckerConfig?: IAgeCheckerConfig;
        AgeCheckerAPI?: IAgeCheckerAPIType;
    }
}

export const initAgeChecker = (userDetail: { name?: string; age_verified?: boolean }, dispatch: AppDispatch, AGE_CHECKER_KEY: string, BACKEND_URL: string) => {
    if (!userDetail?.name) return;

    let DOB_OF_USER: string | null = null;
    let currentStep = 0; // track popup step

    if (userDetail?.age_verified) return;

    const config = {
        autoload: false,
        background: "rgba(0,0,0,0.7)",
        accent_color: "#CE2A42",
        onready: function () {
            let inst: any = "";

            const createInst = () => {
                const commonConfig = {
                    key: AGE_CHECKER_KEY,
                    background: "rgba(0,0,0,0.7)",
                    accent_color: "#CE2A42",
                    allow_close: true,
                    show_close: true,
                    bind_all: true,
                    accessibility: false,
                    date_format: "MM/DD/YYYY",
                    infinite_retries: true,
                    enable_destroy: true,
                    scroll_into_view: false,
                    data: {
                        first_name: userDetail?.name?.split(" ")[0] || "",
                        last_name: userDetail?.name?.split(" ")[1] || "",
                        country: "US",
                    },
                    logo_url: `${BACKEND_URL}/wp-content/themes/brook-child/images/oppai-header-logo.svg`,

                    onshow: function () {
                        const fileInput = document.querySelector(".ac-file");

                        if (fileInput) fileInput.removeAttribute("capture");
                    },
                    onstep: function (step: number) {
                        currentStep = step;
                        if (step === 5) {
                            const upload = document.getElementById("ac-snap-upload");

                            if (upload) upload.style.display = "block";
                        }
                    },
                    onpresubmit: function (data: { customer: { dob_year: number; dob_month: number; dob_day: number } }, done: () => void) {
                        DOB_OF_USER = `${data.customer.dob_year}-${String(data.customer.dob_month).padStart(
                            2,
                            "0",
                        )}-${String(data.customer.dob_day).padStart(2, "0")}`;
                        done();
                    },

                    onstatuschanged: function (verification: { status: string }) {
                        if (verification.status === "accepted") {
                            dispatch(
                                saveAgeVerified({
                                    age_verified: true,
                                    DOB_OF_USER: DOB_OF_USER as string,
                                }),
                            );
                        }
                    },
                    onhide: function () {
                        if (currentStep >= 4) {
                            localStorage.removeItem("ac_upload");
                            inst.destroy();
                            setTimeout(() => {
                                createInst();
                            }, 500);
                        }
                    },
                };

                inst = window.AgeCheckerAPI!.createInstance({
                    ...commonConfig,
                    element: "#verifyMyAgeAtFeatureSection",
                    rename_element: false,
                });
            };

            createInst();
        },
    };

    if (!window.AgeCheckerConfig) {
        window.AgeCheckerConfig = config;
        const script = document.createElement("script");

        script.src = "https://cdn.agechecker.net/static/popup/v1/popup.js";
        script.crossOrigin = "anonymous";
        document.head.insertBefore(script, document.head.firstChild);
    } else {
        window.AgeCheckerConfig = config;
    }
};

export const initAgeCheckerUploadWatcher = () => {
    let clickCount = 0;

    const interval = setInterval(() => {
        const uploadLabel = document.getElementById("ac-upload-label");
        const nextButton = document.getElementById("ac-next-button");
        const errorContainer = document.getElementById("ac-error");
        const errorText = document.getElementById("ac-errtext");
        const errorIcon = errorContainer?.querySelector("i.ac-fa") as HTMLElement | null;

        if (!errorContainer || !errorText || !errorIcon) return;

        if (uploadLabel && !uploadLabel.hasAttribute("data-listener")) {
            uploadLabel.setAttribute("data-listener", "true");
            uploadLabel.addEventListener("click", () => {
                clickCount++;
            });
        }

        if (clickCount > 1 && nextButton && nextButton.offsetParent !== null) {
            errorText.textContent = "";
            errorIcon.style.display = "none";
            errorContainer.style.display = "none";
            clickCount = 1;

            return;
        }

        if (clickCount > 1 && uploadLabel && uploadLabel.offsetParent !== null) {
            if (!errorText.textContent || errorText.textContent.trim() === "") {
                errorText.textContent = "Please upload a different image.";
                errorIcon.style.display = "inline-block";
                errorContainer.style.display = "block";
            }

            if (clickCount > 2) {
                clickCount--;
            }

            return;
        }

        errorContainer.style.display = "none";
    }, 500);

    return () => clearInterval(interval);
};
