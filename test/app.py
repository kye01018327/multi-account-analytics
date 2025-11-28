from flask import request, Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/greet')
def greet():
    name = request.args.get('name', 'Guest')  # URL param ?name=John
    return f"Hello, {name}!"
