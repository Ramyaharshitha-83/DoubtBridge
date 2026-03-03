# DoubtBridge

A simple backend service for generating explanations to algorithmic questions using Google's Gemini (via the `google-genai` client).

## Setup

Install dependencies from `requirements.txt`:

```sh
python -m pip install -r requirements.txt
```

Create a `.env` file in `backend/` containing:

```env
# Make sure you obtain a fresh API key from your Google Cloud console.
# If your previous key has been exposed or revoked, replace it here.
GEMINI_API_KEY=your_key_here
```

The `dotenv` package is used to load this file, but the code gracefully continues even if `dotenv` is not installed (it simply falls back to using `os.environ`).

## Usage

Import the helper and call `generate_doubt_solution(question, language)`:

```python
from backend.ai_service import generate_doubt_solution
print(generate_doubt_solution("What is binary search?", "python"))
```
