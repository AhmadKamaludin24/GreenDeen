export const PALETTE = {
    primary: '#10B981', // Emerald Green
    primaryDark: '#047857',
    headerBackground: '#0F172A', // Deep Navy/Teal
    accentGlow: '#34D399',
    darkModeBg: '#0F172A',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#6B7280',
    lightGray: '#E5E7EB', // Borders
    darkGray: '#374151',
    offWhite: '#F8FAFC', // Slate-50 for background
    cardBg: '#FFFFFF',
    text: '#1E293B', // Slate-800
    textSecondary: '#64748B', // Slate-500
    gold: '#F59E0B', // For decorative elements
};

// Backward compatibility
// Backward compatibility
export const COLORS = {
    primary: PALETTE.primary,
    darkGradientStart: PALETTE.headerBackground,
    darkGradientEnd: PALETTE.headerBackground, // Flat color for now or subtle gradient
    backgroundLight: PALETTE.offWhite,
    accentGlow: PALETTE.accentGlow,
    darkModeBg: PALETTE.darkModeBg,
    white: PALETTE.white,
    text: PALETTE.text,
    textLight: '#F1F5F9',
    gray: PALETTE.textSecondary,
    lightGray: PALETTE.lightGray,
    gold: PALETTE.gold,
};

export const lightTheme = {
    colors: {
        background: PALETTE.offWhite,
        text: '#1F2937',
        textSecondary: PALETTE.gray,
        cardBg: PALETTE.white,
        primary: PALETTE.primary,
        accent: PALETTE.accentGlow,
        border: PALETTE.lightGray,
    },
    statusBarStyle: 'dark',
};

export const darkTheme = {
    colors: {
        background: PALETTE.darkModeBg,
        text: PALETTE.offWhite,
        textSecondary: '#9CA3AF',
        cardBg: '#1F2937',
        primary: PALETTE.primary,
        accent: PALETTE.accentGlow,
        border: '#374151',
    },
    statusBarStyle: 'light',
};

export const THEME_SHADOWS = {
    small: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5.46,
        elevation: 5,
    },
};
