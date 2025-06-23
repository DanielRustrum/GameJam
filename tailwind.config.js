/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        '*.{html,js,ts,tsx}',
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/panels/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}