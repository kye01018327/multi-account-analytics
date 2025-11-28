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

# @app.route('/profiles/<username>', methods=['GET'])
# def get_profile(username):
#     # Check if profile exists
#     db.cur.execute(
#         '''SELECT * FROM users
#         WHERE user_id = %s''', (username,)
#     )
#     if db.cur.fetchall():
#         return 1
#     return 0
#     # If profile does not exist, return JSON with null
#     # If profile exists, return JSON with content

@app.route('/profiles', methods=['GET'])
def get_profile():
    # Check if profile exists
    db.cur.execute(
        '''SELECT * FROM users
        WHERE user_id = "test"'''
    )
    if db.cur.fetchall():
        return True
    return False
    # If profile does not exist, return JSON with null
    # If profile exists, return JSON with content



@app.route('/profiles', methods=['POST'])
def create_profile():
    pass

