import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import './App.css';

// Components
import Home from './components/Home';
import EnhancedInterviewSession from './components/EnhancedInterviewSession';
import InterviewReport from './components/InterviewReport';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import NavigationHeader from './components/NavigationHeader';

// Modern theme
import modernTheme from './theme';

const DARK_MODE_KEY = 'cman_dark_mode';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isInterviewPage = location.pathname.includes('/interview/');

  const [isDark, setIsDark] = useState<boolean>(() => {
    try { return localStorage.getItem(DARK_MODE_KEY) !== 'false'; } catch { return true; }
  });

  const handleDarkModeChange = useCallback((dark: boolean) => {
    setIsDark(dark);
  }, []);

  // Apply / remove 'light-mode' class on body so global CSS can react
  useEffect(() => {
    if (isDark) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDark]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {!isHomePage && (
        <NavigationHeader
          showSessionInfo={isInterviewPage}
          currentSession={isInterviewPage ? location.pathname.split('/')[2] : undefined}
          onDarkModeChange={handleDarkModeChange}
        />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview/:sessionId" element={<EnhancedInterviewSession />} />
        <Route path="/report/:sessionId" element={<InterviewReport />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={modernTheme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
