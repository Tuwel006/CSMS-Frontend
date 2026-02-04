import { createTheme, ThemeOptions, alpha } from '@mui/material/styles';

// Ultra-Compact & Professional "Micro" Theme
// Designed for a crisp, high-density app feel with sharp edges

const colors = {
    primary: {
        main: '#4f46e5', // Indigo
        light: '#6366f1',
        dark: '#4338ca',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#0ea5e9', // Sky Blue
        light: '#38bdf8',
        dark: '#0284c7',
        contrastText: '#ffffff',
    },
    background: {
        light: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        dark: {
            default: '#020617',
            paper: '#0f172a',
        },
    },
};

const shape = {
    borderRadius: 4, // Sharper, more professional small radius
};

const typography = {
    fontFamily: '"Inter", "Outfit", sans-serif',
    h1: { fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontSize: '0.9375rem', fontWeight: 700 },
    h6: { fontSize: '0.875rem', fontWeight: 700 },
    subtitle1: { fontSize: '0.875rem', fontWeight: 600 },
    subtitle2: { fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
    body1: { fontSize: '0.875rem', lineHeight: 1.5 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.5 },
    button: { fontSize: '0.75rem', fontWeight: 700, textTransform: 'none' as const },
    caption: { fontSize: '0.7rem', fontWeight: 600 },
};

const getCommonComponents = (mode: 'light' | 'dark'): ThemeOptions['components'] => ({
    MuiCssBaseline: {
        styleOverrides: {
            body: {
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': { width: '4px', height: '4px' },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: mode === 'light' ? '#e2e8f0' : '#1e293b',
                    borderRadius: '10px',
                },
                '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
            },
        },
    },
    MuiButton: {
        defaultProps: {
            disableElevation: true,
            size: 'small', // Force small for everything
        },
        styleOverrides: {
            root: {
                borderRadius: 4,
                padding: '4px 12px',
                minHeight: 32,
                fontWeight: 600,
            },
            contained: {
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' },
            },
        },
    },
    MuiTextField: {
        defaultProps: {
            size: 'small',
            variant: 'outlined',
        },
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    fontSize: '0.8125rem',
                    minHeight: 34,
                    borderRadius: 4,
                    backgroundColor: mode === 'light' ? '#fff' : alpha('#1e293b', 0.5),
                    '& fieldset': {
                        borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
                    },
                },
            },
        },
    },
    MuiSelect: {
        defaultProps: {
            size: 'small',
        },
        styleOverrides: {
            select: {
                fontSize: '0.8125rem',
                padding: '6px 12px',
            },
        },
    },
    MuiCard: {
        defaultProps: {
            variant: 'outlined',
        },
        styleOverrides: {
            root: {
                borderRadius: 4,
                borderColor: mode === 'light' ? '#e2e8f0' : '#1e293b',
                boxShadow: 'none',
            },
        },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: mode === 'light' ? alpha('#fff', 0.9) : alpha(colors.background.dark.paper, 0.9),
                backdropFilter: 'blur(8px)',
                borderBottom: `1px solid ${mode === 'light' ? '#e2e8f0' : '#1e293b'}`,
                color: mode === 'light' ? '#0f172a' : '#f8fafc',
                boxShadow: 'none',
            },
        },
    },
    MuiListItemButton: {
        styleOverrides: {
            root: {
                borderRadius: 4,
                margin: '2px 8px',
                padding: '6px 12px',
                minHeight: 36,
                '&.Mui-selected': {
                    backgroundColor: alpha(colors.primary.main, 0.08),
                    color: colors.primary.main,
                    '& .MuiListItemIcon-root': { color: colors.primary.main },
                    '&:hover': { backgroundColor: alpha(colors.primary.main, 0.12) },
                },
            },
        },
    },
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                minWidth: 32,
                color: 'inherit',
            },
        },
    },
    MuiTypography: {
        styleOverrides: {
            root: {
                letterSpacing: '0.01em',
            },
        },
    },
});

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        ...colors,
        primary: colors.primary,
        background: colors.background.light,
        divider: '#e2e8f0',
    },
    shape,
    typography,
    components: getCommonComponents('light'),
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        ...colors,
        primary: { ...colors.primary, main: '#818cf8' },
        background: colors.background.dark,
        divider: '#1e293b',
    },
    shape,
    typography,
    components: getCommonComponents('dark'),
});
