from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai
import markdown
import os

# ==========================================
# Load Environment Variables
# ==========================================

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# ==========================================
# Configure Gemini
# ==========================================

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

# ==========================================
# Flask App
# ==========================================

app = Flask(__name__)

# ==========================================
# Home
# ==========================================

@app.route("/")
def home():
    return render_template("index.html")

# ==========================================
# Chat API
# ==========================================

@app.route("/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json()

        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({
                "reply": "⚠️ Please enter a message."
            })

        prompt = f"""
You are Novamind AI.

Rules:
- Give clear answers.
- Use Markdown formatting.
- Explain programming with examples.
- If user asks code, always provide complete code.
- Be friendly and professional.
- If user asks in Hindi, reply in Hindi.
- If user asks in English, reply in English.

User:
{user_message}
"""

        response = model.generate_content(prompt)

        html = markdown.markdown(
            response.text,
            extensions=[
                "fenced_code",
                "tables"
            ]
        )

        return jsonify({
            "reply": html
        })

    except Exception as e:

        return jsonify({
            "reply": f"❌ Error : {str(e)}"
        })

# ==========================================
# Run
# ==========================================

if __name__ == "__main__":
    app.run(debug=True)