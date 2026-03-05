import os
import json

try:
    from dotenv import load_dotenv
except ImportError:
    def load_dotenv():
        return None

try:
    from groq import Groq
except ImportError as exc:
    raise ImportError(
        "The groq package is required. "
        "Install it with: pip install groq"
    ) from exc

# Load .env
load_dotenv()

# Get Groq API key
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY not found in .env file")

# Create Groq client
client = Groq(api_key=api_key)


def generate_doubt_solution(question: str, language: str) -> dict:

    system_prompt = """You are an expert programming and Data Structures & Algorithms mentor.

You MUST respond with ONLY a valid JSON object — no markdown, no backticks, no extra text.

The JSON must have EXACTLY these keys:
{
  "problem_understanding": "explanation of the problem",
  "approach": "how to solve it",
  "step_by_step_explanation": "detailed steps",
  "code": "working code solution in plain text",
  "time_complexity": "e.g. O(n log n)",
  "space_complexity": "e.g. O(n)"
}

Rules:
- No markdown formatting
- No ``` code fences anywhere
- code field must be plain text only
- Keep explanations clear and beginner-friendly
- Fill every single field, never leave blank"""

    user_prompt = f"""Give explanations in {language} language (keep code in English).

Question: {question}"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_prompt},
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            max_tokens=2048,
            response_format={"type": "json_object"},
        )
    except Exception as exc:
        err = str(exc)
        if "401" in err or "invalid_api_key" in err.lower() or "unauthorized" in err.lower():
            raise RuntimeError(
                "Invalid Groq API key. "
                "Get a free key at https://console.groq.com/ "
                "and set GROQ_API_KEY in backend/.env"
            ) from exc
        if "429" in err or "rate_limit" in err.lower():
            raise RuntimeError(
                "Rate limit reached. Please wait a moment and try again."
            ) from exc
        raise RuntimeError(f"Groq API error: {err}") from exc

    raw_text = chat_completion.choices[0].message.content.strip()

    # Strip accidental markdown fences
    if raw_text.startswith("```"):
        lines = raw_text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        raw_text = "\n".join(lines).strip()

    try:
        parsed = json.loads(raw_text)

        # Handle if model combines time+space into one field
        if "time_and_space_complexity" in parsed and (
            "time_complexity" not in parsed or "space_complexity" not in parsed
        ):
            combined = parsed.pop("time_and_space_complexity", "")
            if "space" in combined.lower():
                parts = combined.replace("Space Complexity:", "|||").replace("space complexity:", "|||")
                split = parts.split("|||")
                parsed["time_complexity"]  = split[0].replace("Time Complexity:", "").replace("time complexity:", "").strip()
                parsed["space_complexity"] = split[1].strip() if len(split) > 1 else "O(n)"
            else:
                parsed["time_complexity"]  = combined
                parsed["space_complexity"] = "See above"

        # Ensure all keys exist
        parsed.setdefault("problem_understanding",    "")
        parsed.setdefault("approach",                 "")
        parsed.setdefault("step_by_step_explanation", "")
        parsed.setdefault("code",                     "")
        parsed.setdefault("time_complexity",          "")
        parsed.setdefault("space_complexity",         "")

        return parsed

    except json.JSONDecodeError:
        return {
            "problem_understanding":    "Here is the explanation:",
            "approach":                 raw_text,
            "step_by_step_explanation": "",
            "code":                     "",
            "time_complexity":          "",
            "space_complexity":         "",
        }