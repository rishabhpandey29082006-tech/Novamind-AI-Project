from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import markdown
import os

# Gemini API Key
API_KEY = os.getenv("GEMINI_API_KEY")

# Gemini configure
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

# Flask App
app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


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
- If user asks for code, provide complete code.
- Be friendly and professional.
- If user asks in Hindi, reply in Hindi.
- If user asks in English, reply in English.

User:
{user_message}
"""

        response = model.generate_content(prompt)

        html = markdown.markdown(
            response.text,
            extensions=["fenced_code", "tables"]
        )

        return jsonify({
            "reply": html
        })

    except Exception as e:
        return jsonify({
            "reply": f"❌ Error: {str(e)}"
        })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )