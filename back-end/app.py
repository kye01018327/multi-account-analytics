from flask import request, Flask, abort, jsonify
from utils import Database
import os
import requests
from flask_cors import CORS


env = os.environ

app = Flask(__name__)
CORS(app)

db = Database(
    env['DB_NAME'], 
    env['DB_USER'], 
    env['DB_PASSWORD'], 
    env['DB_HOST'],
    env['DB_PORT'])


@app.route('/profiles', methods=['POST'])
def create_profile():
    data = request.json
    return jsonify(data)


@app.route('/accounts', methods=['POST'])
def get_account():
    data = request.json
    game_name, _, tag_line = data['account'].partition('#')
    url = f'https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{game_name + '/' + tag_line}'
    headers = {"X-Riot-Token": env['RIOT_API_KEY']}
    res = requests.get(url, headers=headers)
    return jsonify(res.json())


@app.route('/profiles/<profile_name>')
def get_profile(profile_name):
    # Check if profile exists
    db.cur.execute(
        '''
        SELECT * FROM profiles
        WHERE profile_name = %s
        ''', (profile_name,)
    )
    data = db.cur.fetchall()
    if not data:
        abort(404)
    return jsonify(data[0])
    # If profile does not exist, return JSON with null
    # If profile exists, return JSON with content


@app.route('/profiles/<username>/mastery')
def get_profile_champion_mastery(username):
    pass

