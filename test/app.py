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

@app.route('/')
def test_method():
    db.cur.execute(
        '''
        SELECT * FROM users
        WHERE username = 'test1'
        '''
    )
    return db.cur.fetchall()