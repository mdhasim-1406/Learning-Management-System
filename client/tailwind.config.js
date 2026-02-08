import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                // We can keep using our CSS variables or define them here
                // NextUI theme will handle the main semantic colors
            },
        },
    },
    darkMode: "class",
    plugins: [
        nextui({
            themes: {
                light: {
                    colors: {
                        primary: {
                            DEFAULT: "#047857", // emerald-700
                            foreground: "#ffffff",
                        },
                        secondary: {
                            DEFAULT: "#0d9488", // teal-600
                            foreground: "#ffffff",
                        },
                        success: {
                            DEFAULT: "#10b981", // emerald-500
                            foreground: "#ffffff",
                        },
                        warning: {
                            DEFAULT: "#f59e0b", // amber-500
                            foreground: "#ffffff",
                        },
                        danger: {
                            DEFAULT: "#e11d48", // rose-600
                            foreground: "#ffffff",
                        },
                        background: "#fafaf9", // stone-50
                        foreground: "#1c1917", // stone-900
                    },
                },
            },
        }),
    ],
};
