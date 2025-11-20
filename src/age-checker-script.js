(function (w, d) {
    let DOB_OF_USER = null;
    const config = {
        autoload: false,
        onready: function () {
            const commonConfig = {
                key: "ZWJGuvzgkbKQzkrUEBnpTHSRE2iQmHoS",
                allow_close: true,
                infinite_retries: true,
                onclosed: function () {
                    // After everything call api of wordpress
                    console.log("DOB_OF_USER: ", DOB_OF_USER);
                    console.log("Verification closed with completion");
                },
                onpresubmit: function (data, done, cancel) {
                    DOB_OF_USER = `${data.customer.dob_day}-${data.customer.dob_month}-${data.customer.dob_year}`;
                    done();
                },
            };
            const buttonSelectors = ["#verifyMyAgeAtAccountPage", "#verifyMyAgeAtChatPage", "#verifyMyAgeAtFeatureSection"];
            buttonSelectors.forEach(function (selector) {
                AgeCheckerAPI.createInstance({
                    ...commonConfig,
                    element: selector,
                    rename_element: false,
                });
            });
        },
    };

    w.AgeCheckerConfig = config;
    if (config.path && (w.location.pathname + w.location.search).indexOf(config.path)) return;

    const h = d.getElementsByTagName("head")[0];
    const a = d.createElement("script");
    a.src = "https://cdn.agechecker.net/static/popup/v1/popup.js";
    a.crossOrigin = "anonymous";
    a.onerror = function () {
        w.location.href = "https://agechecker.net/loaderror";
    };
    h.insertBefore(a, h.firstChild);
})(window, document);
