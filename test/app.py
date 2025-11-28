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

@app.route('/<username>')
def test_method(username):
    db.cur.execute(
        '''
        SELECT * FROM users
        WHERE username = %s
        ''', (username,)
    )
    return db.cur.fetchall()