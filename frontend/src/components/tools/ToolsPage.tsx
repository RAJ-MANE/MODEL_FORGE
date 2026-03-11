import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import {
    Assignment,
    AutoFixHigh,
    QuestionAnswer,
    AttachMoney,
} from '@mui/icons-material';

interface ToolCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    path: string;
    gradient: string;
    delay: number;
}

const ToolCard: React.FC<ToolCardProps> = ({ icon, title, description, path, gradient, delay }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            <Box
                onClick={() => navigate(path)}
                sx={{
                    cursor: 'pointer',
                    position: 'relative',
                    p: 4,
                    borderRadius: '24px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.21, 0.47, 0.32, 0.98)',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                        '& .tool-icon-bg': { transform: 'scale(1.1) rotate(-5deg)' },
                        '& .tool-gradient': { opacity: 1 },
                    },
                }}
            >
                <Box className="tool-gradient"
                    sx={{ position: 'absolute', inset: 0, background: gradient, opacity: 0, transition: 'opacity 0.5s ease' }} />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box className="tool-icon-bg"
                        sx={{
                            width: 64, height: 64, borderRadius: '18px',
                            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mb: 3, transition: 'transform 0.5s ease',
                            '& .MuiSvgIcon-root': { fontSize: 32, color: 'white' },
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', mb: 1.5, letterSpacing: '-0.02em' }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                        {description}
                    </Typography>
                    <Box sx={{ mt: 3, display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 600, transition: 'color 0.3s', '&:hover': { color: 'white' } }}>
                        Try it →
                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
};

const careerTools = [
    {
        icon: <Assignment />,
        title: 'ATS Resume Checker',
        description: 'Score your resume against any job description. Get ATS compatibility score, keyword matches, and actionable fixes.',
        path: '/tools/ats-checker',
        gradient: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
    },
    {
        icon: <AutoFixHigh />,
        title: 'Resume Enhancer',
        description: 'AI-powered resume improvement — stronger action verbs, quantified impact, and better keyword optimization.',
        path: '/tools/resume-enhancer',
        gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(37,99,235,0.08) 100%)',
    },
    {
        icon: <QuestionAnswer />,
        title: 'Mock Q&A Generator',
        description: 'Generate role-specific interview questions with model answers, key points, and pro tips.',
        path: '/tools/mock-qa',
        gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(217,119,6,0.08) 100%)',
    },
    {
        icon: <AttachMoney />,
        title: 'Salary Estimator',
        description: 'Get AI-estimated salary ranges based on role, experience, location, and skills with negotiation tips.',
        path: '/tools/salary-estimator',
        gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.08) 100%)',
    },
];

const ToolsPage: React.FC = () => {
    return (
        <Box sx={{ minHeight: '100vh', background: '#050505', pt: 4 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ pt: 4, pb: 6, textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Box sx={{
                            display: 'inline-flex', alignItems: 'center', gap: 1, px: 2.5, py: 1, borderRadius: '100px',
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', mb: 3
                        }}>
                            <Typography variant="caption"
                                sx={{
                                    background: 'linear-gradient(135deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent', fontWeight: 700, fontSize: '0.8rem',
                                    letterSpacing: '0.08em', textTransform: 'uppercase'
                                }}>
                                AI-Powered Career Tools
                            </Typography>
                        </Box>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                        <Typography variant="h3"
                            sx={{ fontWeight: 900, color: 'white', letterSpacing: '-0.03em', mb: 2 }}>
                            Career{' '}
                            <Box component="span"
                                sx={{
                                    background: 'linear-gradient(135deg, #818cf8, #a78bfa, #818cf8)',
                                    backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                    animation: 'gradient 4s ease infinite',
                                    '@keyframes gradient': {
                                        '0%': { backgroundPosition: '0% 50%' },
                                        '50%': { backgroundPosition: '100% 50%' }, '100%': { backgroundPosition: '0% 50%' }
                                    }
                                }}>
                                Tools
                            </Box>
                        </Typography>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                        <Typography variant="body1"
                            sx={{ color: 'rgba(255,255,255,0.45)', maxWidth: 600, mx: 'auto', lineHeight: 1.8, fontSize: '1.1rem' }}>
                            Supercharge your job search with AI — check your resume, practice interviews, estimate salary, and more.
                        </Typography>
                    </motion.div>
                </Box>

                {/* Career Tools */}
                <Grid container spacing={3} sx={{ pb: 8 }}>
                    {careerTools.map((tool, index) => (
                        <Grid item xs={12} sm={6} md={6} key={tool.path}>
                            <ToolCard {...tool} delay={0.1 + index * 0.08} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default ToolsPage;
