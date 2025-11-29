from flask import request, Flask
from utils import Database
import os
from flask_cors import CORS


env = os.environ

app = Flask(__name__)
CORS(app, origins=[env['REACT_ADDR']])

db = Database(
    env['DB_NAME'], 
    env['DB_USER'], 
    env['DB_PASSWORD'], 
    env['DB_HOST'],
    env['DB_PORT'])


@app.route('/profiles/<username>', methods=['GET'])
def get_profile(username):
    # Check if profile exists
    db.cur.execute(
        '''
        SELECT * FROM users
        WHERE username = %s
        ''', (username,)
    )
    return db.cur.fetchall()
    # If profile does not exist, return JSON with null
    # If profile exists, return JSON with content



@app.route('/profiles', methods=['POST'])
def create_profile():
    
    pass

# update profile

