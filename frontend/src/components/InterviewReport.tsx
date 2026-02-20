import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  CircularProgress,
  Stack,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Star,
  School,
  Psychology,
  EmojiEvents,
  Home,
  RestartAlt,
  Download,
  Assessment,
} from '@mui/icons-material';

interface InterviewReportData {
  session_id: string;
  overall_score: number;
  placement_likelihood: string;
  performance_summary: string;
  strengths: string[];
  development_areas: string[];
  detailed_feedback: {
    communication: { score: number; feedback: string };
    technical_knowledge: { score: number; feedback: string };
    problem_solving: { score: number; feedback: string };
    confidence: { score: number; feedback: string };
  };
  skill_breakdown: {
    verbal_communication: number;
    confidence_level: number;
    technical_competency: number;
    problem_solving: number;
    professionalism: number;
  };
  recommendations: string[];
  generated_at: string;
}

// Dark theme token
const dark = {
  bg: '#060c14',
  surface: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  text: 'rgba(255,255,255,0.85)',
  muted: 'rgba(255,255,255,0.5)',
  green: '#10b981',
  indigo: '#6366f1',
  amber: '#f59e0b',
  pink: '#ec4899',
};

const getScoreAccent = (score: number) => {
  if (score >= 80) return dark.green;
  if (score >= 60) return dark.amber;
  return dark.pink;
};

const InterviewReport: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<InterviewReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    if (sessionId) {
      generateReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    if (report) setTimeout(() => setAnimIn(true), 100);
  }, [report]);

  const generateReport = async () => {
    try {
      setLoading(true);
      const storedData = sessionStorage.getItem(`interview_data_${sessionId}`);
      if (!storedData) {
        throw new Error('No interview data found. Please complete an interview first.');
      }
      const interviewData = JSON.parse(storedData);
      const reportData = await generateComprehensiveEvaluation(interviewData);
      setReport(reportData);
    } catch (err) {
      setError(`Failed to generate interview evaluation: ${err instanceof Error ? err.message : 'AI evaluation service is temporarily unavailable. Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  const generateComprehensiveEvaluation = async (interviewData: any): Promise<InterviewReportData> => {
    const aiServiceUrl = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8001';
    const evaluationData = {
      sessionId: interviewData.sessionId,
      job_role: interviewData.jobRole || 'Software Developer',
      totalQuestions: interviewData.totalQuestions || 5,
      questionsAnswered: interviewData.questionsAnswered || 0,
      questionsSkipped: interviewData.questionsSkipped || 0,
      averageResponseTime: interviewData.averageResponseTime || 60,
      confidence: interviewData.confidence || 0.5,
      engagement: interviewData.engagement || 0.5,
      eyeContact: interviewData.eyeContact || 0.5,
      responses: interviewData.responses || [],
      hasResume: interviewData.hasResume || false,
      totalScore: interviewData.totalScore || 0
    };

    try {
      const response = await fetch(`${aiServiceUrl}/generate/comprehensive-evaluation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evaluationData),
        signal: AbortSignal.timeout(60000)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI evaluation service responded with ${response.status}: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to AI evaluation service. Please check your internet connection and try again.');
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('AI evaluation is taking longer than expected. Please try again.');
      } else if (error instanceof Error) {
        throw new Error(`AI evaluation failed: ${error.message}`);
      } else {
        throw new Error('An unexpected error occurred during AI evaluation. Please try again.');
      }
    }
  };

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood?.toLowerCase()) {
      case 'high': return dark.green;
      case 'medium': return dark.amber;
      case 'low': return dark.pink;
      default: return dark.indigo;
    }
  };

  const scoreColor = report ? getScoreAccent(report.overall_score) : dark.green;

  /* ── LOADING ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: dark.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`@keyframes spin-glow { 0%,100% { filter: drop-shadow(0 0 8px #10b981); } 50% { filter: drop-shadow(0 0 24px #6366f1); } }`}</style>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3, animation: 'spin-glow 2s ease-in-out infinite' }}>
            <CircularProgress size={96} thickness={2} sx={{ color: dark.green }} />
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Assessment sx={{ fontSize: 40, color: dark.green }} />
            </Box>
          </Box>
          <Typography variant="h5" fontWeight={700} color="white" gutterBottom>
            Generating Your Evaluation Report
          </Typography>
          <Typography variant="body1" color={dark.muted} sx={{ mb: 1 }}>
            Analysing conversation history, behavioural patterns, and response quality
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.3)">
            This comprehensive evaluation typically takes 10–30 seconds
          </Typography>
        </Box>
      </Box>
    );
  }

  /* ── ERROR ───────────────────────────────────────────────── */
  if (error || !report) {
    return (
      <Box sx={{ minHeight: '100vh', background: dark.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Warning sx={{ fontSize: 64, color: dark.amber, mb: 2 }} />
          <Typography variant="h5" color="white" fontWeight={700} gutterBottom>Unable to Generate Report</Typography>
          <Typography variant="body1" color={dark.muted} sx={{ mb: 4 }}>{error || 'No report data available'}</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ background: `linear-gradient(135deg, ${dark.green}, #047857)`, borderRadius: '50px', px: 4, py: 1.5 }}
          >
            Return Home
          </Button>
        </Container>
      </Box>
    );
  }

  /* ── MAIN REPORT ─────────────────────────────────────────── */
  const skillLabels: Record<string, string> = {
    verbal_communication: 'Verbal Communication',
    confidence_level: 'Confidence Level',
    technical_competency: 'Technical Competency',
    problem_solving: 'Problem Solving',
    professionalism: 'Professionalism',
  };

  return (
    <Box sx={{ minHeight: '100vh', background: dark.bg }}>
      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradient-shift { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes score-ring { from { stroke-dashoffset: 301; } to { stroke-dashoffset: var(--ring-offset); } }
        @keyframes bar-grow { from { width: 0%; } to { width: var(--bar-width); } }
      `}</style>

      {/* Hero header */}
      <Box sx={{
        py: { xs: 6, md: 8 }, px: 3,
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #060c14 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* bg orb */}
        <Box sx={{ position: 'absolute', top: '-50%', left: '60%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${scoreColor}15 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ animation: 'slide-up 0.7s ease-out' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2} flexWrap="wrap">
              <Chip label="INTERVIEW COMPLETE" sx={{ backgroundColor: `${dark.green}18`, border: `1px solid ${dark.green}40`, color: dark.green, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em' }} />
              <Chip label={`Session · ${sessionId?.slice(-8)}`} sx={{ backgroundColor: dark.surface, border: `1px solid ${dark.border}`, color: dark.muted, fontSize: '0.72rem' }} />
            </Stack>
            <Typography variant="h2" fontWeight={900} color="white" sx={{ mb: 1, fontSize: { xs: '2.2rem', md: '3.2rem' }, letterSpacing: '-0.02em' }}>
              Your Performance{' '}
              <Box component="span" sx={{ background: `linear-gradient(135deg, ${scoreColor}, #6366f1)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% 200%', animation: 'gradient-shift 4s ease infinite' }}>
                Report
              </Box>
            </Typography>
            <Typography variant="h6" color={dark.muted} fontWeight={400}>
              Generated {new Date(report.generated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={3}>

          {/* ── Score Ring Card ──────────────────────────────── */}
          <Grid item xs={12} md={4} sx={{ animation: animIn ? 'slide-up 0.6s ease-out 0.1s both' : 'none' }}>
            <Card sx={{ background: dark.surface, border: `1px solid ${scoreColor}30`, borderRadius: 3, p: 4, height: '100%', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                <CircularProgress
                  variant="determinate"
                  value={report.overall_score}
                  size={140}
                  thickness={3}
                  sx={{ color: scoreColor, filter: `drop-shadow(0 0 12px ${scoreColor}60)` }}
                />
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <Typography variant="h2" fontWeight={900} sx={{ color: scoreColor, lineHeight: 1 }}>{report.overall_score}</Typography>
                  <Typography variant="caption" color={dark.muted}>out of 100</Typography>
                </Box>
              </Box>
              <Typography variant="h5" fontWeight={700} color="white" gutterBottom>Overall Score</Typography>
              <Chip
                icon={<EmojiEvents sx={{ color: `${getLikelihoodColor(report.placement_likelihood)} !important`, fontSize: 16 }} />}
                label={`${report.placement_likelihood} Placement Likelihood`}
                sx={{
                  mt: 1, fontWeight: 700, fontSize: '0.8rem',
                  backgroundColor: `${getLikelihoodColor(report.placement_likelihood)}18`,
                  border: `1px solid ${getLikelihoodColor(report.placement_likelihood)}40`,
                  color: getLikelihoodColor(report.placement_likelihood),
                }}
              />
            </Card>
          </Grid>

          {/* ── Performance Summary ──────────────────────────── */}
          <Grid item xs={12} md={8} sx={{ animation: animIn ? 'slide-up 0.6s ease-out 0.2s both' : 'none' }}>
            <Card sx={{ background: dark.surface, border: `1px solid ${dark.border}`, borderRadius: 3, p: 4, height: '100%' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
                <Avatar sx={{ bgcolor: `${dark.indigo}20`, width: 40, height: 40 }}>
                  <Psychology sx={{ color: dark.indigo, fontSize: 22 }} />
                </Avatar>
                <Typography variant="h5" fontWeight={700} color="white">Performance Summary</Typography>
              </Stack>
              <Typography variant="body1" color={dark.muted} sx={{ lineHeight: 1.8, mb: 3 }}>
                {report.performance_summary}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ p: 2.5, borderRadius: 2, background: `${dark.green}10`, border: `1px solid ${dark.green}25` }}>
                    <Typography variant="h4" fontWeight={900} sx={{ color: dark.green, lineHeight: 1 }}>{report.strengths.length}</Typography>
                    <Typography variant="body2" fontWeight={600} color={dark.green} sx={{ mt: 0.5 }}>Key Strengths</Typography>
                    <Typography variant="caption" color={dark.muted}>Areas where you excelled</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2.5, borderRadius: 2, background: `${dark.amber}10`, border: `1px solid ${dark.amber}25` }}>
                    <Typography variant="h4" fontWeight={900} sx={{ color: dark.amber, lineHeight: 1 }}>{report.development_areas.length}</Typography>
                    <Typography variant="body2" fontWeight={600} color={dark.amber} sx={{ mt: 0.5 }}>Growth Areas</Typography>
                    <Typography variant="caption" color={dark.muted}>Opportunities to improve</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* ── Skill Breakdown ──────────────────────────────── */}
          <Grid item xs={12} sx={{ animation: animIn ? 'slide-up 0.6s ease-out 0.3s both' : 'none' }}>
            <Card sx={{ background: dark.surface, border: `1px solid ${dark.border}`, borderRadius: 3, p: 4 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={3.5}>
                <Avatar sx={{ bgcolor: `${dark.amber}20`, width: 40, height: 40 }}>
                  <Star sx={{ color: dark.amber, fontSize: 22 }} />
                </Avatar>
                <Typography variant="h5" fontWeight={700} color="white">Skill Breakdown</Typography>
              </Stack>
              <Grid container spacing={3}>
                {Object.entries(report.skill_breakdown).map(([skill, score], idx) => {
                  const accent = getScoreAccent(score);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={skill}>
                      <Box sx={{ animation: animIn ? `slide-up 0.5s ease-out ${0.1 * idx}s both` : 'none' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" fontWeight={600} color={dark.text} sx={{ textTransform: 'capitalize' }}>
                            {skillLabels[skill] || skill.replace(/_/g, ' ')}
                          </Typography>
                          <Typography variant="body2" fontWeight={800} sx={{ color: accent }}>{score}</Typography>
                        </Box>
                        <Box sx={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
                          <Box sx={{
                            height: '100%', borderRadius: 3,
                            width: animIn ? `${score}%` : '0%',
                            background: `linear-gradient(90deg, ${accent}80, ${accent})`,
                            transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: `0 0 8px ${accent}60`,
                          }} />
                        </Box>
                        <Typography variant="caption" color={dark.muted}>{score}/100</Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Card>
          </Grid>

          {/* ── Detailed Feedback ────────────────────────────── */}
          <Grid item xs={12} sx={{ animation: animIn ? 'slide-up 0.6s ease-out 0.35s both' : 'none' }}>
            <Card sx={{ background: dark.surface, border: `1px solid ${dark.border}`, borderRadius: 3, p: 4 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={3.5}>
                <Avatar sx={{ bgcolor: `${dark.indigo}20`, width: 40, height: 40 }}>
                  <School sx={{ color: dark.indigo, fontSize: 22 }} />
                </Avatar>
                <Typography variant="h5" fontWeight={700} color="white">Detailed Feedback</Typography>
              </Stack>
              <Grid container spacing={2.5}>
                {Object.entries(report.detailed_feedback).map(([category, feedback], i) => {
                  const colors = [dark.green, dark.indigo, dark.amber, dark.pink];
                  const accent = colors[i % colors.length];
                  return (
                    <Grid item xs={12} md={6} key={category}>
                      <Box sx={{
                        p: 3, borderRadius: 2.5,
                        background: `${accent}08`,
                        border: `1px solid ${accent}25`,
                        height: '100%',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 24px ${accent}20` },
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                          <Typography variant="subtitle1" fontWeight={700} color="white" sx={{ textTransform: 'capitalize' }}>
                            {category.replace(/_/g, ' ')}
                          </Typography>
                          <Chip
                            label={`${feedback.score}/100`}
                            size="small"
                            sx={{ backgroundColor: `${accent}20`, color: accent, fontWeight: 800, fontSize: '0.78rem', border: `1px solid ${accent}40` }}
                          />
                        </Box>
                        <Typography variant="body2" color={dark.muted} sx={{ lineHeight: 1.7 }}>
                          {feedback.feedback}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Card>
          </Grid>

          {/* ── Strengths ────────────────────────────────────── */}
          <Grid item xs={12} md={6} sx={{ animation: animIn ? 'slide-up 0.6s ease-out 0.4s both' : 'none' }}>
            <Card sx={{ background: dark.surface, border: `1px solid ${dark.green}25`, borderRadius: 3, p: 4, height: '100%' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: `${dark.green}20`, width: 40, height: 40 }}>
                  <CheckCircle sx={{ color: dark.green, fontSize: 22 }} />
                </Avatar>
                <Typography variant="h5" fontWeight={700} color="white">Key Strengths</Typography>
              </Stack>
              <List disablePadding>
                {report.strengths.map((strength, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.8, alignItems: 'flex-start' }}>
                    <ListItemIcon sx={{ minWidth: 36, mt: 0.3 }}>
                      <TrendingUp sx={{ color: dark.green, fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={strength}
                      primaryTypographyProps={{ color: dark.text, variant: 'body2', lineHeight: 1.7 }}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>

          {/* ── Development Areas ────────────────────────────── */}
          <Grid item xs={12} md={6} sx={{ animation: animIn ? 'slide-up 0.6s ease-out 0.45s both' : 'none' }}>
            <Card sx={{ background: dark.surface, border: `1px solid ${dark.amber}25`, borderRadius: 3, p: 4, height: '100%' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: `${dark.amber}20`, width: 40, height: 40 }}>
                  <Warning sx={{ color: dark.amber, fontSize: 22 }} />
                </Avatar>
                <Typography variant="h5" fontWeight={700} color="white">Development Areas</Typography>
              </Stack>
              <List disablePadding>
                {report.development_areas.map((area, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.8, alignItems: 'flex-start' }}>
                    <ListItemIcon sx={{ minWidth: 36, mt: 0.3 }}>
                      <TrendingDown sx={{ color: dark.amber, fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={area}
                      primaryTypographyProps={{ color: dark.text, variant: 'body2', lineHeight: 1.7 }}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>

          {/* ── Recommendations ──────────────────────────────── */}
          <Grid item xs={12} sx={{ animation: animIn ? 'slide-up 0.6s ease-out 0.5s both' : 'none' }}>
            <Card sx={{ background: dark.surface, border: `1px solid ${dark.indigo}25`, borderRadius: 3, p: 4 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={3.5}>
                <Avatar sx={{ bgcolor: `${dark.indigo}20`, width: 40, height: 40 }}>
                  <EmojiEvents sx={{ color: dark.indigo, fontSize: 22 }} />
                </Avatar>
                <Typography variant="h5" fontWeight={700} color="white">Recommendations</Typography>
              </Stack>
              <Grid container spacing={2}>
                {report.recommendations.map((rec, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Box sx={{
                      p: 2.5, borderRadius: 2,
                      background: `${dark.indigo}08`,
                      border: `1px solid ${dark.indigo}20`,
                      display: 'flex', alignItems: 'flex-start', gap: 2,
                      '&:hover': { background: `${dark.indigo}12`, borderColor: `${dark.indigo}35` },
                      transition: 'all 0.2s ease',
                    }}>
                      <Box sx={{
                        minWidth: 32, height: 32, borderRadius: '8px',
                        background: `linear-gradient(135deg, ${dark.indigo}, #8b5cf6)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, color: 'white', fontSize: '0.85rem', flexShrink: 0,
                      }}>
                        {index + 1}
                      </Box>
                      <Typography variant="body2" color={dark.muted} sx={{ lineHeight: 1.7 }}>{rec}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>

          {/* ── Actions ──────────────────────────────────────── */}
          <Grid item xs={12} sx={{ animation: animIn ? 'slide-up 0.6s ease-out 0.55s both' : 'none' }}>
            <Card sx={{ background: `linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(99,102,241,0.06) 100%)`, border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 3, p: 4, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={700} color="white" gutterBottom>What's Next?</Typography>
              <Typography variant="body1" color={dark.muted} sx={{ mb: 4 }}>
                Use these insights to sharpen your interview skills and increase your chances of success.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<RestartAlt />}
                  onClick={() => navigate('/')}
                  size="large"
                  sx={{
                    py: 1.8, px: 4, borderRadius: '50px', fontWeight: 700,
                    background: `linear-gradient(135deg, ${dark.green}, #047857)`,
                    '&:hover': { background: `linear-gradient(135deg, #047857, #065f46)`, transform: 'translateY(-2px)' },
                  }}
                >
                  Practice Again
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={() => navigate('/dashboard')}
                  size="large"
                  sx={{
                    py: 1.8, px: 4, borderRadius: '50px', fontWeight: 700,
                    borderColor: 'rgba(255,255,255,0.2)', color: 'white',
                    '&:hover': { borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => window.print()}
                  size="large"
                  sx={{
                    py: 1.8, px: 4, borderRadius: '50px', fontWeight: 700,
                    borderColor: 'rgba(255,255,255,0.2)', color: 'white',
                    '&:hover': { borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  Download Report
                </Button>
              </Stack>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default InterviewReport;