import { AI_SERVICE_URL } from '../../utils/config';
import React, { useState, useRef } from 'react';
import {
    Box, Container, Typography, Button, Select, MenuItem,
    FormControl, InputLabel, Paper, IconButton, CircularProgress, Alert, TextField,
} from '@mui/material';
import { ArrowBack, Mic, Stop, UploadFile, ContentCopy } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// AI_SERVICE_URL imported from config

const LANGUAGES = [
    { code: 'hi-IN', name: 'Hindi' }, { code: 'bn-IN', name: 'Bengali' },
    { code: 'gu-IN', name: 'Gujarati' }, { code: 'kn-IN', name: 'Kannada' },
    { code: 'ml-IN', name: 'Malayalam' }, { code: 'mr-IN', name: 'Marathi' },
    { code: 'od-IN', name: 'Odia' }, { code: 'pa-IN', name: 'Punjabi' },
    { code: 'ta-IN', name: 'Tamil' }, { code: 'te-IN', name: 'Telugu' },
    { code: 'en-IN', name: 'English' },
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
        '&:hover fieldset': { borderColor: 'rgba(16,185,129,0.5)' },
        '&.Mui-focused fieldset': { borderColor: '#10b981' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
};

const selectSx = {
    color: 'white', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '14px',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(16,185,129,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#10b981' },
    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' },
};

const SpeechToTextTool: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const [language, setLanguage] = useState('hi-IN');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [transcript, setTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [fileName, setFileName] = useState('');

    const transcribeFile = async (file: File) => {
        setLoading(true);
        setError('');
        setTranscript('');
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('language_code', language);
            formData.append('model', 'saarika:v2.5');

            const resp = await fetch(`${AI_SERVICE_URL}/api/tools/stt`, {
                method: 'POST',
                body: formData,
            });
            if (!resp.ok) {
                const err = await resp.json().catch(() => ({ detail: 'Transcription failed' }));
                throw new Error(err.detail || 'Transcription failed');
            }
            const data = await resp.json();
            setTranscript(data.transcript || data.text || JSON.stringify(data));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            transcribeFile(file);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
                setFileName('recording.webm');
                stream.getTracks().forEach((t) => t.stop());
                transcribeFile(file);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            setError('Microphone access denied. Please allow mic access.');
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
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
                                Speech to Text
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                Transcribe audio to text with high accuracy
                            </Typography>
                        </Box>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>{error}</Alert>}

                    {/* Language Selection */}
                    <Paper sx={{ ...glassCard, mb: 3 }}>
                        <FormControl fullWidth>
                            <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Audio Language</InputLabel>
                            <Select value={language} onChange={(e) => setLanguage(e.target.value)} label="Audio Language" sx={selectSx}>
                                {LANGUAGES.map((l) => <MenuItem key={l.code} value={l.code}>{l.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Paper>

                    {/* Record / Upload */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                        {/* Record */}
                        <Paper
                            sx={{
                                ...glassCard, textAlign: 'center', cursor: 'pointer',
                                border: isRecording ? '1px solid rgba(239,68,68,0.5)' : glassCard.border,
                                transition: 'all 0.3s',
                            }}
                            onClick={isRecording ? stopRecording : startRecording}
                        >
                            <Box sx={{
                                width: 80, height: 80, borderRadius: '50%', mx: 'auto', mb: 2,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                bgcolor: isRecording ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.15)',
                                animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                                '@keyframes pulse': {
                                    '0%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.4)' },
                                    '70%': { boxShadow: '0 0 0 15px rgba(239,68,68,0)' },
                                    '100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0)' },
                                },
                            }}>
                                {isRecording ? <Stop sx={{ fontSize: 40, color: '#ef4444' }} /> : <Mic sx={{ fontSize: 40, color: '#10b981' }} />}
                            </Box>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                                {isRecording ? 'Stop Recording' : 'Record Audio'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                {isRecording ? 'Click to stop and transcribe' : 'Click to start recording'}
                            </Typography>
                        </Paper>

                        {/* Upload */}
                        <Paper
                            sx={{ ...glassCard, textAlign: 'center', cursor: 'pointer' }}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileUpload} hidden />
                            <Box sx={{
                                width: 80, height: 80, borderRadius: '50%', mx: 'auto', mb: 2,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                bgcolor: 'rgba(16,185,129,0.15)',
                            }}>
                                <UploadFile sx={{ fontSize: 40, color: '#10b981' }} />
                            </Box>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>Upload Audio</Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                {fileName || 'WAV, MP3, WebM, OGG etc.'}
                            </Typography>
                        </Paper>
                    </Box>

                    {/* Loading Indicator */}
                    {loading && (
                        <Paper sx={{ ...glassCard, textAlign: 'center', mb: 3 }}>
                            <CircularProgress sx={{ color: '#10b981', mb: 2 }} />
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>Transcribing audio...</Typography>
                        </Paper>
                    )}

                    {/* Transcript */}
                    {transcript && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Paper sx={glassCard}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>TRANSCRIPT</Typography>
                                    <IconButton size="small" onClick={() => navigator.clipboard.writeText(transcript)} sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                        <ContentCopy fontSize="small" />
                                    </IconButton>
                                </Box>
                                <TextField fullWidth multiline rows={6} value={transcript} InputProps={{ readOnly: true }} sx={inputSx} />
                            </Paper>
                        </motion.div>
                    )}
                </motion.div>
            </Container>
        </Box>
    );
};

export default SpeechToTextTool;
