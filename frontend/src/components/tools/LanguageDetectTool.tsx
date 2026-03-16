import { AI_SERVICE_URL } from '../../utils/config';
import React, { useState } from 'react';
import {
    Box, Container, Typography, TextField, Button, Paper, IconButton,
    CircularProgress, Alert, Chip, LinearProgress,
} from '@mui/material';
import { ArrowBack, ContentCopy } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// AI_SERVICE_URL imported from config

const LANGUAGE_NAMES: Record<string, string> = {
    'hi-IN': 'Hindi', 'bn-IN': 'Bengali', 'gu-IN': 'Gujarati', 'kn-IN': 'Kannada',
    'ml-IN': 'Malayalam', 'mr-IN': 'Marathi', 'od-IN': 'Odia', 'pa-IN': 'Punjabi',
    'ta-IN': 'Tamil', 'te-IN': 'Telugu', 'en-IN': 'English', 'as-IN': 'Assamese',
    'doi-IN': 'Dogri', 'kok-IN': 'Konkani', 'mai-IN': 'Maithili', 'mni-IN': 'Manipuri',
    'ne-IN': 'Nepali', 'sa-IN': 'Sanskrit', 'sd-IN': 'Sindhi', 'ur-IN': 'Urdu',
    'brx-IN': 'Bodo', 'ks-IN': 'Kashmiri', 'sat-IN': 'Santali',
};

const glassCard = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    backdropFilter: 'blur(20px)',
    p: 4,
};

const inputSx = {
    '& .MuiOutlinedInput-root': {
        color: 'white', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '14px',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
        '&:hover fieldset': { borderColor: 'rgba(236,72,153,0.5)' },
        '&.Mui-focused fieldset': { borderColor: '#ec4899' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
};

interface DetectionResult {
    language_code: string;
    language_name: string;
    confidence: number;
    script?: string;
}

const LanguageDetectTool: React.FC = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState<DetectionResult[]>([]);
    const [topResult, setTopResult] = useState<DetectionResult | null>(null);

    const handleDetect = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setError('');
        setResults([]);
        setTopResult(null);
        try {
            const resp = await fetch(`${AI_SERVICE_URL}/api/tools/detect-language`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: input.trim() }),
            });
            if (!resp.ok) {
                const err = await resp.json().catch(() => ({ detail: 'Detection failed' }));
                throw new Error(err.detail || 'Detection failed');
            }
            const data = await resp.json();

            // Parse the response — Sarvam may return different formats
            if (data.language_code) {
                const langCode = data.language_code;
                const result: DetectionResult = {
                    language_code: langCode,
                    language_name: LANGUAGE_NAMES[langCode] || langCode,
                    confidence: data.confidence || 0.95,
                    script: data.script,
                };
                setTopResult(result);
            }

            if (data.langauage_probabilities || data.language_probabilities) {
                const probs = data.language_probabilities || data.langauage_probabilities;
                const parsed: DetectionResult[] = Object.entries(probs)
                    .map(([code, conf]) => ({
                        language_code: code,
                        language_name: LANGUAGE_NAMES[code] || code,
                        confidence: conf as number,
                    }))
                    .sort((a, b) => b.confidence - a.confidence)
                    .slice(0, 6);
                setResults(parsed);
                if (!topResult && parsed.length > 0) {
                    setTopResult(parsed[0]);
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', background: '#050505', pt: 4 }}>
            <Container maxWidth="md">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, pt: 3 }}>
                        <IconButton onClick={() => navigate('/tools')} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.06)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                            <ArrowBack />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                                Language Detector
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                Auto-detect the language of any text
                            </Typography>
                        </Box>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>{error}</Alert>}

                    {/* Input */}
                    <Paper sx={{ ...glassCard, mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, fontWeight: 700 }}>
                            PASTE YOUR TEXT
                        </Typography>
                        <TextField
                            fullWidth multiline rows={6}
                            placeholder="Paste or type text in any language to detect..."
                            value={input} onChange={(e) => setInput(e.target.value)} sx={inputSx}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                                {input.length} characters
                            </Typography>
                            <Button
                                variant="contained" onClick={handleDetect}
                                disabled={loading || !input.trim()}
                                sx={{
                                    px: 4, py: 1.5, borderRadius: '14px', fontWeight: 700,
                                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                                    '&:hover': { background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)' },
                                    '&.Mui-disabled': { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' },
                                }}
                            >
                                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '🔍 Detect Language'}
                            </Button>
                        </Box>
                    </Paper>

                    {/* Top Result */}
                    {topResult && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                            <Paper sx={{
                                ...glassCard, mb: 3, textAlign: 'center',
                                border: '1px solid rgba(236,72,153,0.2)',
                                background: 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(219,39,119,0.04) 100%)',
                            }}>
                                <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}>
                                    Detected Language
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', mt: 1, mb: 1 }}>
                                    {topResult.language_name}
                                </Typography>
                                <Chip
                                    label={`${topResult.language_code} • ${(topResult.confidence * 100).toFixed(1)}% confidence`}
                                    sx={{ bgcolor: 'rgba(236,72,153,0.2)', color: '#f9a8d4', fontWeight: 600 }}
                                />
                            </Paper>
                        </motion.div>
                    )}

                    {/* Confidence Breakdown */}
                    {results.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Paper sx={glassCard}>
                                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3, fontWeight: 700 }}>
                                    CONFIDENCE BREAKDOWN
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {results.map((r) => (
                                        <Box key={r.language_code}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{r.language_name}</Typography>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>{(r.confidence * 100).toFixed(1)}%</Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate" value={r.confidence * 100}
                                                sx={{
                                                    height: 8, borderRadius: 4,
                                                    bgcolor: 'rgba(255,255,255,0.06)',
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 4,
                                                        background: `linear-gradient(90deg, #ec4899 0%, #db2777 ${r.confidence * 100}%)`,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        </motion.div>
                    )}
                </motion.div>
            </Container>
        </Box>
    );
};

export default LanguageDetectTool;
