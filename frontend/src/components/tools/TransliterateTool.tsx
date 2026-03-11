import React, { useState } from 'react';
import {
    Box, Container, Typography, TextField, Button, Select, MenuItem,
    FormControl, InputLabel, Paper, IconButton, CircularProgress, Alert,
} from '@mui/material';
import { ArrowBack, ContentCopy, SwapHoriz } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8001';

const LANGUAGES = [
    { code: 'hi-IN', name: 'Hindi (Devanagari)' },
    { code: 'bn-IN', name: 'Bengali' },
    { code: 'gu-IN', name: 'Gujarati' },
    { code: 'kn-IN', name: 'Kannada' },
    { code: 'ml-IN', name: 'Malayalam' },
    { code: 'mr-IN', name: 'Marathi (Devanagari)' },
    { code: 'od-IN', name: 'Odia' },
    { code: 'pa-IN', name: 'Punjabi (Gurmukhi)' },
    { code: 'ta-IN', name: 'Tamil' },
    { code: 'te-IN', name: 'Telugu' },
    { code: 'en-IN', name: 'English (Roman)' },
    { code: 'ur-IN', name: 'Urdu (Nastaliq)' },
    { code: 'sa-IN', name: 'Sanskrit (Devanagari)' },
];

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
        '&:hover fieldset': { borderColor: 'rgba(245,158,11,0.5)' },
        '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
};

const selectSx = {
    color: 'white', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '14px',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(245,158,11,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' },
};

const TransliterateTool: React.FC = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [sourceLang, setSourceLang] = useState('hi-IN');
    const [targetLang, setTargetLang] = useState('en-IN');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSwap = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setInput(output);
        setOutput(input);
    };

    const handleTransliterate = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setError('');
        try {
            const resp = await fetch(`${AI_SERVICE_URL}/api/tools/transliterate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: input.trim(),
                    source_language_code: sourceLang,
                    target_language_code: targetLang,
                    spoken_form: true,
                }),
            });
            if (!resp.ok) {
                const err = await resp.json().catch(() => ({ detail: 'Transliteration failed' }));
                throw new Error(err.detail || 'Transliteration failed');
            }
            const data = await resp.json();
            setOutput(data.transliterated_text || data.output || JSON.stringify(data));
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
                                Transliterator
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                Convert text between different scripts while preserving the language
                            </Typography>
                        </Box>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>{error}</Alert>}

                    {/* Script selectors */}
                    <Paper sx={{ ...glassCard, mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <FormControl sx={{ flex: 1, minWidth: 160 }}>
                            <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Source Script</InputLabel>
                            <Select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} label="Source Script" sx={selectSx}>
                                {LANGUAGES.map((l) => <MenuItem key={l.code} value={l.code}>{l.name}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <IconButton onClick={handleSwap} sx={{ color: 'white', bgcolor: 'rgba(245,158,11,0.15)', '&:hover': { bgcolor: 'rgba(245,158,11,0.3)' } }}>
                            <SwapHoriz />
                        </IconButton>

                        <FormControl sx={{ flex: 1, minWidth: 160 }}>
                            <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Target Script</InputLabel>
                            <Select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} label="Target Script" sx={selectSx}>
                                {LANGUAGES.map((l) => <MenuItem key={l.code} value={l.code}>{l.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Paper>

                    {/* Input / Output */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        <Paper sx={glassCard}>
                            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, fontWeight: 700 }}>INPUT</Typography>
                            <TextField
                                fullWidth multiline rows={8} placeholder="Enter text to transliterate..."
                                value={input} onChange={(e) => setInput(e.target.value)} sx={inputSx}
                            />
                            <Button
                                fullWidth variant="contained" onClick={handleTransliterate}
                                disabled={loading || !input.trim()}
                                sx={{
                                    mt: 2, py: 1.5, borderRadius: '14px', fontWeight: 700,
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    '&:hover': { background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' },
                                    '&.Mui-disabled': { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' },
                                }}
                            >
                                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Transliterate'}
                            </Button>
                        </Paper>

                        <Paper sx={glassCard}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>OUTPUT</Typography>
                                {output && (
                                    <IconButton size="small" onClick={() => navigator.clipboard.writeText(output)} sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                        <ContentCopy fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                            <TextField
                                fullWidth multiline rows={8} placeholder="Transliterated text will appear here..."
                                value={output} InputProps={{ readOnly: true }} sx={inputSx}
                            />
                        </Paper>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default TransliterateTool;
