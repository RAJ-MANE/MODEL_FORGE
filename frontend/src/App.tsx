import React, { useState, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import './App.css';

// Components
import Home from './components/Home';
import EnhancedInterviewSession from './components/EnhancedInterviewSession';
import InterviewReport from './components/InterviewReport';
import Settings from './components/Settings';
import NavigationHeader from './components/NavigationHeader';
import IntroAnimation from './components/IntroAnimation';

// Modern theme
import modernTheme from './theme';

// Tools (lazy-loaded)
const ToolsPage = lazy(() => import('./components/tools/ToolsPage'));
const ATSCheckerTool = lazy(() => import('./components/tools/ATSCheckerTool'));
const ResumeEnhancerTool = lazy(() => import('./components/tools/ResumeEnhancerTool'));
const MockQATool = lazy(() => import('./components/tools/MockQATool'));
const SalaryEstimatorTool = lazy(() => import('./components/tools/SalaryEstimatorTool'));

const AppContent: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isInterviewPage = location.pathname.includes('/interview/');

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {!isHomePage && (
        <NavigationHeader
          showSessionInfo={isInterviewPage}
          currentSession={isInterviewPage ? location.pathname.split('/')[2] : undefined}
        />
      )}
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: '#818cf8' }} />
        </Box>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interview/:sessionId" element={<EnhancedInterviewSession />} />
          <Route path="/report/:sessionId" element={<InterviewReport />} />
          <Route path="/settings" element={<Settings />} />
          {/* Career Tools */}
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/ats-checker" element={<ATSCheckerTool />} />
          <Route path="/tools/resume-enhancer" element={<ResumeEnhancerTool />} />
          <Route path="/tools/mock-qa" element={<MockQATool />} />
          <Route path="/tools/salary-estimator" element={<SalaryEstimatorTool />} />
        </Routes>
      </Suspense>
    </Box>
  );
};

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <ThemeProvider theme={modernTheme}>
      <CssBaseline />
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
