import os
import json

# dotenv is used for loading environment variables from a `.env` file.  
# In case the dependency is not installed (for example during testing or
# when the application is packaged without it) we fall back to a no-op
# loader rather than failing with ModuleNotFoundError.
try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover - optional dependency
    def load_dotenv():
        return None

# the genai client library is another external dependency; provide a
# clear message if it is missing so that callers know what to install.
try:
    from google import genai
except ImportError as exc:  # pragma: no cover - this will raise when library absent
    raise ImportError(
        "The google-genai package is required to use ai_service. "
        "Install it with `pip install google-genai`"
    ) from exc

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env")

# Create Gemini client
client = genai.Client(api_key=api_key)

def generate_doubt_solution(question: str, language: str):
    print("API KEY LOADED")  # simple debug, no variable printing

    prompt = f"""
You are an expert Data Structures and Algorithms mentor.

Respond ONLY in valid JSON format with the following keys:

problem_understanding
approach
step_by_step_explanation
code
time_and_space_complexity

Do NOT include markdown.
Do NOT include backticks.
Do NOT include extra text.

Question:
{question}
"""

    # the version used to publish the project referenced a model that has since been
    # deprecated.  Listing available models at runtime shows the current flash
    # interface under the simpler `gemini-flash-latest` identifier.  Allow callers to
    # override the model through an env var so the project can stay up to date
    # without code changes.
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    response = client.models.generate_content(
        model=model_name,
        contents=prompt
    )

    raw_text = response.text.strip()

    try:
        return json.loads(raw_text)
    except:
        # fallback if model returns bad JSON
        return {
            "problem_understanding": "Parsing error",
            "approach": raw_text,
            "step_by_step_explanation": "",
            "code": "",
            "time_and_space_complexity": ""
        }