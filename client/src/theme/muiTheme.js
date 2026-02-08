import { createTheme, alpha } from '@mui/material/styles';

// Warm Professional Color Palette - Sunset Warmth & Golden Accents
const palette = {
    primary: {
        main: '#D84315',      // Deep Burnt Orange
        light: '#FF5722',     // Vibrant Orange
        dark: '#BF360C',      // Darker Orange
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#FF8F00',      // Warm Amber
        light: '#FFB300',     // Golden Yellow
        dark: '#E65100',      // Deep Amber
        contrastText: '#FFFFFF',
    },
    success: {
        main: '#43A047',      // Fresh Green
        light: '#66BB6A',
        dark: '#2E7D32',
    },
    warning: {
        main: '#FB8C00',      // Orange Warning
        light: '#FFA726',
        dark: '#EF6C00',
    },
    error: {
        main: '#E53935',      // Warm Red
        light: '#EF5350',
        dark: '#C62828',
    },
    info: {
        main: '#8D6E63',      // Warm Brown
        light: '#A1887F',
        dark: '#6D4C41',
    },
    grey: {
        50: '#FBF8F5',        // Warm White
        100: '#F5F0EB',       // Cream
        200: '#E8E0D9',
        300: '#D7CCC8',       // Warm Grey
        400: '#BCAAA4',
        500: '#8D6E63',
        600: '#6D4C41',
        700: '#5D4037',
        800: '#4E342E',
        900: '#3E2723',
    },
    background: {
        default: '#FBF8F5',   // Warm off-white
        paper: '#FFFFFF',
    },
    text: {
        primary: '#3E2723',   // Dark brown
        secondary: '#6D4C41', // Medium brown
    },
};

const theme = createTheme({
    palette,
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2rem',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.4,
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.4,
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.125rem',
            lineHeight: 1.5,
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0 1px 2px 0 rgba(62, 39, 35, 0.05)',
        '0 1px 3px 0 rgba(62, 39, 35, 0.1), 0 1px 2px -1px rgba(62, 39, 35, 0.1)',
        '0 4px 6px -1px rgba(62, 39, 35, 0.1), 0 2px 4px -2px rgba(62, 39, 35, 0.1)',
        '0 10px 15px -3px rgba(62, 39, 35, 0.1), 0 4px 6px -4px rgba(62, 39, 35, 0.1)',
        '0 20px 25px -5px rgba(62, 39, 35, 0.1), 0 8px 10px -6px rgba(62, 39, 35, 0.1)',
        '0 25px 50px -12px rgba(62, 39, 35, 0.25)',
        ...Array(18).fill('0 25px 50px -12px rgba(62, 39, 35, 0.25)'),
    ],
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarWidth: 'thin',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: palette.grey[100],
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: palette.grey[400],
                        borderRadius: '4px',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: '0.9375rem',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(216, 67, 21, 0.25)',
                        transform: 'translateY(-1px)',
                    },
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0 6px 20px rgba(216, 67, 21, 0.3)',
                    },
                },
                containedPrimary: {
                    background: `linear-gradient(135deg, ${palette.primary.light} 0%, ${palette.primary.dark} 100%)`,
                    '&:hover': {
                        background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.light} 100%)`,
                    },
                },
                containedSecondary: {
                    background: `linear-gradient(135deg, ${palette.secondary.light} 0%, ${palette.secondary.dark} 100%)`,
                    '&:hover': {
                        background: `linear-gradient(135deg, ${palette.secondary.main} 0%, ${palette.secondary.light} 100%)`,
                    },
                },
                outlined: {
                    borderWidth: 2,
                    '&:hover': {
                        borderWidth: 2,
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 1px 3px rgba(62, 39, 35, 0.08), 0 1px 2px rgba(62, 39, 35, 0.06)',
                    border: `1px solid ${palette.grey[200]}`,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 10px 40px rgba(216, 67, 21, 0.12)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
                elevation1: {
                    boxShadow: '0 1px 3px rgba(62, 39, 35, 0.08)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            boxShadow: `0 0 0 2px ${alpha(palette.primary.main, 0.1)}`,
                        },
                        '&.Mui-focused': {
                            boxShadow: `0 0 0 3px ${alpha(palette.primary.main, 0.2)}`,
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
                filled: {
                    '&.MuiChip-colorSuccess': {
                        background: alpha(palette.success.main, 0.15),
                        color: palette.success.dark,
                    },
                    '&.MuiChip-colorWarning': {
                        background: alpha(palette.warning.main, 0.15),
                        color: palette.warning.dark,
                    },
                    '&.MuiChip-colorError': {
                        background: alpha(palette.error.main, 0.15),
                        color: palette.error.dark,
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    backgroundColor: palette.grey[50],
                    color: palette.grey[700],
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    height: 8,
                    backgroundColor: palette.grey[200],
                },
                bar: {
                    borderRadius: 8,
                    background: `linear-gradient(90deg, ${palette.primary.main} 0%, ${palette.secondary.main} 100%)`,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 20,
                    boxShadow: '0 25px 50px -12px rgba(62, 39, 35, 0.25)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: 'none',
                    boxShadow: '4px 0 24px rgba(62, 39, 35, 0.08)',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    margin: '2px 8px',
                    '&.Mui-selected': {
                        backgroundColor: alpha(palette.primary.main, 0.1),
                        '&:hover': {
                            backgroundColor: alpha(palette.primary.main, 0.15),
                        },
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: palette.grey[900],
                    borderRadius: 8,
                    fontSize: '0.8125rem',
                    padding: '8px 12px',
                },
            },
        },
    },
});

export default theme;
