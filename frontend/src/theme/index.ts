import { createTheme } from '@mui/material/styles';

// Poppr.be inspired dark theme – premium, immersive, and consistent
export const modernTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',   // Blue – matches Poppr accent
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6',   // Purple – complementary accent
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    background: {
      default: '#050505', // Near-black canvas
      paper: '#0a0a0a',   // Slightly lighter surfaces
    },
    text: {
      primary: '#f8f8f8',
      secondary: '#a1a1aa',
    },
    success: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.3 },
    h4: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.35 },
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
    button: { fontWeight: 600, textTransform: 'none' as const },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#050505',
          color: '#f8f8f8',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none' as const,
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 20px rgba(59,130,246,0.25)' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' },
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.15)',
          color: '#f8f8f8',
          '&:hover': { borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.05)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundImage: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            borderColor: 'rgba(255,255,255,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0a0a0a',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
            '&:hover fieldset': { borderColor: 'rgba(59,130,246,0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          backgroundColor: 'rgba(255,255,255,0.06)',
        },
        bar: {
          borderRadius: 8,
          background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, border: 'none' },
        standardSuccess: { backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e' },
        standardInfo: { backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
        standardWarning: { backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
        standardError: { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111111',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.08)' },
      },
    },
  },
});

export default modernTheme;