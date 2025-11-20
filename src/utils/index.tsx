
export const isIphoneSafariOrChrome = (): boolean => {
    const ua = navigator.userAgent;

    const isIphone = /iPhone/i.test(ua);
    const isSafari = /Safari/i.test(ua) && !/CriOS/i.test(ua);
    const isChrome = /CriOS/i.test(ua); // Chrome on iOS reports as CriOS

    return isIphone && (isSafari || isChrome);
};

export const isPWA = (): boolean => {
    return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
};

// export const createPaymentJWT = async ({
//     amount,
//     currency,
//     successUrl,
//     declineUrl,
//     postbackUrl,
//     email,
// }: {
//     amount: string;
//     currency: string;
//     successUrl: string;
//     declineUrl: string;
//     postbackUrl: string;
//     email: string;
// }) => {
//     const signatureKey = VEROTEL_SIGNATURE_KEY;

//     const secret = new TextEncoder().encode(signatureKey);

//     const payload = {
//         shopId: VEROTEL_SHOP_ID,
//         priceAmount: amount,
//         priceCurrency: currency,
//         successUrl: successUrl,
//         declineUrl: declineUrl,
//         postbackUrl: postbackUrl,
//         email: email,
//     };

//     const token = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("1h").sign(secret);

//     return token;
// };

export function generateTransectionId() {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const random = "xxxxxxxxxxxxxxxx".replace(/x/g, () => ((Math.random() * 16) | 0).toString(16));

    return timestamp + random;
}

export const parseXML = (xmlString: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const getValue = (tag: string) => {
        const el = xmlDoc.getElementsByTagName(tag)[0];

        return el ? el.textContent : null;
    };

    return {
        status: getValue("status"),
        code: getValue("code"),
        technical_message: getValue("technical_message"),
        message: getValue("message"),
        unique_id: getValue("unique_id"),
        transaction_id: getValue("transaction_id"),
        timestamp: getValue("timestamp"),
        amount: getValue("amount"),
        currency: getValue("currency"),
        redirect_url: getValue("redirect_url"),
    };
};
