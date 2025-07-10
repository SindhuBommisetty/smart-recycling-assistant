from flask import Flask, render_template, request
import cohere

app = Flask(__name__)
app.secret_key = 'nufeEkGfQaBRFrCnnn4o4Y9OJhHusBee4sbUONAD'

# Cohere API setup
COHERE_API_KEY = "nufeEkGfQaBRFrCnnn4o4Y9OJhHusBee4sbUONAD"
co = cohere.Client(COHERE_API_KEY)

chat_history = []

@app.route("/", methods=["GET", "POST"])
def chatbot():
    global chat_history
    if request.method == "POST":
        user_input = request.form["user_input"]
        if user_input.strip():
            chat_history.append(("You", user_input))

            if user_input.lower() in ["hi", "hello", "hey", "start", "hi!", "hello!"]:
                response = "Hi! What can I help you with today?"
            else:
                result = co.generate(
                    model='command-xlarge',
                    prompt=user_input,
                    max_tokens=100
                )
                response = result.generations[0].text.strip()

            chat_history.append(("Bot", response))
        else:
            response = "Please ask a valid question."

    return render_template("chatbot.html", chat_history=chat_history)

if __name__ == '__main__':
    app.run(port=5000)
