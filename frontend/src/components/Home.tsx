import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import {
  ArrowRight,
  BrainCircuit,
  Eye,
  Mic2,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { TextField, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { TrendingUp, WorkOutline } from '@mui/icons-material';

import ResumeUpload from './ResumeUpload';
import NavigationHeader from './NavigationHeader';
import { AnimatedBackground } from './home/AnimatedBackground';

const FadeIn = ({ children, delay = 0, direction = 'up' }: any) => {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction as keyof typeof directions] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

const MagneticButton = ({ children, onClick, className }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current?.getBoundingClientRect() || { height: 0, width: 0, left: 0, top: 0 };
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: any) => (
  <FadeIn delay={delay}>
    <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-500">
          <Icon size={28} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 font-outfit">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  </FadeIn>
);

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [jobRole, setJobRole] = useState('Software Developer');
  const [resumeData, setResumeData] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const INDIAN_LANGUAGES = [
    { code: 'hi-IN', label: 'Hindi' },
    { code: 'mr-IN', label: 'Marathi' },
    { code: 'ta-IN', label: 'Tamil' },
    { code: 'te-IN', label: 'Telugu' },
    { code: 'kn-IN', label: 'Kannada' },
    { code: 'bn-IN', label: 'Bengali' },
    { code: 'gu-IN', label: 'Gujarati' },
    { code: 'ml-IN', label: 'Malayalam' },
    { code: 'pa-IN', label: 'Punjabi' },
    { code: 'od-IN', label: 'Odia' },
  ];

  const startInterview = (mode: 'english' | 'regional') => {
    const sessionId = uuidv4();
    const params = new URLSearchParams({
      role: jobRole,
      hasResume: resumeData ? 'true' : 'false',
      avatarSpeech: mode === 'english' ? 'true' : 'false',
      lang: mode === 'english' ? 'en-IN' : selectedLanguage,
    });
    if (resumeData) {
      sessionStorage.setItem(`resume_${sessionId}`, JSON.stringify(resumeData));
      sessionStorage.setItem('resumeData', JSON.stringify(resumeData));
    }
    navigate(`/interview/${sessionId}?${params.toString()}`);
  };

  useEffect(() => {
    // Add tailwind via CDN if not present for layout utilities
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-purple-500/30">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0 opacity-60">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <AnimatedBackground />
          </Canvas>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 pt-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div style={{ y: y1, opacity }}>
              <FadeIn delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-8 backdrop-blur-md">
                  <Sparkles size={16} className="text-blue-400" />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Next-Gen Interview Intelligence
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] font-outfit">
                  <span className="block">Master Your</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-300% animate-gradient">
                    Performance
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.3}>
                <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
                  A multimodal AI engine that reads your expressions, analyzes your voice, and evaluates your responses in real-time.
                </p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <MagneticButton
                    className="cursor-pointer"
                    onClick={() => document.getElementById('setup')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <div className="px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:scale-105 transition-transform flex items-center gap-2 group">
                      Get Started
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </div>
                  </MagneticButton>
                  <MagneticButton
                    className="cursor-pointer"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <div className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-colors">
                      Explore Tech
                    </div>
                  </MagneticButton>
                </div>
              </FadeIn>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative z-10 bg-[#050505]">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-black mb-20 text-center font-outfit">
              Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Intelligence</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={Eye}
              title="Computer Vision"
              description="Real-time 468-point facial landmark detection measuring confidence, engagement, and eye contact instantaneously."
              delay={0.1}
            />
            <FeatureCard
              icon={Mic2}
              title="Voice Analytics"
              description="Spectral analysis and pitch detection scoring your vocal clarity, pace, and persuasive tonality."
              delay={0.2}
            />
            <FeatureCard
              icon={BrainCircuit}
              title="Neural Evaluation"
              description="State-of-the-art LLMs generate highly contextual questions and evaluate the structural quality of your answers."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Configuration & Start Section */}
      <section id="setup" className="py-32 relative z-10 border-t border-white/10 overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -translate-y-1/2" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-16 backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              <FadeIn direction="right">
                <div>
                  <h2 className="text-4xl font-bold mb-6 font-outfit">Configure Your Session</h2>
                  <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                    Upload your resume to allow our AI to tailor the interview precisely to your experience level and target role.
                  </p>

                  <div className="space-y-6">
                    <div className="bg-black/40 rounded-2xl p-6 border border-white/10">
                      <ResumeUpload onResumeAnalyzed={setResumeData} />
                    </div>

                    <div>
                      <TextField
                        fullWidth
                        label="Target Job Role"
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            borderRadius: '16px',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                            '&:hover fieldset': { borderColor: 'rgba(59,130,246,0.5)' },
                            '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                          },
                          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                          '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
                        }}
                      />
                    </div>

                    {resumeData && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-3"
                      >
                        <Chip
                          icon={<TrendingUp sx={{ color: '#60a5fa !important', fontSize: 16 }} />}
                          label={`${resumeData.skills?.length || 0} Skills Detected`}
                          sx={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#60a5fa', fontWeight: 600, py: 2, borderRadius: '12px' }}
                        />
                        <Chip
                          icon={<WorkOutline sx={{ color: '#c084fc !important', fontSize: 16 }} />}
                          label={`${resumeData.experience?.length || 0} Roles Parsed`}
                          sx={{ backgroundColor: 'rgba(168,85,247,0.15)', color: '#c084fc', fontWeight: 600, py: 2, borderRadius: '12px' }}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="left" delay={0.2}>
                <div className="flex flex-col gap-6 h-full">
                  {/* English Interview Card */}
                  <div className="bg-black/40 border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group flex-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
                          <BrainCircuit size={28} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold font-outfit">English Interview</h3>
                          <p className="text-gray-500 text-sm">Avatar speaks questions aloud</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-6">
                        The 3D avatar will speak each question with lip-sync & voice. Camera + mic required.
                      </p>
                      <button
                        onClick={() => startInterview('english')}
                        className="w-full relative group/btn"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover/btn:opacity-100 transition duration-500 group-hover/btn:duration-200" />
                        <div className="relative px-6 py-4 bg-white text-black font-bold text-base rounded-2xl flex items-center justify-between overflow-hidden">
                          <span>Start in English</span>
                          <ChevronRight className="group-hover/btn:translate-x-1 transition-transform" size={20} />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Indian Regional Languages Card */}
                  <div className="bg-black/40 border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group flex-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/20">
                          <Globe size={28} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold font-outfit">भारतीय भाषाएँ</h3>
                          <p className="text-gray-500 text-sm">Indian regional language interview</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Questions spoken via Sarvam AI in your language. Avatar stays silent to avoid voice overlap.
                      </p>

                      {/* Language selector */}
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-focused': { color: '#f97316' } }}>Language</InputLabel>
                        <Select
                          value={selectedLanguage}
                          label="Language"
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          sx={{
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            borderRadius: '16px',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(249,115,22,0.5)' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f97316' },
                            '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                bgcolor: 'rgba(20,20,20,0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                '& .MuiMenuItem-root': { color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }, '&.Mui-selected': { bgcolor: 'rgba(249,115,22,0.15)' } },
                              },
                            },
                          }}
                        >
                          {INDIAN_LANGUAGES.map((lang) => (
                            <MenuItem key={lang.code} value={lang.code}>{lang.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <button
                        onClick={() => startInterview('regional')}
                        className="w-full relative group/btn"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur opacity-30 group-hover/btn:opacity-100 transition duration-500 group-hover/btn:duration-200" />
                        <div className="relative px-6 py-4 bg-white text-black font-bold text-base rounded-2xl flex items-center justify-between overflow-hidden">
                          <span>Start in {INDIAN_LANGUAGES.find(l => l.code === selectedLanguage)?.label || 'Regional'}</span>
                          <ChevronRight className="group-hover/btn:translate-x-1 transition-transform" size={20} />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </FadeIn>

            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 border-t border-white/5 text-center px-6">
        <p className="text-gray-500 text-sm">
          Improvyu &copy; {new Date().getFullYear()}. Elevated Intelligence.
        </p>
      </footer>
    </div>
  );
};

export default Home;