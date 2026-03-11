import React, { useState, useRef } from 'react';
import {
    Box, Container, Typography, TextField, Button, Select, MenuItem,
    FormControl, InputLabel, Paper, IconButton, CircularProgress, Alert, Slider,
} from '@mui/material';
import { ArrowBack, PlayArrow, Download, Stop } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8001';

const TTS_LANGUAGES = [
    { code: 'hi-IN', name: 'Hindi' }, { code: 'bn-IN', name: 'Bengali' },
    { code: 'gu-IN', name: 'Gujarati' }, { code: 'kn-IN', name: 'Kannada' },
    { code: 'ml-IN', name: 'Malayalam' }, { code: 'mr-IN', name: 'Marathi' },
    { code: 'od-IN', name: 'Odia' }, { code: 'pa-IN', name: 'Punjabi' },
    { code: 'ta-IN', name: 'Tamil' }, { code: 'te-IN', name: 'Telugu' },
    { code: 'en-IN', name: 'English' },
];

const SPEAKERS = [
    { id: 'shubh', name: 'Shubh (Male)' },
    { id: 'arvind', name: 'Arvind (Male)' },
    { id: 'amartya', name: 'Amartya (Male)' },
    { id: 'anushka', name: 'Anushka (Female)' },
    { id: 'suhani', name: 'Suhani (Female)' },
    { id: 'diya', name: 'Diya (Female)' },
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
        '&:hover fieldset': { borderColor: 'rgba(59,130,246,0.5)' },
        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
};

const selectSx = {
    color: 'white', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '14px',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(59,130,246,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' },
};

const TextToSpeechTool: React.FC = () => {
    const navigate = useNavigate();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [text, setText] = useState('');
    const [language, setLanguage] = useState('hi-IN');
    const [speaker, setSpeaker] = useState('shubh');
    const [pace, setPace] = useState(1.0);
    const [pitch, setPitch] = useState(0.0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [audioSrc, setAudioSrc] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    const handleGenerate = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setError('');
        setAudioSrc('');
        try {
            const resp = await fetch(`${AI_SERVICE_URL}/api/tools/tts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inputs: [text.trim()],
                    target_language_code: language,
                    speaker,
                    model: 'bulbul:v3',
                    pace,
                    enable_preprocessing: true,
                }),
            });
            if (!resp.ok) {
                const err = await resp.json().catch(() => ({ detail: 'TTS failed' }));
                throw new Error(err.detail || 'TTS failed');
            }
            const data = await resp.json();
            // Sarvam returns base64 wav audio in audios array
            const audioBase64 = data.audios?.[0] || data.audio;
            if (audioBase64) {
                setAudioSrc(`data:audio/wav;base64,${audioBase64}`);
            } else {
                throw new Error('No audio returned');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleDownload = () => {
        if (!audioSrc) return;
        const a = document.createElement('a');
        a.href = audioSrc;
        a.download = 'sarvam-tts-output.wav';
        a.click();
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
                                Text to Speech
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                Convert text to natural speech in 10+ Indian languages
                            </Typography>
                        </Box>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>{error}</Alert>}

                    {/* Settings Row */}
                    <Paper sx={{ ...glassCard, mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <FormControl sx={{ flex: 1, minWidth: 140 }}>
                            <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Language</InputLabel>
                            <Select value={language} onChange={(e) => setLanguage(e.target.value)} label="Language" sx={selectSx}>
                                {TTS_LANGUAGES.map((l) => <MenuItem key={l.code} value={l.code}>{l.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ flex: 1, minWidth: 160 }}>
                            <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Voice</InputLabel>
                            <Select value={speaker} onChange={(e) => setSpeaker(e.target.value)} label="Voice" sx={selectSx}>
                                {SPEAKERS.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <Box sx={{ flex: 1, minWidth: 120 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mb: 0.5, display: 'block' }}>
                                Pace: {pace.toFixed(1)}x
                            </Typography>
                            <Slider value={pace} onChange={(_, v) => setPace(v as number)} min={0.5} max={2.0} step={0.1}
                                sx={{ color: '#3b82f6', '& .MuiSlider-thumb': { bgcolor: 'white' } }}
                            />
                        </Box>
                    </Paper>

                    {/* Text Input */}
                    <Paper sx={{ ...glassCard, mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, fontWeight: 700 }}>
                            TEXT TO SPEAK
                        </Typography>
                        <TextField
                            fullWidth multiline rows={6} placeholder="Enter text to convert to speech..."
                            value={text} onChange={(e) => setText(e.target.value)} sx={inputSx}
                        />
                        <Button
                            fullWidth variant="contained" onClick={handleGenerate}
                            disabled={loading || !text.trim()}
                            sx={{
                                mt: 2, py: 1.5, borderRadius: '14px', fontWeight: 700,
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                '&:hover': { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' },
                                '&.Mui-disabled': { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' },
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '🔊 Generate Speech'}
                        </Button>
                    </Paper>

                    {/* Audio Player */}
                    {audioSrc && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Paper sx={{ ...glassCard, display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center' }}>
                                <audio
                                    ref={audioRef} src={audioSrc}
                                    onEnded={() => setIsPlaying(false)}
                                    onPause={() => setIsPlaying(false)}
                                    onPlay={() => setIsPlaying(true)}
                                />
                                <IconButton onClick={togglePlay} sx={{
                                    width: 64, height: 64,
                                    bgcolor: 'rgba(59,130,246,0.2)', color: '#3b82f6',
                                    '&:hover': { bgcolor: 'rgba(59,130,246,0.3)' },
                                }}>
                                    {isPlaying ? <Stop sx={{ fontSize: 32 }} /> : <PlayArrow sx={{ fontSize: 32 }} />}
                                </IconButton>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>Audio Ready</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                        Click play to listen or download the file
                                    </Typography>
                                </Box>
                                <IconButton onClick={handleDownload} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'white' } }}>
                                    <Download />
                                </IconButton>
                            </Paper>
                        </motion.div>
                    )}
                </motion.div>
            </Container>
        </Box>
    );
};

export default TextToSpeechTool;
