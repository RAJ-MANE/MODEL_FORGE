import React, { useEffect, useRef, useCallback } from 'react';
import { Box, Typography } from '@mui/material';

declare global {
  interface Window {
    __lipSyncAvatarReady?: (api: { speak: (text: string) => void; stop: () => void }) => void;
    __lipSyncAvatar?: { speak: (text: string) => void; stop: () => void };
  }
}

const AVATAR_CONTAINER_ID = 'lip-sync-avatar-container';

interface LipSyncAvatarProps {
  /** When set, the avatar will speak this text (one question at a time). */
  question: string | null;
  /** Called when the avatar API is ready. */
  onReady?: (ready: boolean) => void;
  /** Called when speaking starts or stops. */
  onSpeakingChange?: (speaking: boolean) => void;
  /** Optional minimum height for the avatar area. */
  minHeight?: number;
}

/**
 * Lip-synced human avatar that speaks text using TalkingHead + HeadTTS (visemes).
 * Renders a 3D avatar and speaks only when `question` is set; one question at a time.
 */
const LipSyncAvatar: React.FC<LipSyncAvatarProps> = ({
  question,
  onReady,
  onSpeakingChange,
  minHeight = 400,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const questionSpokenRef = useRef<string | null>(null);
  const initRunRef = useRef(false);
  const [avatarReady, setAvatarReady] = React.useState(false);

  const speak = useCallback((text: string) => {
    if (!text?.trim()) return;
    const api = window.__lipSyncAvatar;
    if (!api) return;
    onSpeakingChange?.(true);
    try {
      api.speak(text);
      questionSpokenRef.current = text;
    } catch (e) {
      console.warn('LipSyncAvatar speak error:', e);
      onSpeakingChange?.(false);
    }
  }, [onSpeakingChange]);

  // Speak when question changes or when avatar becomes ready (so we don't miss the first question)
  useEffect(() => {
    if (!question?.trim()) return;
    if (questionSpokenRef.current === question) return;
    const api = window.__lipSyncAvatar;
    if (api) {
      speak(question);
    }
  }, [question, avatarReady, speak]);

  // Bootstrap: inject import map + module script once
  useEffect(() => {
    if (initRunRef.current) return;
    initRunRef.current = true;

    const hasImportMap = document.querySelector('script[type="importmap"]');
    if (!hasImportMap) {
      const importMap = document.createElement('script');
      importMap.type = 'importmap';
      importMap.textContent = JSON.stringify({
        imports: {
          three: 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js/+esm',
          'three/addons/': 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/',
          talkinghead: 'https://cdn.jsdelivr.net/gh/met4citizen/TalkingHead@1.7/modules/talkinghead.mjs',
        },
      });
      document.head.appendChild(importMap);
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = `
(async function() {
  const container = document.getElementById('${AVATAR_CONTAINER_ID}');
  if (!container) return;
  try {
    const { HeadTTS } = await import('https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.2/+esm');
    const { TalkingHead } = await import('talkinghead');

    const headtts = new HeadTTS({
      endpoints: ['webgpu', 'wasm'],
      workerModule: 'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.2/modules/worker-tts.mjs',
      dictionaryURL: 'https://cdn.jsdelivr.net/npm/@met4citizen/headtts@1.2/dictionaries/',
      languages: ['en-us'],
      voices: ['af_bella'],
    });

    const head = new TalkingHead(container, {
      lipsyncModules: [],
      cameraView: 'upper',
      mixerGainSpeech: 2.5,
    });

    await headtts.connect();
    await head.showAvatar({
      url: 'https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png',
      body: 'F',
      avatarMood: 'neutral',
      lipsyncLang: 'en',
    });

    headtts.onmessage = (msg) => {
      if (msg.type === 'audio') {
        try {
          head.speakAudio(msg.data, {}, function() {});
        } catch (e) {
          console.warn('speakAudio error', e);
        }
      } else if (msg.type === 'end') {
        if (window.__lipSyncAvatarOnEnd) window.__lipSyncAvatarOnEnd();
      }
    };

    window.__lipSyncAvatar = {
      speak: function(text) {
        headtts.synthesize({ input: text });
      },
      stop: function() {
        try { head.stop(); } catch (e) {}
      }
    };
    window.__lipSyncAvatarOnEnd = function() {};
    if (window.__lipSyncAvatarReady) window.__lipSyncAvatarReady(window.__lipSyncAvatar);
  } catch (e) {
    console.error('LipSync avatar init failed', e);
    if (window.__lipSyncAvatarReady) window.__lipSyncAvatarReady({ speak: function() {}, stop: function() {} });
  }
})();
`;
    document.body.appendChild(script);

    window.__lipSyncAvatarReady = (api) => {
      setAvatarReady(!!api);
      onReady?.(!!api);
    };

    const checkReady = setInterval(() => {
      if (window.__lipSyncAvatar) {
        clearInterval(checkReady);
        setAvatarReady(true);
        onReady?.(true);
      }
    }, 300);
    const t = setTimeout(() => {
      clearInterval(checkReady);
      const ready = !!window.__lipSyncAvatar;
      setAvatarReady(ready);
      onReady?.(ready);
    }, 20000);

    return () => {
      clearInterval(checkReady);
      clearTimeout(t);
      if (window.__lipSyncAvatar?.stop) window.__lipSyncAvatar.stop();
    };
  }, [onReady]);

  // Notify when TTS stream ends (HeadTTS may send 'end')
  useEffect(() => {
    (window as any).__lipSyncAvatarOnEnd = () => {
      questionSpokenRef.current = null;
      onSpeakingChange?.(false);
    };
    return () => {
      delete (window as any).__lipSyncAvatarOnEnd;
    };
  }, [onSpeakingChange]);

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: minHeight,
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 30%, #1e1e2a 0%, #0f0f14 70%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Box
        id={AVATAR_CONTAINER_ID}
        ref={containerRef}
        sx={{
          minHeight: minHeight,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
      {/* Overlay blocks drag/rotate so user cannot change viewing angle */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'auto',
          cursor: 'default',
        }}
        aria-hidden
      />
      {!avatarReady && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Typography variant="body2" color="rgba(255,255,255,0.5)">
            Loading avatar…
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LipSyncAvatar;
