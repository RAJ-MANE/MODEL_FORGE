import React, { useState } from 'react';
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
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Home,
  Settings,
  AccountCircle,
  Psychology,
  TrendingUp,
  AutoAwesome,
  Build,

  KeyboardArrowDown,
  Assignment,
  AutoFixHigh,
  QuestionAnswer,
  AttachMoney,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavigationHeaderProps } from '../types';

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentSession,
  sessionScore,
  showSessionInfo = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [toolsAnchorEl, setToolsAnchorEl] = useState<null | HTMLElement>(null);

  const isHomePage = location.pathname === '/';

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path: string) => location.pathname === path;
  const isToolsActive = location.pathname.startsWith('/tools');

  const handleToolsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setToolsAnchorEl(event.currentTarget);
  };
  const handleToolsMenuClose = () => {
    setToolsAnchorEl(null);
  };

  // On the home page the header overlays the dark hero
  const isOverlay = isHomePage;

  return (
    <AppBar
      position={isOverlay ? 'absolute' : 'sticky'}
      elevation={0}
      sx={{
        background: isOverlay
          ? 'linear-gradient(180deg, rgba(5,5,5,0.9) 0%, transparent 100%)'
          : 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: isOverlay ? 'none' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: isOverlay ? 'none' : '0 4px 30px rgba(0,0,0,0.3)',
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
              fontSize: 14, color: '#60a5fa',
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
              Improvyu
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
            Improvyu
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

          {/* Tools Dropdown */}
          <Button
            startIcon={<Build />}
            endIcon={<KeyboardArrowDown />}
            onClick={handleToolsMenuOpen}
            sx={{
              color: 'white',
              fontWeight: isToolsActive ? 700 : 500,
              backgroundColor: isToolsActive ? 'rgba(255,255,255,0.18)' : 'transparent',
              borderRadius: '8px',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Tools
          </Button>
          <Menu
            anchorEl={toolsAnchorEl}
            open={Boolean(toolsAnchorEl)}
            onClose={handleToolsMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 240,
                borderRadius: 2,
                bgcolor: 'rgba(20,20,20,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                '& .MuiMenuItem-root': {
                  color: 'white',
                  borderRadius: 1,
                  mx: 0.5,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                },
              },
            }}
          >
            {/* Career Tools */}
            <MenuItem onClick={() => { navigate('/tools/ats-checker'); handleToolsMenuClose(); }}>
              <ListItemIcon><Assignment sx={{ color: '#818cf8' }} /></ListItemIcon>
              <ListItemText primary="ATS Resume Checker" />
            </MenuItem>
            <MenuItem onClick={() => { navigate('/tools/resume-enhancer'); handleToolsMenuClose(); }}>
              <ListItemIcon><AutoFixHigh sx={{ color: '#3b82f6' }} /></ListItemIcon>
              <ListItemText primary="Resume Enhancer" />
            </MenuItem>
            <MenuItem onClick={() => { navigate('/tools/mock-qa'); handleToolsMenuClose(); }}>
              <ListItemIcon><QuestionAnswer sx={{ color: '#f59e0b' }} /></ListItemIcon>
              <ListItemText primary="Mock Q&A Generator" />
            </MenuItem>
            <MenuItem onClick={() => { navigate('/tools/salary-estimator'); handleToolsMenuClose(); }}>
              <ListItemIcon><AttachMoney sx={{ color: '#10b981' }} /></ListItemIcon>
              <ListItemText primary="Salary Estimator" />
            </MenuItem>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <MenuItem onClick={() => { navigate('/tools'); handleToolsMenuClose(); }}>
              <ListItemIcon><Build sx={{ color: 'rgba(255,255,255,0.5)' }} /></ListItemIcon>
              <ListItemText primary="View All Tools" />
            </MenuItem>
          </Menu>
        </Box>

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