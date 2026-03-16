import { AI_SERVICE_URL } from '../../utils/config';
import React, { useState } from 'react';
import {
    Box, Container, Typography, TextField, Button, Select, MenuItem,
    FormControl, InputLabel, Paper, IconButton, CircularProgress, Alert,
} from '@mui/material';
import { ContentCopy, SwapHoriz, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// AI_SERVICE_URL imported from config

const LANGUAGES = [
    { code: 'hi-IN', name: 'Hindi' }, { code: 'bn-IN', name: 'Bengali' },
    { code: 'gu-IN', name: 'Gujarati' }, { code: 'kn-IN', name: 'Kannada' },
    { code: 'ml-IN', name: 'Malayalam' }, { code: 'mr-IN', name: 'Marathi' },
    { code: 'od-IN', name: 'Odia' }, { code: 'pa-IN', name: 'Punjabi' },
    { code: 'ta-IN', name: 'Tamil' }, { code: 'te-IN', name: 'Telugu' },
    { code: 'en-IN', name: 'English' }, { code: 'as-IN', name: 'Assamese' },
    { code: 'doi-IN', name: 'Dogri' }, { code: 'kok-IN', name: 'Konkani' },
    { code: 'mai-IN', name: 'Maithili' }, { code: 'mni-IN', name: 'Manipuri' },
    { code: 'ne-IN', name: 'Nepali' }, { code: 'sa-IN', name: 'Sanskrit' },
    { code: 'sd-IN', name: 'Sindhi' }, { code: 'ur-IN', name: 'Urdu' },
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
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: '14px',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
        '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.5)' },
        '&.Mui-focused fieldset': { borderColor: '#818cf8' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' },
};

const selectSx = {
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '14px',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#818cf8' },
    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' },
};

const TranslateTool: React.FC = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [sourceLang, setSourceLang] = useState('en-IN');
    const [targetLang, setTargetLang] = useState('hi-IN');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSwap = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setInput(output);
        setOutput(input);
    };

    const handleTranslate = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setError('');
        try {
            const resp = await fetch(`${AI_SERVICE_URL}/api/tools/translate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: input.trim(),
                    source_language_code: sourceLang,
                    target_language_code: targetLang,
                }),
            });
            if (!resp.ok) {
                const err = await resp.json().catch(() => ({ detail: 'Translation failed' }));
                throw new Error(err.detail || 'Translation failed');
            }
            const data = await resp.json();
            setOutput(data.translated_text || data.output || JSON.stringify(data));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
    };

    return (
        <Box sx={{ minHeight: '100vh', background: '#050505', pt: 4 }}>
            <Container maxWidth="md">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, pt: 3 }}>
                        <IconButton onClick={() => navigate('/tools')} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.06)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                            <ArrowBack />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                                Text Translator
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                Translate between 22+ Indian languages & English
                            </Typography>
                        </Box>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>{error}</Alert>}

                    {/* Language Bar */}
                    <Paper sx={{ ...glassCard, mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <FormControl sx={{ flex: 1, minWidth: 160 }}>
                            <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Source</InputLabel>
                            <Select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} label="Source" sx={selectSx}>
                                {LANGUAGES.map((l) => <MenuItem key={l.code} value={l.code}>{l.name}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <IconButton onClick={handleSwap} sx={{ color: 'white', bgcolor: 'rgba(99,102,241,0.15)', '&:hover': { bgcolor: 'rgba(99,102,241,0.3)' } }}>
                            <SwapHoriz />
                        </IconButton>

                        <FormControl sx={{ flex: 1, minWidth: 160 }}>
                            <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Target</InputLabel>
                            <Select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} label="Target" sx={selectSx}>
                                {LANGUAGES.map((l) => <MenuItem key={l.code} value={l.code}>{l.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Paper>

                    {/* Input / Output */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        <Paper sx={glassCard}>
                            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, fontWeight: 700 }}>INPUT</Typography>
                            <TextField
                                fullWidth multiline rows={8} placeholder="Type or paste text here..."
                                value={input} onChange={(e) => setInput(e.target.value)}
                                sx={inputSx}
                            />
                            <Button
                                fullWidth variant="contained" onClick={handleTranslate}
                                disabled={loading || !input.trim()}
                                sx={{
                                    mt: 2, py: 1.5, borderRadius: '14px', fontWeight: 700,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' },
                                    '&.Mui-disabled': { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' },
                                }}
                            >
                                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Translate'}
                            </Button>
                        </Paper>

                        <Paper sx={glassCard}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>OUTPUT</Typography>
                                {output && (
                                    <IconButton size="small" onClick={copyToClipboard} sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                        <ContentCopy fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                            <TextField
                                fullWidth multiline rows={8} placeholder="Translation will appear here..."
                                value={output} InputProps={{ readOnly: true }}
                                sx={inputSx}
                            />
                        </Paper>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default TranslateTool;
