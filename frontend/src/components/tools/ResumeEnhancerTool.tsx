import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, LinearProgress, IconButton, Chip } from '@mui/material';
import { ArrowBack, AutoFixHigh, ContentCopy, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8001';

const ResumeEnhancerTool: React.FC = () => {
    const navigate = useNavigate();
    const [resumeText, setResumeText] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleEnhance = async () => {
        if (!resumeText.trim()) { setError('Please paste your resume content.'); return; }
        setLoading(true); setError(''); setResult(null);
        try {
            const resp = await fetch(`${AI_SERVICE_URL}/api/tools/enhance-resume`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resume_text: resumeText, target_role: targetRole || null }),
            });
            if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
            setResult(await resp.json());
        } catch (e: any) { setError(e.message || 'Something went wrong'); }
        finally { setLoading(false); }
    };

    const copyEnhanced = () => {
        if (result?.enhanced_resume) {
            navigator.clipboard.writeText(result.enhanced_resume);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #0a1a2e 50%, #0a0a0a 100%)', py: 4, px: 3 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                        <IconButton onClick={() => navigate('/tools')} sx={{ color: 'white' }}><ArrowBack /></IconButton>
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>✨ Resume Enhancer</Typography>
                    </Box>

                    {!result && (
                        <>
                            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, mb: 3 }}>
                                <Typography sx={{ color: '#3b82f6', fontWeight: 600, mb: 2 }}>🎯 Target Role (optional)</Typography>
                                <TextField fullWidth placeholder="e.g. Software Engineer, Product Manager..."
                                    value={targetRole} onChange={e => setTargetRole(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white', bgcolor: 'rgba(0,0,0,0.3)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#3b82f6' }
                                        }
                                    }} />
                            </Paper>
                            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, mb: 3 }}>
                                <Typography sx={{ color: '#3b82f6', fontWeight: 600, mb: 2 }}>📄 Your Resume Content</Typography>
                                <TextField multiline rows={16} fullWidth placeholder="Paste your entire resume text here..."
                                    value={resumeText} onChange={e => setResumeText(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white', bgcolor: 'rgba(0,0,0,0.3)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#3b82f6' }
                                        }
                                    }} />
                            </Paper>
                            {error && <Typography sx={{ color: '#ef4444', mb: 2, textAlign: 'center' }}>{error}</Typography>}
                            <Box sx={{ textAlign: 'center' }}>
                                <Button variant="contained" size="large" onClick={handleEnhance} disabled={loading}
                                    startIcon={loading ? undefined : <AutoFixHigh />}
                                    sx={{
                                        px: 5, py: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                        fontWeight: 600, fontSize: '1rem', '&:hover': { background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }
                                    }}>
                                    {loading ? 'Enhancing...' : 'Enhance Resume'}
                                </Button>
                                {loading && <LinearProgress sx={{
                                    mt: 2, maxWidth: 400, mx: 'auto', borderRadius: 2, bgcolor: 'rgba(59,130,246,0.1)',
                                    '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #3b82f6, #2563eb)' }
                                }} />}
                            </Box>
                        </>
                    )}

                    {result && !result.error && (
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            {/* Score Comparison */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' }, gap: 2, mb: 4, alignItems: 'center' }}>
                                <Paper sx={{ p: 3, bgcolor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 3, textAlign: 'center' }}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>BEFORE</Typography>
                                    <Typography variant="h3" sx={{ color: '#ef4444', fontWeight: 800 }}>{result.strength_score_before || 0}</Typography>
                                </Paper>
                                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                                    <Typography sx={{ color: '#10b981', fontSize: '2rem' }}>→</Typography>
                                </Box>
                                <Paper sx={{ p: 3, bgcolor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 3, textAlign: 'center' }}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>AFTER</Typography>
                                    <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 800 }}>{result.strength_score_after || 0}</Typography>
                                </Paper>
                            </Box>

                            {/* Changes Made */}
                            {result.changes_made?.length > 0 && (
                                <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, mb: 3 }}>
                                    <Typography sx={{ color: '#3b82f6', fontWeight: 600, mb: 2 }}>🔄 Changes Made</Typography>
                                    {result.changes_made.slice(0, 8).map((c: any, i: number) => (
                                        <Box key={i} sx={{ mb: 2, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                                                <ArrowDownward sx={{ color: '#ef4444', fontSize: 18, mt: 0.3 }} />
                                                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textDecoration: 'line-through' }}>{c.original}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                                                <ArrowUpward sx={{ color: '#10b981', fontSize: 18, mt: 0.3 }} />
                                                <Typography sx={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 500 }}>{c.enhanced}</Typography>
                                            </Box>
                                            <Chip label={c.reason} size="small" sx={{ bgcolor: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontSize: '0.7rem' }} />
                                        </Box>
                                    ))}
                                </Paper>
                            )}

                            {/* Enhanced Resume */}
                            <Paper sx={{ p: 3, bgcolor: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 3, mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography sx={{ color: '#10b981', fontWeight: 600 }}>✅ Enhanced Resume</Typography>
                                    <Button size="small" startIcon={<ContentCopy />} onClick={copyEnhanced}
                                        sx={{ color: copied ? '#10b981' : '#60a5fa' }}>
                                        {copied ? 'Copied!' : 'Copy'}
                                    </Button>
                                </Box>
                                <Typography sx={{ color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: 1.8 }}>
                                    {result.enhanced_resume}
                                </Typography>
                            </Paper>

                            <Box sx={{ textAlign: 'center' }}>
                                <Button variant="outlined" onClick={() => setResult(null)}
                                    sx={{ color: '#3b82f6', borderColor: '#3b82f6', '&:hover': { borderColor: '#2563eb', bgcolor: 'rgba(59,130,246,0.1)' } }}>
                                    Enhance Another Resume
                                </Button>
                            </Box>
                        </motion.div>
                    )}
                </Box>
            </motion.div>
        </Box>
    );
};

export default ResumeEnhancerTool;
