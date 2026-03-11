"""
Career Tools API routes — ATS Resume Checker, Resume Enhancer,
Mock Q&A Generator, and Salary Estimator.  Uses the existing
Groq / Gemini clients from routes.py for AI generation.
"""

import os
import json
import logging
from typing import Optional, List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)

career_router = APIRouter(prefix="/api/tools", tags=["Career Tools"])


# ── Helpers: Groq / Gemini AI call ──────────────────────────────────
def _get_ai_clients():
    """Lazy-import the global AI clients initialised in routes.py."""
    try:
        from routes import gemini_client, groq_client
        return gemini_client, groq_client
    except ImportError:
        return None, None


async def _ai_generate(prompt: str) -> str:
    """Call Groq first, fall back to Gemini.  Returns raw text."""
    gemini, groq = _get_ai_clients()

    # 1. Groq (fast)
    if groq and groq.api_available:
        try:
            completion = groq.client.chat.completions.create(
                model=groq.model,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
            )
            return completion.choices[0].message.content
        except Exception as e:
            logger.warning(f"Groq career-tool error, trying Gemini: {e}")

    # 2. Gemini
    if gemini and gemini.api_available:
        try:
            resp = gemini.client.models.generate_content(
                model=gemini.model_id, contents=prompt,
            )
            return resp.text
        except Exception as e:
            logger.error(f"Gemini career-tool error: {e}")

    raise HTTPException(status_code=503, detail="No AI provider available — check API keys.")


def _parse_json(text: str) -> dict:
    """Best-effort JSON extraction from AI response."""
    t = text.strip()
    if t.startswith("```json"):
        t = t[7:]
    if t.startswith("```"):
        t = t[3:]
    if t.endswith("```"):
        t = t[:-3]
    t = t.strip()
    return json.loads(t)


# ── 1. ATS Resume Checker ──────────────────────────────────────────
class ATSCheckRequest(BaseModel):
    resume_text: str
    job_description: str


@career_router.post("/ats-check")
async def ats_check(req: ATSCheckRequest):
    """Score a resume against a job description for ATS compatibility."""
    prompt = f"""You are an expert ATS (Applicant Tracking System) analyser.

RESUME:
{req.resume_text[:4000]}

JOB DESCRIPTION:
{req.job_description[:3000]}

Analyse the resume against the job description and return ONLY valid JSON (no markdown fences):
{{
  "ats_score": <0-100 integer>,
  "keyword_match_percent": <0-100 integer>,
  "matched_keywords": ["keyword1", "keyword2", ...],
  "missing_keywords": ["keyword1", "keyword2", ...],
  "sections_analysis": {{
    "contact_info": {{"present": true/false, "feedback": "..."}},
    "summary": {{"present": true/false, "feedback": "..."}},
    "experience": {{"present": true/false, "feedback": "..."}},
    "skills": {{"present": true/false, "feedback": "..."}},
    "education": {{"present": true/false, "feedback": "..."}}
  }},
  "formatting_issues": ["issue1", "issue2"],
  "improvement_suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "overall_feedback": "2-3 sentence summary"
}}"""

    raw = await _ai_generate(prompt)
    try:
        return _parse_json(raw)
    except json.JSONDecodeError:
        return {"ats_score": 0, "error": "Failed to parse AI response", "raw": raw[:500]}


# ── 2. Resume Enhancer ─────────────────────────────────────────────
class ResumeEnhanceRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = None


@career_router.post("/enhance-resume")
async def enhance_resume(req: ResumeEnhanceRequest):
    """Enhance resume content with stronger action verbs and quantified impact."""
    role_context = f" targeting a {req.target_role} position" if req.target_role else ""
    prompt = f"""You are a professional resume writer and career coach.

ORIGINAL RESUME:
{req.resume_text[:4000]}

The candidate is{role_context}. Improve the resume content by:
1. Replacing weak verbs with strong action verbs (e.g. "helped" → "spearheaded")
2. Adding quantified impact where possible (e.g. "Increased sales by 35%")
3. Making bullet points concise yet impactful
4. Improving professional summary
5. Better keyword optimization

Return ONLY valid JSON (no markdown fences):
{{
  "enhanced_resume": "The full enhanced resume text with improvements applied",
  "changes_made": [
    {{"original": "original line", "enhanced": "improved version", "reason": "why this is better"}}
  ],
  "improvement_summary": "Brief summary of key improvements",
  "strength_score_before": <0-100>,
  "strength_score_after": <0-100>
}}"""

    raw = await _ai_generate(prompt)
    try:
        return _parse_json(raw)
    except json.JSONDecodeError:
        return {"error": "Failed to parse AI response", "raw": raw[:500]}


# ── 3. Mock Q&A Generator ─────────────────────────────────────────
class MockQARequest(BaseModel):
    job_role: str
    difficulty: str = "medium"
    count: int = 5


@career_router.post("/generate-qa")
async def generate_mock_qa(req: MockQARequest):
    """Generate mock interview questions with model answers."""
    prompt = f"""You are an experienced interviewer for a {req.job_role} position.
Generate {min(req.count, 10)} interview questions at {req.difficulty} difficulty.

Include a mix of:
- Behavioral questions (STAR method)
- Situational / problem-solving questions
- Role-specific technical or domain questions

For each question, provide a model answer that would score 85+.

Return ONLY valid JSON (no markdown fences):
{{
  "job_role": "{req.job_role}",
  "difficulty": "{req.difficulty}",
  "questions": [
    {{
      "id": 1,
      "question": "The interview question",
      "category": "behavioral/technical/situational",
      "model_answer": "A strong, detailed model answer using STAR method where applicable",
      "key_points": ["point1", "point2", "point3"],
      "tip": "One pro tip for answering this question"
    }}
  ]
}}"""

    raw = await _ai_generate(prompt)
    try:
        return _parse_json(raw)
    except json.JSONDecodeError:
        return {"error": "Failed to parse AI response", "raw": raw[:500]}


# ── 4. Salary Estimator ────────────────────────────────────────────
class SalaryEstimateRequest(BaseModel):
    job_role: str
    experience_years: int = 2
    location: str = "India"
    skills: Optional[List[str]] = None


@career_router.post("/estimate-salary")
async def estimate_salary(req: SalaryEstimateRequest):
    """Estimate salary range for a role based on experience and location."""
    skills_str = ", ".join(req.skills) if req.skills else "not specified"
    prompt = f"""You are a compensation analyst. Estimate the salary range for:

Role: {req.job_role}
Experience: {req.experience_years} years
Location: {req.location}
Skills: {skills_str}

Consider market rates, cost of living, and demand for the role.

Return ONLY valid JSON (no markdown fences):
{{
  "job_role": "{req.job_role}",
  "location": "{req.location}",
  "experience_years": {req.experience_years},
  "currency": "INR or USD based on location",
  "salary_range": {{
    "min": <number>,
    "mid": <number>,
    "max": <number>
  }},
  "formatted_range": "₹X LPA - ₹Y LPA" or "$X - $Y",
  "factors": [
    {{"factor": "factor name", "impact": "positive/negative", "explanation": "brief reason"}}
  ],
  "market_demand": "high/medium/low",
  "growth_outlook": "Brief 1-2 sentence outlook",
  "negotiation_tips": ["tip1", "tip2"]
}}"""

    raw = await _ai_generate(prompt)
    try:
        return _parse_json(raw)
    except json.JSONDecodeError:
        return {"error": "Failed to parse AI response", "raw": raw[:500]}
