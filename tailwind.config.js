/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: '#10B981',
                primaryDark: '#047857',
                headerBackground: '#0F172A',
                accentGlow: '#34D399',
                offWhite: '#F8FAFC',
                cardBg: '#FFFFFF',
                text: '#1E293B',
                textSecondary: '#64748B',
            },
        },
    },
    plugins: [],
}
