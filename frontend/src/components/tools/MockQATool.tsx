import { AI_SERVICE_URL } from '../../utils/config';
import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, LinearProgress, IconButton, Select, MenuItem, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ArrowBack, QuestionAnswer, ExpandMore, Lightbulb, ContentCopy } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// AI_SERVICE_URL imported from config

const MockQATool: React.FC = () => {
    const navigate = useNavigate();
    const [jobRole, setJobRole] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [count, setCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const handleGenerate = async () => {
        if (!jobRole.trim()) { setError('Please enter a job role.'); return; }
        setLoading(true); setError(''); setResult(null);
        try {
            const resp = await fetch(`${AI_SERVICE_URL}/api/tools/generate-qa`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ job_role: jobRole, difficulty, count }),
            });
            if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
            setResult(await resp.json());
        } catch (e: any) { setError(e.message || 'Something went wrong'); }
        finally { setLoading(false); }
    };

    const copyAnswer = (text: string, id: number) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const categoryColor: Record<string, string> = {
        behavioral: '#818cf8', technical: '#3b82f6', situational: '#f59e0b', leadership: '#10b981',
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a0a 50%, #0a0a0a 100%)', py: 4, px: 3 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                        <IconButton onClick={() => navigate('/tools')} sx={{ color: 'white' }}><ArrowBack /></IconButton>
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>💬 Mock Q&A Generator</Typography>
                    </Box>

                    {!result && (
                        <>
                            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, mb: 3 }}>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 2 }}>
                                    <Box>
                                        <Typography sx={{ color: '#f59e0b', fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>Job Role</Typography>
                                        <TextField fullWidth placeholder="e.g. Software Engineer"
                                            value={jobRole} onChange={e => setJobRole(e.target.value)}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: 'white', bgcolor: 'rgba(0,0,0,0.3)',
                                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#f59e0b' }
                                                }
                                            }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: '#f59e0b', fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>Difficulty</Typography>
                                        <Select fullWidth value={difficulty} onChange={e => setDifficulty(e.target.value)}
                                            sx={{
                                                color: 'white', bgcolor: 'rgba(0,0,0,0.3)', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                                '& .MuiSvgIcon-root': { color: 'white' }
                                            }}>
                                            <MenuItem value="easy">Easy</MenuItem>
                                            <MenuItem value="medium">Medium</MenuItem>
                                            <MenuItem value="hard">Hard</MenuItem>
                                        </Select>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: '#f59e0b', fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>Questions</Typography>
                                        <Select fullWidth value={count} onChange={e => setCount(Number(e.target.value))}
                                            sx={{
                                                color: 'white', bgcolor: 'rgba(0,0,0,0.3)', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                                '& .MuiSvgIcon-root': { color: 'white' }
                                            }}>
                                            {[3, 5, 7, 10].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                                        </Select>
                                    </Box>
                                </Box>
                            </Paper>
                            {error && <Typography sx={{ color: '#ef4444', mb: 2, textAlign: 'center' }}>{error}</Typography>}
                            <Box sx={{ textAlign: 'center' }}>
                                <Button variant="contained" size="large" onClick={handleGenerate} disabled={loading}
                                    startIcon={loading ? undefined : <QuestionAnswer />}
                                    sx={{
                                        px: 5, py: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                        fontWeight: 600, fontSize: '1rem', color: '#000', '&:hover': { background: 'linear-gradient(135deg, #d97706, #b45309)' }
                                    }}>
                                    {loading ? 'Generating...' : 'Generate Questions'}
                                </Button>
                                {loading && <LinearProgress sx={{
                                    mt: 2, maxWidth: 400, mx: 'auto', borderRadius: 2, bgcolor: 'rgba(245,158,11,0.1)',
                                    '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #f59e0b, #d97706)' }
                                }} />}
                            </Box>
                        </>
                    )}

                    {result?.questions && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 3, textAlign: 'center' }}>
                                {result.questions.length} questions for <strong style={{ color: '#f59e0b' }}>{result.job_role}</strong> — {result.difficulty} difficulty
                            </Typography>

                            {result.questions.map((q: any, i: number) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <Accordion sx={{
                                        mb: 2, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '12px !important', '&:before': { display: 'none' },
                                        '&.Mui-expanded': { bgcolor: 'rgba(255,255,255,0.06)' }
                                    }}>
                                        <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                                            sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 2 } }}>
                                            <Chip label={`Q${q.id || i + 1}`} size="small"
                                                sx={{ bgcolor: 'rgba(245,158,11,0.2)', color: '#f59e0b', fontWeight: 700, minWidth: 40 }} />
                                            <Chip label={q.category} size="small"
                                                sx={{ bgcolor: `${categoryColor[q.category] || '#818cf8'}20`, color: categoryColor[q.category] || '#818cf8' }} />
                                            <Typography sx={{ color: 'white', fontWeight: 500, flex: 1 }}>{q.question}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ pt: 0 }}>
                                            <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2, mb: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>✅ Model Answer</Typography>
                                                    <IconButton size="small" onClick={() => copyAnswer(q.model_answer, q.id || i)}
                                                        sx={{ color: copiedId === (q.id || i) ? '#10b981' : 'rgba(255,255,255,0.4)' }}>
                                                        <ContentCopy fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                                                    {q.model_answer}
                                                </Typography>
                                            </Box>
                                            {q.key_points?.length > 0 && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography sx={{ color: '#818cf8', fontWeight: 600, fontSize: '0.8rem', mb: 1 }}>Key Points</Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                        {q.key_points.map((kp: string, j: number) => (
                                                            <Chip key={j} label={kp} size="small"
                                                                sx={{ bgcolor: 'rgba(129,140,248,0.1)', color: '#a5b4fc', fontSize: '0.75rem' }} />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}
                                            {q.tip && (
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, p: 1.5, bgcolor: 'rgba(245,158,11,0.05)', borderRadius: 2, border: '1px solid rgba(245,158,11,0.15)' }}>
                                                    <Lightbulb sx={{ color: '#f59e0b', fontSize: 18, mt: 0.2 }} />
                                                    <Typography sx={{ color: '#fbbf24', fontSize: '0.8rem' }}>{q.tip}</Typography>
                                                </Box>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                </motion.div>
                            ))}

                            <Box sx={{ textAlign: 'center', mt: 3 }}>
                                <Button variant="outlined" onClick={() => setResult(null)}
                                    sx={{ color: '#f59e0b', borderColor: '#f59e0b', '&:hover': { borderColor: '#d97706', bgcolor: 'rgba(245,158,11,0.1)' } }}>
                                    Generate New Questions
                                </Button>
                            </Box>
                        </motion.div>
                    )}
                </Box>
            </motion.div>
        </Box>
    );
};

export default MockQATool;
