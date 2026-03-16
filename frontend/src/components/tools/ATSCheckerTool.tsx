import { AI_SERVICE_URL } from '../../utils/config';
import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, LinearProgress, Chip, IconButton } from '@mui/material';
import { ArrowBack, CloudUpload, CheckCircle, Cancel, Warning } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// AI_SERVICE_URL imported from config

const ATSCheckerTool: React.FC = () => {
    const navigate = useNavigate();
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleCheck = async () => {
        if (!resumeText.trim() || !jobDescription.trim()) { setError('Please provide both resume and job description.'); return; }
        setLoading(true); setError(''); setResult(null);
        try {
            const resp = await fetch(`${AI_SERVICE_URL}/api/tools/ats-check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription }),
            });
            if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
            setResult(await resp.json());
        } catch (e: any) { setError(e.message || 'Something went wrong'); }
        finally { setLoading(false); }
    };

    const scoreColor = (s: number) => s >= 75 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)', py: 4, px: 3 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                        <IconButton onClick={() => navigate('/tools')} sx={{ color: 'white' }}><ArrowBack /></IconButton>
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                            🎯 ATS Resume Checker
                        </Typography>
                    </Box>

                    {/* Input Section */}
                    {!result && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
                                <Typography sx={{ color: '#818cf8', fontWeight: 600, mb: 2 }}>📄 Resume Content</Typography>
                                <TextField multiline rows={14} fullWidth placeholder="Paste your resume text here..."
                                    value={resumeText} onChange={e => setResumeText(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white', bgcolor: 'rgba(0,0,0,0.3)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#818cf8' }
                                        }
                                    }} />
                            </Paper>
                            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
                                <Typography sx={{ color: '#818cf8', fontWeight: 600, mb: 2 }}>💼 Job Description</Typography>
                                <TextField multiline rows={14} fullWidth placeholder="Paste the job description here..."
                                    value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white', bgcolor: 'rgba(0,0,0,0.3)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#818cf8' }
                                        }
                                    }} />
                            </Paper>
                        </Box>
                    )}

                    {error && <Typography sx={{ color: '#ef4444', mb: 2, textAlign: 'center' }}>{error}</Typography>}

                    {!result && (
                        <Box sx={{ textAlign: 'center' }}>
                            <Button variant="contained" size="large" onClick={handleCheck} disabled={loading}
                                startIcon={loading ? undefined : <CloudUpload />}
                                sx={{
                                    px: 5, py: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                                    fontWeight: 600, fontSize: '1rem', '&:hover': { background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }
                                }}>
                                {loading ? 'Analyzing...' : 'Check ATS Score'}
                            </Button>
                            {loading && <LinearProgress sx={{
                                mt: 2, maxWidth: 400, mx: 'auto', borderRadius: 2, bgcolor: 'rgba(129,140,248,0.1)',
                                '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #818cf8, #6366f1)' }
                            }} />}
                        </Box>
                    )}

                    {/* Results */}
                    {result && !result.error && (
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            {/* Score Cards */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
                                <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, textAlign: 'center' }}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, fontSize: '0.85rem' }}>ATS COMPATIBILITY</Typography>
                                    <Typography variant="h2" sx={{ color: scoreColor(result.ats_score), fontWeight: 800 }}>
                                        {result.ats_score}%
                                    </Typography>
                                    <LinearProgress variant="determinate" value={result.ats_score}
                                        sx={{
                                            mt: 2, height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)',
                                            '& .MuiLinearProgress-bar': { bgcolor: scoreColor(result.ats_score), borderRadius: 4 }
                                        }} />
                                </Paper>
                                <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, textAlign: 'center' }}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, fontSize: '0.85rem' }}>KEYWORD MATCH</Typography>
                                    <Typography variant="h2" sx={{ color: scoreColor(result.keyword_match_percent), fontWeight: 800 }}>
                                        {result.keyword_match_percent}%
                                    </Typography>
                                    <LinearProgress variant="determinate" value={result.keyword_match_percent}
                                        sx={{
                                            mt: 2, height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)',
                                            '& .MuiLinearProgress-bar': { bgcolor: scoreColor(result.keyword_match_percent), borderRadius: 4 }
                                        }} />
                                </Paper>
                            </Box>

                            {/* Keywords */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
                                <Paper sx={{ p: 3, bgcolor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 3 }}>
                                    <Typography sx={{ color: '#10b981', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircle fontSize="small" /> Matched Keywords
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {result.matched_keywords?.map((kw: string, i: number) => (
                                            <Chip key={i} label={kw} size="small" sx={{ bgcolor: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }} />
                                        ))}
                                    </Box>
                                </Paper>
                                <Paper sx={{ p: 3, bgcolor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 3 }}>
                                    <Typography sx={{ color: '#ef4444', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Cancel fontSize="small" /> Missing Keywords
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {result.missing_keywords?.map((kw: string, i: number) => (
                                            <Chip key={i} label={kw} size="small" sx={{ bgcolor: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }} />
                                        ))}
                                    </Box>
                                </Paper>
                            </Box>

                            {/* Suggestions */}
                            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, mb: 3 }}>
                                <Typography sx={{ color: '#f59e0b', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Warning fontSize="small" /> Improvement Suggestions
                                </Typography>
                                {result.improvement_suggestions?.map((s: string, i: number) => (
                                    <Typography key={i} sx={{ color: 'rgba(255,255,255,0.75)', mb: 1, pl: 2, borderLeft: '2px solid #f59e0b' }}>
                                        {s}
                                    </Typography>
                                ))}
                            </Paper>

                            {/* Overall Feedback */}
                            <Paper sx={{ p: 3, bgcolor: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.15)', borderRadius: 3, mb: 3 }}>
                                <Typography sx={{ color: '#818cf8', fontWeight: 600, mb: 1 }}>Overall Feedback</Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{result.overall_feedback}</Typography>
                            </Paper>

                            <Box sx={{ textAlign: 'center' }}>
                                <Button variant="outlined" onClick={() => setResult(null)}
                                    sx={{ color: '#818cf8', borderColor: '#818cf8', '&:hover': { borderColor: '#6366f1', bgcolor: 'rgba(129,140,248,0.1)' } }}>
                                    Check Another Resume
                                </Button>
                            </Box>
                        </motion.div>
                    )}
                </Box>
            </motion.div>
        </Box>
    );
};

export default ATSCheckerTool;
