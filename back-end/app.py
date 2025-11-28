from flask import request, Flask

app = Flask(__name__)

@app.route('/profiles/<username>', methods=['GET'])
def get_profile():
    pass

@app.route('/profiles', methods=['POST'])
def create_profile():
    pass

