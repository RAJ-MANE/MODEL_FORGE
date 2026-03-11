"""
Sarvam AI API routes — exposes translation, TTS, STT, 
transliteration, and language detection as tool endpoints.
"""

import os
import logging
import base64
from typing import Optional, List

import requests
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel

logger = logging.getLogger(__name__)

SARVAM_BASE = "https://api.sarvam.ai"
sarvam_router = APIRouter(prefix="/api/tools", tags=["Sarvam AI Tools"])


def _sarvam_headers() -> dict:
    api_key = os.getenv("SARVAM_API_KEY", "")
    if not api_key or api_key == "your-sarvam-api-key-here":
        raise HTTPException(
            status_code=503,
            detail="Sarvam AI API key is not configured. Add SARVAM_API_KEY to .env",
        )
    return {
        "api-subscription-key": api_key,
    }


# ── Supported languages (shared with frontend) ─────────────────────
LANGUAGES = [
    {"code": "hi-IN", "name": "Hindi"},
    {"code": "bn-IN", "name": "Bengali"},
    {"code": "gu-IN", "name": "Gujarati"},
    {"code": "kn-IN", "name": "Kannada"},
    {"code": "ml-IN", "name": "Malayalam"},
    {"code": "mr-IN", "name": "Marathi"},
    {"code": "od-IN", "name": "Odia"},
    {"code": "pa-IN", "name": "Punjabi"},
    {"code": "ta-IN", "name": "Tamil"},
    {"code": "te-IN", "name": "Telugu"},
    {"code": "en-IN", "name": "English"},
    {"code": "as-IN", "name": "Assamese"},
    {"code": "brx-IN", "name": "Bodo"},
    {"code": "doi-IN", "name": "Dogri"},
    {"code": "kok-IN", "name": "Konkani"},
    {"code": "ks-IN", "name": "Kashmiri"},
    {"code": "mai-IN", "name": "Maithili"},
    {"code": "mni-IN", "name": "Manipuri"},
    {"code": "ne-IN", "name": "Nepali"},
    {"code": "sa-IN", "name": "Sanskrit"},
    {"code": "sat-IN", "name": "Santali"},
    {"code": "sd-IN", "name": "Sindhi"},
    {"code": "ur-IN", "name": "Urdu"},
]

# Languages that support TTS (Bulbul model)
TTS_LANGUAGES = [
    {"code": "hi-IN", "name": "Hindi"},
    {"code": "bn-IN", "name": "Bengali"},
    {"code": "gu-IN", "name": "Gujarati"},
    {"code": "kn-IN", "name": "Kannada"},
    {"code": "ml-IN", "name": "Malayalam"},
    {"code": "mr-IN", "name": "Marathi"},
    {"code": "od-IN", "name": "Odia"},
    {"code": "pa-IN", "name": "Punjabi"},
    {"code": "ta-IN", "name": "Tamil"},
    {"code": "te-IN", "name": "Telugu"},
    {"code": "en-IN", "name": "English"},
]

# Bulbul v2 Speakers
BULBUL_V2_SPEAKERS = ["anushka", "suhani", "mohit", "arjun", "misha", "vian"]


@sarvam_router.get("/languages")
async def get_supported_languages():
    """Return supported language lists for all tools."""
    return {
        "translate": LANGUAGES,
        "tts": TTS_LANGUAGES,
        "stt": TTS_LANGUAGES,
        "transliterate": LANGUAGES,
    }


# ── 1. Translate ────────────────────────────────────────────────────
class TranslateRequest(BaseModel):
    input: str
    source_language_code: str = "auto"
    target_language_code: str = "hi-IN"
    model: str = "mayura:v1"
    mode: str = "formal"


@sarvam_router.post("/translate")
async def translate_text(req: TranslateRequest):
    """Translate text between Indian languages + English."""
    try:
        resp = requests.post(
            f"{SARVAM_BASE}/translate",
            headers=_sarvam_headers(),
            json=req.dict(),
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.HTTPError as e:
        logger.error(f"Sarvam translate error: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except Exception as e:
        logger.error(f"Translate error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ── 2. Text-to-Speech ──────────────────────────────────────────────
class TTSRequest(BaseModel):
    inputs: List[str]
    target_language_code: str = "hi-IN"
    speaker: str = "shubh"
    model: str = "bulbul:v3"
    pace: float = 1.0
    enable_preprocessing: bool = True


@sarvam_router.post("/tts")
async def text_to_speech(req: TTSRequest):
    """Convert text to speech using Sarvam Bulbul model."""
    try:
        payload = {
            "inputs": req.inputs,
            "target_language_code": req.target_language_code,
            "speaker": req.speaker,
            "model": req.model,
            "pace": req.pace,
        }
        resp = requests.post(
            f"{SARVAM_BASE}/text-to-speech",
            headers=_sarvam_headers(),
            json=payload,
            timeout=60,
        )
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.HTTPError as e:
        logger.error(f"Sarvam TTS error: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except Exception as e:
        logger.error(f"TTS error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ── 3. Speech-to-Text ──────────────────────────────────────────────
@sarvam_router.post("/stt")
async def speech_to_text(
    file: UploadFile = File(...),
    language_code: str = Form("hi-IN"),
    model: str = Form("saarika:v2.5"),
):
    """Transcribe audio to text using Sarvam Saarika model."""
    try:
        audio_bytes = await file.read()
        
        # Sarvam /speech-to-text expects multipart/form-data
        files = {
            'file': ('audio.wav', audio_bytes, 'audio/wav'),
            'language_code': (None, str(language_code)),
            'model': (None, str(model))
        }
        
        headers = {
            "api-subscription-key": _sarvam_headers()["api-subscription-key"]
        }

        resp = requests.post(
            f"{SARVAM_BASE}/speech-to-text",
            headers=headers,
            files=files,
            timeout=60,
        )
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.HTTPError as e:
        logger.error(f"Sarvam STT error: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except Exception as e:
        logger.error(f"STT error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ── 4. Transliterate ───────────────────────────────────────────────
class TransliterateRequest(BaseModel):
    input: str
    source_language_code: str = "hi-IN"
    target_language_code: str = "en-IN"
    spoken_form: bool = True
    spoken_form_numerals_language: Optional[str] = None


@sarvam_router.post("/transliterate")
async def transliterate_text(req: TransliterateRequest):
    """Transliterate text between different scripts."""
    try:
        resp = requests.post(
            f"{SARVAM_BASE}/transliterate",
            headers=_sarvam_headers(),
            json=req.dict(exclude_none=True),
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.HTTPError as e:
        logger.error(f"Sarvam transliterate error: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except Exception as e:
        logger.error(f"Transliterate error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ── 5. Language Detection ──────────────────────────────────────────
class DetectLanguageRequest(BaseModel):
    input: str


@sarvam_router.post("/detect-language")
async def detect_language(req: DetectLanguageRequest):
    """Detect the language of input text."""
    try:
        resp = requests.post(
            f"{SARVAM_BASE}/detect-language",
            headers=_sarvam_headers(),
            json=req.dict(),
            timeout=15,
        )
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.HTTPError as e:
        logger.error(f"Sarvam detect language error: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except Exception as e:
        logger.error(f"Detect language error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ── 6. Speak Interview Question (TTS for interview flow) ──────────
class SpeakQuestionRequest(BaseModel):
    question: str
    language_code: str = "en-IN"
    speaker: str = "shubh"
    pace: float = 0.9


@sarvam_router.post("/speak-question")
async def speak_question(req: SpeakQuestionRequest):
    """Convert an interview question to speech.
    If language is not English, translates it first, then generates audio."""
    try:
        text_to_speak = req.question

        # If target language is not English, translate the question first
        if req.language_code != "en-IN":
            try:
                translate_resp = requests.post(
                    f"{SARVAM_BASE}/translate",
                    headers=_sarvam_headers(),
                    json={
                        "input": req.question,
                        "source_language_code": "en-IN",
                        "target_language_code": req.language_code,
                        "model": "mayura:v1",
                        "mode": "formal",
                    },
                    timeout=30,
                )
                translate_resp.raise_for_status()
                translated = translate_resp.json()
                text_to_speak = translated.get("translated_text", req.question)
            except Exception as te:
                logger.warning(f"Translation failed, speaking in English: {te}")
                text_to_speak = req.question

        # Generate audio
        payload = {
            "inputs": [text_to_speak],
            "target_language_code": req.language_code,
            "speaker": req.speaker,
            "model": "bulbul:v3",
            "pace": req.pace,
        }
        tts_resp = requests.post(
            f"{SARVAM_BASE}/text-to-speech",
            headers=_sarvam_headers(),
            json=payload,
            timeout=60,
        )
        tts_resp.raise_for_status()
        data = tts_resp.json()

        return {
            "audios": data.get("audios", []),
            "translated_text": text_to_speak,
            "language_code": req.language_code,
        }

    except requests.exceptions.HTTPError as e:
        logger.error(f"Speak question error: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except Exception as e:
        logger.error(f"Speak question error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
