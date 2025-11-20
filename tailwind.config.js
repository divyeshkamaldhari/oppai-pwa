/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
                "luckiest-guy": ["Luckiest Guy", "cursive"],
            },
            keyframes: {
                scalePulse: {
                    "0%, 100%": { transform: "scale(0.70)" },
                    "50%": { transform: "scale(1)" },
                },
            },
            animation: {
                scalePulse: "scalePulse 1.5s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
