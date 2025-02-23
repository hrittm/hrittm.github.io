from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os


app = Flask(__name__)
CORS(app)  # Allow requests from frontend

# OpenAI API Key (Replace 'your-api-key' with your actual key)
# openai.api_key = "your-api-key"
openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("API key is missing! Set the 'AZURE_OPENAI_API_KEY' environment variable.")


@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json()
        question = data.get("question", "")

        if not question:
            return jsonify({"answer": "Please ask a question!"})

        client = openai.OpenAI()  # New API format

        response = client.chat.completions.create(
            model="gpt-4",  
            messages=[{"role": "user", "content": question}]
        )

        answer = response.choices[0].message.content.strip()
        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({"answer": f"Error: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True)
