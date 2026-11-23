import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00ACC1',
      dark: '#0097A7',
      light: '#E0F7FA',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1A3C5A',
      dark: '#0E2438',
      light: '#E1F0FA',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#1A3C5A',
      secondary: '#5A738E',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    divider: '#E2E8F0',
    success: {
      main: '#00897B',
      light: '#E0F2F1',
    },
    warning: {
      main: '#F59E0B',
      light: '#FEF3C7',
    },
    error: {
      main: '#D32F2F',
      light: '#FFEBEE',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 800,
      color: '#1A3C5A',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 800,
      color: '#1A3C5A',
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
      color: '#1A3C5A',
      letterSpacing: '-0.015em',
    },
    h4: {
      fontWeight: 700,
      color: '#1A3C5A',
    },
    h5: {
      fontWeight: 600,
      color: '#1A3C5A',
    },
    h6: {
      fontWeight: 600,
      color: '#1A3C5A',
    },
    subtitle1: {
      color: '#5A738E',
      lineHeight: 1.6,
    },
    subtitle2: {
      color: '#5A738E',
      fontWeight: 600,
    },
    body1: {
      color: '#4A6B8A',
      lineHeight: 1.7,
    },
    body2: {
      color: '#5A738E',
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.25s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 172, 193, 0.25)',
          },
        },
        containedPrimary: {
          backgroundColor: '#00ACC1',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#0097A7',
            boxShadow: '0 6px 16px rgba(0, 172, 193, 0.35)',
          },
        },
        outlinedPrimary: {
          borderColor: '#00ACC1',
          color: '#00ACC1',
          '&:hover': {
            borderColor: '#0097A7',
            backgroundColor: '#F0FBFD',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(26, 60, 90, 0.06)',
          border: '1px solid #EEF2F6',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
