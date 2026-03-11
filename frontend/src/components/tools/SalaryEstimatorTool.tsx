import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, LinearProgress, IconButton, Chip, Slider } from '@mui/material';
import { ArrowBack, TrendingUp, AttachMoney, Lightbulb, WorkOutline } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8001';

const SalaryEstimatorTool: React.FC = () => {
    const navigate = useNavigate();
    const [jobRole, setJobRole] = useState('');
    const [experience, setExperience] = useState(2);
    const [location, setLocation] = useState('India');
    const [skills, setSkills] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleEstimate = async () => {
        if (!jobRole.trim()) { setError('Please enter a job role.'); return; }
        setLoading(true); setError(''); setResult(null);
        try {
            const skillList = skills.trim() ? skills.split(',').map(s => s.trim()).filter(Boolean) : null;
            const resp = await fetch(`${AI_SERVICE_URL}/api/tools/estimate-salary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ job_role: jobRole, experience_years: experience, location, skills: skillList }),
            });
            if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
            setResult(await resp.json());
        } catch (e: any) { setError(e.message || 'Something went wrong'); }
        finally { setLoading(false); }
    };

    const demandColor: Record<string, string> = { high: '#10b981', medium: '#f59e0b', low: '#ef4444' };

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #0a2a1a 50%, #0a0a0a 100%)', py: 4, px: 3 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                        <IconButton onClick={() => navigate('/tools')} sx={{ color: 'white' }}><ArrowBack /></IconButton>
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>💰 Salary Estimator</Typography>
                    </Box>

                    {!result && (
                        <>
                            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, mb: 3 }}>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                                    <Box>
                                        <Typography sx={{ color: '#10b981', fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>Job Role *</Typography>
                                        <TextField fullWidth placeholder="e.g. Full Stack Developer"
                                            value={jobRole} onChange={e => setJobRole(e.target.value)}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: 'white', bgcolor: 'rgba(0,0,0,0.3)',
                                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#10b981' }
                                                }
                                            }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: '#10b981', fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>Location</Typography>
                                        <TextField fullWidth placeholder="e.g. Bangalore, India"
                                            value={location} onChange={e => setLocation(e.target.value)}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: 'white', bgcolor: 'rgba(0,0,0,0.3)',
                                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#10b981' }
                                                }
                                            }} />
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 3 }}>
                                    <Typography sx={{ color: '#10b981', fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>
                                        Experience: {experience} year{experience !== 1 ? 's' : ''}
                                    </Typography>
                                    <Slider value={experience} onChange={(_, v) => setExperience(v as number)} min={0} max={30} step={1}
                                        marks={[{ value: 0, label: '0' }, { value: 5, label: '5' }, { value: 10, label: '10' }, { value: 20, label: '20' }, { value: 30, label: '30' }]}
                                        sx={{ color: '#10b981', '& .MuiSlider-markLabel': { color: 'rgba(255,255,255,0.4)' } }} />
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Typography sx={{ color: '#10b981', fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>Skills (comma-separated, optional)</Typography>
                                    <TextField fullWidth placeholder="e.g. React, Node.js, AWS, Python..."
                                        value={skills} onChange={e => setSkills(e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white', bgcolor: 'rgba(0,0,0,0.3)',
                                                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#10b981' }
                                            }
                                        }} />
                                </Box>
                            </Paper>
                            {error && <Typography sx={{ color: '#ef4444', mb: 2, textAlign: 'center' }}>{error}</Typography>}
                            <Box sx={{ textAlign: 'center' }}>
                                <Button variant="contained" size="large" onClick={handleEstimate} disabled={loading}
                                    startIcon={loading ? undefined : <AttachMoney />}
                                    sx={{
                                        px: 5, py: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #10b981, #059669)',
                                        fontWeight: 600, fontSize: '1rem', '&:hover': { background: 'linear-gradient(135deg, #059669, #047857)' }
                                    }}>
                                    {loading ? 'Estimating...' : 'Estimate Salary'}
                                </Button>
                                {loading && <LinearProgress sx={{
                                    mt: 2, maxWidth: 400, mx: 'auto', borderRadius: 2, bgcolor: 'rgba(16,185,129,0.1)',
                                    '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #10b981, #059669)' }
                                }} />}
                            </Box>
                        </>
                    )}

                    {result && !result.error && (
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            {/* Salary Range */}
                            <Paper sx={{ p: 4, bgcolor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 3, mb: 4, textAlign: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                                    <WorkOutline sx={{ color: '#10b981' }} />
                                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                        {result.job_role} · {result.location} · {result.experience_years} yrs
                                    </Typography>
                                </Box>
                                <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 800, mb: 2 }}>
                                    {result.formatted_range}
                                </Typography>
                                {result.salary_range && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 2 }}>
                                        {['min', 'mid', 'max'].map(tier => (
                                            <Box key={tier} sx={{ textAlign: 'center' }}>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase' }}>{tier}</Typography>
                                                <Typography sx={{ color: 'white', fontWeight: 600 }}>
                                                    {result.currency === 'INR' ? '₹' : '$'}{(result.salary_range[tier] || 0).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                                <Chip label={`Market Demand: ${result.market_demand || 'N/A'}`}
                                    sx={{
                                        bgcolor: `${demandColor[result.market_demand] || '#818cf8'}20`,
                                        color: demandColor[result.market_demand] || '#818cf8', fontWeight: 600
                                    }} />
                            </Paper>

                            {/* Factors */}
                            {result.factors?.length > 0 && (
                                <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, mb: 3 }}>
                                    <Typography sx={{ color: '#10b981', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TrendingUp fontSize="small" /> Salary Factors
                                    </Typography>
                                    {result.factors.map((f: any, i: number) => (
                                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, p: 1.5, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
                                            <Chip label={f.impact === 'positive' ? '↑' : '↓'} size="small"
                                                sx={{
                                                    bgcolor: f.impact === 'positive' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                                                    color: f.impact === 'positive' ? '#10b981' : '#ef4444', fontWeight: 700, minWidth: 36
                                                }} />
                                            <Box>
                                                <Typography sx={{ color: 'white', fontWeight: 500, fontSize: '0.9rem' }}>{f.factor}</Typography>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{f.explanation}</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Paper>
                            )}

                            {/* Growth + Tips */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                                {result.growth_outlook && (
                                    <Paper sx={{ p: 3, bgcolor: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.15)', borderRadius: 3 }}>
                                        <Typography sx={{ color: '#818cf8', fontWeight: 600, mb: 1 }}>📈 Growth Outlook</Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.7 }}>{result.growth_outlook}</Typography>
                                    </Paper>
                                )}
                                {result.negotiation_tips?.length > 0 && (
                                    <Paper sx={{ p: 3, bgcolor: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 3 }}>
                                        <Typography sx={{ color: '#f59e0b', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Lightbulb fontSize="small" /> Negotiation Tips
                                        </Typography>
                                        {result.negotiation_tips.map((tip: string, i: number) => (
                                            <Typography key={i} sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', mb: 1, pl: 2, borderLeft: '2px solid #f59e0b' }}>
                                                {tip}
                                            </Typography>
                                        ))}
                                    </Paper>
                                )}
                            </Box>

                            <Box sx={{ textAlign: 'center' }}>
                                <Button variant="outlined" onClick={() => setResult(null)}
                                    sx={{ color: '#10b981', borderColor: '#10b981', '&:hover': { borderColor: '#059669', bgcolor: 'rgba(16,185,129,0.1)' } }}>
                                    Estimate Another Role
                                </Button>
                            </Box>
                        </motion.div>
                    )}
                </Box>
            </motion.div>
        </Box>
    );
};

export default SalaryEstimatorTool;
