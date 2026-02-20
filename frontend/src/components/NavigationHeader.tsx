import React, { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Home,
  Dashboard,
  Settings,
  AccountCircle,
  Psychology,
  Assessment,
  TrendingUp,
  DarkMode,
  LightMode,
  AutoAwesome,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavigationHeaderProps } from '../types';

const DARK_MODE_KEY = 'cman_dark_mode';

interface ExtendedNavigationHeaderProps extends NavigationHeaderProps {
  onDarkModeChange?: (isDark: boolean) => void;
  darkMode?: boolean;
}

const NavigationHeader: React.FC<ExtendedNavigationHeaderProps> = ({
  currentSession,
  sessionScore,
  showSessionInfo = false,
  onDarkModeChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(DARK_MODE_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  const isHomePage = location.pathname === '/';

  // Propagate dark mode to App and persist it
  useEffect(() => {
    try {
      localStorage.setItem(DARK_MODE_KEY, String(isDark));
    } catch { /* ignore */ }
    onDarkModeChange?.(isDark);
  }, [isDark, onDarkModeChange]);

  const toggleDark = useCallback(() => setIsDark(prev => !prev), []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path: string) => location.pathname === path;

  // On the home page the header overlays the dark hero
  const isOverlay = isHomePage;

  return (
    <AppBar
      position={isOverlay ? 'absolute' : 'sticky'}
      elevation={0}
      sx={{
        background: isOverlay
          ? 'linear-gradient(180deg, rgba(6,12,20,0.9) 0%, transparent 100%)'
          : 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
        backdropFilter: isOverlay ? 'none' : 'blur(20px)',
        borderBottom: isOverlay ? 'none' : '1px solid rgba(255,255,255,0.15)',
        boxShadow: isOverlay ? 'none' : '0 4px 20px rgba(4, 120, 87, 0.15)',
        zIndex: 10,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
        {/* Logo and Brand */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            '&:hover': { transform: 'scale(1.04)' },
          }}
          onClick={() => navigate('/')}
        >
          <Box sx={{ position: 'relative', mr: 1.5 }}>
            <Psychology sx={{ fontSize: 30, color: 'white' }} />
            <AutoAwesome sx={{
              fontSize: 14, color: '#f59e0b',
              position: 'absolute', top: -4, right: -4,
            }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 800,
                color: 'white',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              InterviewAI
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.65)',
                fontWeight: 500,
                fontSize: '0.65rem',
                letterSpacing: '0.08em',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              MULTIMODAL ASSESSMENT
            </Typography>
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 800,
              color: 'white',
              display: { xs: 'block', sm: 'none' },
              letterSpacing: '-0.02em',
            }}
          >
            AI Prep
          </Typography>
        </Box>

        {/* Session Info */}
        {showSessionInfo && currentSession && (
          <Box sx={{ ml: 4, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Chip
              label={`Session: ${currentSession.slice(-8)}`}
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.18)',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
            {sessionScore !== undefined && (
              <Chip
                icon={<TrendingUp sx={{ color: 'white !important' }} />}
                label={`Score: ${Math.round(sessionScore)}`}
                size="small"
                sx={{
                  backgroundColor: sessionScore >= 70 ? 'rgba(76, 175, 80, 0.8)' : 'rgba(255, 152, 0, 0.8)',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            )}
          </Box>
        )}

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Navigation Buttons */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
          <Button
            startIcon={<Home />}
            onClick={() => navigate('/')}
            sx={{
              color: 'white',
              fontWeight: isActive('/') ? 700 : 500,
              backgroundColor: isActive('/') ? 'rgba(255,255,255,0.18)' : 'transparent',
              borderRadius: '8px',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Home
          </Button>

          <Button
            startIcon={<Dashboard />}
            onClick={() => navigate('/dashboard')}
            sx={{
              color: 'white',
              fontWeight: isActive('/dashboard') ? 700 : 500,
              backgroundColor: isActive('/dashboard') ? 'rgba(255,255,255,0.18)' : 'transparent',
              borderRadius: '8px',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Dashboard
          </Button>

          <Button
            startIcon={<Assessment />}
            onClick={() => navigate('/analytics')}
            sx={{
              color: 'white',
              fontWeight: isActive('/analytics') ? 700 : 500,
              backgroundColor: isActive('/analytics') ? 'rgba(255,255,255,0.18)' : 'transparent',
              borderRadius: '8px',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Analytics
          </Button>
        </Box>

        {/* Dark Mode Toggle */}
        <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <IconButton
            onClick={toggleDark}
            sx={{
              ml: 1,
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)', transform: 'rotate(20deg)' },
            }}
          >
            {isDark ? <LightMode sx={{ fontSize: 20 }} /> : <DarkMode sx={{ fontSize: 20 }} />}
          </IconButton>
        </Tooltip>

        {/* User Menu */}
        <Box sx={{ ml: 1 }}>
          <IconButton
            size="large"
            onClick={handleMenuOpen}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
            }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 8px 25px rgba(0,0,0,0.18)',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <Typography variant="subtitle1" fontWeight={700}>Guest User</Typography>
              <Typography variant="body2" color="text.secondary">Interview Practice Session</Typography>
            </Box>

            <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
              <Dashboard sx={{ mr: 2, fontSize: 20 }} />
              Dashboard
            </MenuItem>
            <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
              <Settings sx={{ mr: 2, fontSize: 20 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                sessionStorage.clear();
                localStorage.removeItem('resumeData');
                navigate('/');
                handleMenuClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Home sx={{ mr: 2, fontSize: 20 }} />
              New Session
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Mobile Session Info */}
      {showSessionInfo && currentSession && (
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'center',
            pb: 1,
            gap: 1,
          }}
        >
          <Chip
            label={`Session: ${currentSession.slice(-8)}`}
            size="small"
            sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.7rem' }}
          />
          {sessionScore !== undefined && (
            <Chip
              label={`Score: ${Math.round(sessionScore)}`}
              size="small"
              sx={{
                backgroundColor: sessionScore >= 70 ? 'rgba(76, 175, 80, 0.8)' : 'rgba(255, 152, 0, 0.8)',
                color: 'white',
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>
      )}
    </AppBar>
  );
};

export default NavigationHeader;