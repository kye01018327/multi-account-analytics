from flask import request, Flask
from utils import Database
import os

env = os.environ

app = Flask(__name__)

db = Database(
    env['DB_NAME'], 
    env['DB_USER'], 
    env['DB_PASSWORD'], 
    env['DB_HOST'],
    env['DB_PORT'])

@app.route('/profiles/<username>', methods=['GET'])
def get_profile():

    pass

@app.route('/profiles', methods=['POST'])
def create_profile():
    pass

