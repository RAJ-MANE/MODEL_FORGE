import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Grid,
  TextField,
  Stack,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Psychology,
  VideoCall,
  Mic,
  Assessment,
  WorkOutline,
  ArrowForward,
  FaceRetouchingNatural,
  GraphicEq,
  AutoAwesome,
  TrendingUp,
  Speed,
  EmojiEvents,
  KeyboardArrowDown,
  BarChart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ResumeUpload from './ResumeUpload';
import NavigationHeader from './NavigationHeader';

// Hook to detect when element enters viewport
const useIntersectionObserver = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

// Animated counter component
const AnimatedCounter: React.FC<{ end: number; suffix?: string; prefix?: string; duration?: number }> = ({
  end, suffix = '', prefix = '', duration = 2000
}) => {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useIntersectionObserver(0.3);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [jobRole, setJobRole] = useState('Software Developer');
  const [resumeData, setResumeData] = useState<any>(null);
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const statsSection = useIntersectionObserver(0.2);
  const howItWorksSection = useIntersectionObserver(0.1);
  const techSection = useIntersectionObserver(0.1);
  const ctaSection = useIntersectionObserver(0.2);

  const startInterview = () => {
    const sessionId = uuidv4();
    const params = new URLSearchParams({
      role: jobRole,
      hasResume: resumeData ? 'true' : 'false'
    });
    if (resumeData) {
      sessionStorage.setItem(`resume_${sessionId}`, JSON.stringify(resumeData));
      sessionStorage.setItem('resumeData', JSON.stringify(resumeData));
    }
    navigate(`/interview/${sessionId}?${params.toString()}`);
  };

  const handleResumeAnalyzed = (data: any) => {
    setResumeData(data);
  };

  const steps = [
    {
      icon: <WorkOutline sx={{ fontSize: 36 }} />,
      title: 'Set Your Profile',
      desc: 'Enter your target role and optionally upload your resume. Our AI instantly parses your skills and experience.',
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.1)',
    },
    {
      icon: <Psychology sx={{ fontSize: 36 }} />,
      title: 'AI-Powered Questions',
      desc: 'Our language model crafts personalized behavioral, technical, and situational questions based on your target role and experience profile.',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
    },
    {
      icon: <FaceRetouchingNatural sx={{ fontSize: 36 }} />,
      title: 'Deep Multimodal Analysis',
      desc: 'Computer vision reads your facial expressions in real-time. Audio intelligence analyzes your voice tone, pace, and clarity as you speak.',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
    },
    {
      icon: <BarChart sx={{ fontSize: 36 }} />,
      title: 'Comprehensive Evaluation Report',
      desc: 'The AI engine synthesizes all signals — verbal, facial, vocal — into a comprehensive growth report with structured, actionable insights.',
      color: '#ec4899',
      bg: 'rgba(236,72,153,0.1)',
    },
  ];

  const technologies = [
    {
      icon: <FaceRetouchingNatural sx={{ fontSize: 40 }} />,
      name: 'Computer Vision',
      label: 'Facial Intelligence',
      desc: 'Real-time 468-point facial landmark detection to measure confidence, engagement, and eye contact at 30fps.',
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    },
    {
      icon: <GraphicEq sx={{ fontSize: 40 }} />,
      name: 'Audio Intelligence',
      label: 'Voice Analytics',
      desc: 'Spectral analysis, pitch detection, and speech rate estimation for comprehensive vocal confidence scoring.',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 40 }} />,
      name: 'Language AI',
      label: 'Response Evaluation',
      desc: 'A state-of-the-art large language model generates role-specific questions, evaluates response quality, and produces comprehensive career reports.',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    },
  ];

  return (
    <>
      {/* Global keyframe animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16,185,129,0.4); }
          50% { box-shadow: 0 0 60px rgba(16,185,129,0.8); }
        }
        @keyframes particle-drift {
          0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(30px, -40px) scale(1.1); opacity: 0.3; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
        }
        @keyframes chevron-bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes typewriter-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .stat-card:hover { transform: translateY(-6px); }
        .tech-card:hover { transform: translateY(-8px) scale(1.02); }
        .step-card:hover { transform: translateY(-4px); }
      `}</style>

      <NavigationHeader />

      {/* ─── SECTION 1: HERO ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 30%, #051a11 60%, #0a0f1e 100%)',
          backgroundSize: '300% 300%',
          animation: 'gradient-shift 10s ease infinite',
        }}
      >
        {/* Particle field */}
        {[...Array(25)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              borderRadius: '50%',
              backgroundColor: i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#6366f1' : '#f59e0b',
              opacity: 0.4 + Math.random() * 0.4,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `particle-drift ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Glowing orbs */}
        <Box sx={{
          position: 'absolute', top: '10%', left: '5%', width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)', transform: `translateY(${scrollY * 0.1}px)`,
        }} />
        <Box sx={{
          position: 'absolute', bottom: '15%', right: '8%', width: 500, height: 500,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)', transform: `translateY(${-scrollY * 0.08}px)`,
        }} />
        <Box sx={{
          position: 'absolute', top: '40%', right: '15%', width: 300, height: 300,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 12, md: 4 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ animation: 'slide-up 0.8s ease-out' }}>
                {/* Badge */}
                <Chip
                  icon={<AutoAwesome sx={{ color: '#f59e0b !important', fontSize: 20 }} />}
                  label="AI-Powered · Real-time Analysis"
                  sx={{
                    mb: 3,
                    backgroundColor: 'rgba(245,158,11,0.12)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    color: '#f59e0b',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    '& .MuiChip-label': { px: 1.5 }
                  }}
                />

                <Typography
                  variant="h1"
                  sx={{
                    color: 'white',
                    fontWeight: 900,
                    fontSize: { xs: '3rem', md: '4.2rem', lg: '5rem' },
                    lineHeight: 1.05,
                    mb: 3,
                    letterSpacing: '-0.02em',
                  }}
                >
                  The AI That{' '}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #6366f1 50%, #f59e0b 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundSize: '200% 200%',
                      animation: 'gradient-shift 4s ease infinite',
                    }}
                  >
                    Reads You
                  </Box>
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255,255,255,0.75)',
                    mb: 4,
                    lineHeight: 1.6,
                    fontWeight: 400,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    maxWidth: 520,
                  }}
                >
                  Real-time multimodal interview coaching — analyzing your{' '}
                  <Box component="span" sx={{ color: '#10b981', fontWeight: 600 }}>expressions</Box>,{' '}
                  <Box component="span" sx={{ color: '#6366f1', fontWeight: 600 }}>voice</Box>, and{' '}
                  <Box component="span" sx={{ color: '#f59e0b', fontWeight: 600 }}>responses</Box>{' '}
                  simultaneously. Built for professionals who take their growth seriously.
                </Typography>

                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1.5, mb: 5 }}>
                  {[
                    { label: 'Facial Expression Analysis', color: '#6366f1' },
                    { label: 'Voice Tone Intelligence', color: '#10b981' },
                    { label: 'Neural Language AI', color: '#f59e0b' },
                    { label: 'Real-time Streaming', color: '#ec4899' },
                  ].map(({ label, color }) => (
                    <Chip
                      key={label}
                      label={label}
                      size="small"
                      sx={{
                        backgroundColor: `${color}18`,
                        border: `1px solid ${color}40`,
                        color: color,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  ))}
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    onClick={() => document.getElementById('start-section')?.scrollIntoView({ behavior: 'smooth' })}
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '50px',
                      animation: 'pulse-glow 3s ease-in-out infinite',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        transform: 'translateY(-2px) scale(1.02)',
                      },
                    }}
                  >
                    Start Your Interview
                  </Button>
                  <Button
                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                    variant="outlined"
                    size="large"
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: '1rem',
                      fontWeight: 600,
                      border: '1px solid rgba(255,255,255,0.25)',
                      color: 'rgba(255,255,255,0.85)',
                      borderRadius: '50px',
                      '&:hover': { border: '1px solid rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.05)' },
                    }}
                  >
                    See How It Works
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* Right side: floating analysis preview cards */}
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', height: 420, display: { xs: 'none', md: 'block' } }}>
                {/* Facial Analysis Card */}
                <Card sx={{
                  position: 'absolute', top: 0, left: '10%',
                  background: 'rgba(15,23,42,0.85)',
                  border: '1px solid rgba(99,102,241,0.4)',
                  backdropFilter: 'blur(20px)',
                  p: 2.5, borderRadius: 3,
                  animation: 'float 4s ease-in-out infinite',
                  boxShadow: '0 20px 60px rgba(99,102,241,0.2)',
                  width: 220,
                }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                    <Avatar sx={{ bgcolor: 'rgba(99,102,241,0.2)', width: 36, height: 36 }}>
                      <FaceRetouchingNatural sx={{ color: '#6366f1', fontSize: 20 }} />
                    </Avatar>
                    <Typography variant="body2" fontWeight={700} color="white">Facial Analysis</Typography>
                  </Stack>
                  {[
                    { label: 'Confidence', value: 87, color: '#10b981' },
                    { label: 'Eye Contact', value: 92, color: '#6366f1' },
                    { label: 'Engagement', value: 78, color: '#f59e0b' },
                  ].map(({ label, value, color }) => (
                    <Box key={label} mb={0.8}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography variant="caption" color="rgba(255,255,255,0.6)">{label}</Typography>
                        <Typography variant="caption" fontWeight={700} color={color}>{value}%</Typography>
                      </Box>
                      <Box sx={{ height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.08)' }}>
                        <Box sx={{ height: '100%', width: `${value}%`, borderRadius: 2, backgroundColor: color }} />
                      </Box>
                    </Box>
                  ))}
                </Card>

                {/* Voice Analysis Card */}
                <Card sx={{
                  position: 'absolute', bottom: 40, left: '5%',
                  background: 'rgba(15,23,42,0.85)',
                  border: '1px solid rgba(16,185,129,0.4)',
                  backdropFilter: 'blur(20px)',
                  p: 2.5, borderRadius: 3,
                  animation: 'float 5s ease-in-out infinite',
                  animationDelay: '1s',
                  boxShadow: '0 20px 60px rgba(16,185,129,0.2)',
                  width: 200,
                }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                    <Avatar sx={{ bgcolor: 'rgba(16,185,129,0.2)', width: 36, height: 36 }}>
                      <GraphicEq sx={{ color: '#10b981', fontSize: 20 }} />
                    </Avatar>
                    <Typography variant="body2" fontWeight={700} color="white">Voice Score</Typography>
                  </Stack>
                  <Typography variant="h3" fontWeight={900} sx={{ color: '#10b981', lineHeight: 1 }}>84</Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.5)">out of 100</Typography>
                  <Box sx={{ mt: 1.5 }}>
                    {[{ label: 'Clarity', val: 'Excellent' }, { label: 'Pace', val: 'Optimal' }].map(({ label, val }) => (
                      <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="rgba(255,255,255,0.5)">{label}</Typography>
                        <Typography variant="caption" color="#10b981" fontWeight={700}>{val}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Card>

                {/* AI Gemini Card */}
                <Card sx={{
                  position: 'absolute', top: '20%', right: '2%',
                  background: 'rgba(15,23,42,0.9)',
                  border: '1px solid rgba(245,158,11,0.4)',
                  backdropFilter: 'blur(20px)',
                  p: 2.5, borderRadius: 3,
                  animation: 'float 6s ease-in-out infinite',
                  animationDelay: '2s',
                  boxShadow: '0 20px 60px rgba(245,158,11,0.2)',
                  width: 210,
                }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                    <Avatar sx={{ bgcolor: 'rgba(245,158,11,0.2)', width: 36, height: 36 }}>
                      <AutoAwesome sx={{ color: '#f59e0b', fontSize: 20 }} />
                    </Avatar>
                    <Typography variant="body2" fontWeight={700} color="white">Gemini AI</Typography>
                  </Stack>
                  <Typography variant="caption" color="rgba(255,255,255,0.65)" sx={{ lineHeight: 1.5 }}>
                    "Tell me about a time you led a cross-functional team under a tight deadline..."
                  </Typography>
                  <Chip
                    label="Behavioral · Medium"
                    size="small"
                    sx={{ mt: 1.5, backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontWeight: 600, fontSize: '0.7rem' }}
                  />
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Scroll indicator */}
        <Box sx={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <Typography variant="caption" color="rgba(255,255,255,0.4)" display="block" mb={1}>Scroll to explore</Typography>
          <KeyboardArrowDown sx={{ color: 'rgba(255,255,255,0.4)', animation: 'chevron-bounce 1.5s ease-in-out infinite' }} />
        </Box>
      </Box>

      {/* ─── SECTION 2: STATS COUNTER ────────────────────────────────────────── */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #0d1b2a 0%, #0a1628 100%)' }}>
        <Container maxWidth="lg">
          <div ref={statsSection.ref}>
            <Grid container spacing={4} justifyContent="center">
              {[
                { label: 'Facial Landmarks Tracked', end: 468, suffix: '+', icon: <FaceRetouchingNatural />, color: '#6366f1' },
                { label: 'AI Model Accuracy', end: 94, suffix: '%', icon: <AutoAwesome />, color: '#f59e0b' },
                { label: 'AI Analysis Dimensions', end: 12, suffix: '', icon: <Assessment />, color: '#10b981' },
                { label: 'Millisecond Response Time', end: 50, suffix: 'ms', icon: <Speed />, color: '#ec4899' },
              ].map(({ label, end, suffix, icon, color }, i) => (
                <Grid item xs={6} md={3} key={label}>
                  <Card
                    className="stat-card"
                    sx={{
                      textAlign: 'center', p: 3,
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${color}30`,
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      transition: 'transform 0.3s ease',
                      animation: statsSection.isVisible ? `slide-up 0.6s ease-out ${i * 0.15}s both` : 'none',
                    }}
                  >
                    <Avatar sx={{ bgcolor: `${color}18`, mx: 'auto', mb: 2, width: 52, height: 52 }}>
                      <Box sx={{ color }}>{icon}</Box>
                    </Avatar>
                    <Typography variant="h3" fontWeight={900} sx={{ color, lineHeight: 1 }}>
                      {statsSection.isVisible ? <AnimatedCounter end={end} suffix={suffix} /> : `0${suffix}`}
                    </Typography>
                    <Typography variant="caption" color="rgba(255,255,255,0.55)" sx={{ mt: 1, display: 'block', lineHeight: 1.4 }}>
                      {label}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </Container>
      </Box>

      {/* ─── SECTION 3: HOW IT WORKS ─────────────────────────────────────────── */}
      <Box id="how-it-works" sx={{ py: 10, background: '#060c14' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip label="HOW IT WORKS" sx={{ mb: 2, backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 700, letterSpacing: '0.1em' }} />
            <Typography variant="h2" fontWeight={800} color="white" sx={{ mb: 2 }}>
              From Upload to{' '}
              <Box component="span" sx={{ color: '#10b981' }}>Insight</Box>
            </Typography>
            <Typography variant="h6" color="rgba(255,255,255,0.55)" sx={{ maxWidth: 560, mx: 'auto' }}>
              Four intelligent steps that transform a practice session into actionable career intelligence.
            </Typography>
          </Box>

          <div ref={howItWorksSection.ref}>
            <Grid container spacing={3}>
              {steps.map((step, i) => (
                <Grid item xs={12} sm={6} md={3} key={step.title}>
                  <Card
                    className="step-card"
                    sx={{
                      p: 3.5, height: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${step.color}25`,
                      borderRadius: 3,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      animation: howItWorksSection.isVisible ? `slide-up 0.7s ease-out ${i * 0.15}s both` : 'none',
                      '&:hover': { boxShadow: `0 16px 40px ${step.color}25` },
                    }}
                  >
                    <Box
                      sx={{
                        width: 60, height: 60, borderRadius: 2,
                        backgroundColor: step.bg,
                        border: `1px solid ${step.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mb: 2.5, color: step.color,
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography variant="caption" sx={{ color: step.color, fontWeight: 700, letterSpacing: '0.08em', mb: 1, display: 'block' }}>
                      STEP {String(i + 1).padStart(2, '0')}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="white" gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.55)" sx={{ lineHeight: 1.7 }}>
                      {step.desc}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </Container>
      </Box>

      {/* ─── SECTION 4: TECHNOLOGY SHOWCASE ─────────────────────────────────── */}
      <Box sx={{ py: 10, background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a2e 100%)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip label="CORE TECHNOLOGIES" sx={{ mb: 2, backgroundColor: 'rgba(99,102,241,0.1)', color: '#6366f1', fontWeight: 700, letterSpacing: '0.1em' }} />
            <Typography variant="h2" fontWeight={800} color="white" sx={{ mb: 2 }}>
              Intelligent.
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #6366f1, #10b981)',
                backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                {' '}Precise.
              </Box>
            </Typography>
            <Typography variant="h6" color="rgba(255,255,255,0.55)" sx={{ maxWidth: 520, mx: 'auto' }}>
              Three production-grade AI systems working in concert, in real-time, delivering measurable insight.
            </Typography>
          </Box>

          <div ref={techSection.ref}>
            <Grid container spacing={4}>
              {technologies.map((tech, i) => (
                <Grid item xs={12} md={4} key={tech.name}>
                  <Card
                    className="tech-card"
                    sx={{
                      p: 4, height: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${tech.color}30`,
                      borderRadius: 4,
                      transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                      animation: techSection.isVisible ? `slide-up 0.8s ease-out ${i * 0.2}s both` : 'none',
                      '&:hover': { boxShadow: `0 24px 60px ${tech.color}20` },
                    }}
                  >
                    <Box sx={{
                      width: 70, height: 70, borderRadius: 2.5,
                      background: tech.gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      mb: 3, color: 'white',
                      boxShadow: `0 8px 24px ${tech.color}40`,
                    }}>
                      {tech.icon}
                    </Box>
                    <Typography variant="overline" sx={{ color: tech.color, fontWeight: 700, letterSpacing: '0.12em' }}>
                      {tech.label}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="white" gutterBottom sx={{ mt: 0.5 }}>
                      {tech.name}
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.55)" sx={{ lineHeight: 1.8 }}>
                      {tech.desc}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </Container>
      </Box>

      {/* ─── SECTION 5: START THE INTERVIEW CTA ──────────────────────────────── */}
      <Box id="start-section" sx={{ py: { xs: 8, md: 12 }, background: '#060c14', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800, height: 400,
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <div ref={ctaSection.ref}>
            <Box sx={{
              textAlign: 'center', mb: 6,
              animation: ctaSection.isVisible ? 'slide-up 0.8s ease-out' : 'none',
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <EmojiEvents sx={{ fontSize: 56, color: '#f59e0b' }} />
              </Box>
              <Typography variant="h2" fontWeight={800} color="white" sx={{ mb: 2 }}>
                Ready to{' '}
                <Box component="span" sx={{ color: '#10b981' }}>Elevate</Box>
                {' '}Your Performance?
              </Typography>
              <Typography variant="h6" color="rgba(255,255,255,0.6)" sx={{ maxWidth: 520, mx: 'auto', lineHeight: 1.6 }}>
                Experience the most comprehensive interview preparation platform. Structured. Intelligent. Actionable.
              </Typography>
            </Box>

            {/* CTA Card */}
            <Card sx={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(16,185,129,0.3)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              p: { xs: 3, md: 5 },
              animation: ctaSection.isVisible ? 'slide-up 1s ease-out 0.2s both' : 'none',
            }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={7}>
                  <Typography variant="h6" fontWeight={700} color="white" gutterBottom>
                    Configure Your Session
                  </Typography>
                  <ResumeUpload onResumeAnalyzed={handleResumeAnalyzed} />
                  <TextField
                    fullWidth
                    label="Target Job Role"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    variant="outlined"
                    sx={{
                      mt: 2,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(16,185,129,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#10b981' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
                    }}
                  />

                  {resumeData && (
                    <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip
                        icon={<TrendingUp sx={{ color: '#10b981 !important', fontSize: 14 }} />}
                        label={`${resumeData.skills?.length || 0} Skills Detected`}
                        size="small"
                        sx={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 600 }}
                      />
                      <Chip
                        icon={<WorkOutline sx={{ color: '#6366f1 !important', fontSize: 14 }} />}
                        label={`${resumeData.experience?.length || 0} Roles Parsed`}
                        size="small"
                        sx={{ backgroundColor: 'rgba(99,102,241,0.15)', color: '#6366f1', fontWeight: 600 }}
                      />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                  <Stack spacing={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={startInterview}
                      endIcon={<ArrowForward />}
                      sx={{
                        py: 2.5,
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '12px',
                        animation: 'pulse-glow 3s ease-in-out infinite',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Begin Interview Session
                    </Button>

                    <Stack spacing={1}>
                      {[
                        { icon: <VideoCall sx={{ fontSize: 16 }} />, text: 'Real-time facial expression analysis' },
                        { icon: <Mic sx={{ fontSize: 16 }} />, text: 'Voice tone and clarity scoring' },
                        { icon: <Psychology sx={{ fontSize: 16 }} />, text: 'AI-generated comprehensive evaluation' },
                      ].map(({ icon, text }) => (
                        <Stack key={text} direction="row" spacing={1} alignItems="center">
                          <Box sx={{ color: '#10b981', display: 'flex' }}>{icon}</Box>
                          <Typography variant="caption" color="rgba(255,255,255,0.65)">{text}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          </div>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 3, background: '#040810', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <Typography variant="body2" color="rgba(255,255,255,0.25)">
          Multimodal Assessment Network · Advanced AI Interview Intelligence · Real-time Analysis
        </Typography>
      </Box>
    </>
  );
};

export default Home;