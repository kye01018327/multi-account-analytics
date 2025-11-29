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


@app.route('/profiles/<profile_name>')
def get_profile(profile_name):
    # Check if profile exists
    db.query(
        '''
        SELECT * FROM profiles
        WHERE profile_name = %s
        ''', (profile_name,)
    )
    data = db.fetchall()
    if not data:
        abort(404)
    profile_name = data[0]
    return jsonify(profile_name)
    # If profile does not exist, return JSON with null
    # If profile exists, return JSON with content

@app.route('/add_account', methods=['POST'])
def add_account():
    data = request.json
    game_name, _, tag_line = data['accountName'].partition('#')
    res = fetch_lol_account(game_name, tag_line)
    if not res.ok:
        return 'Invalid Input', 400
    d = res.json()
    print(d)
    if res.ok:
        # Check if puuid exists
        db.query(
            '''
            SELECT * FROM accounts WHERE puuid = %s
            ''', (d['puuid'],)
        )
        result = db.fetchall()
        # print(result)
        if result:
            return jsonify({'status': 'success', 'message': 'account already exists'}), 200
        db.query(
            '''
            INSERT INTO accounts VALUES (%s, %s, %s)
            ''', (d['puuid'], d['gameName'], d['tagLine'])
        )

        # Check again
        db.query(
            '''
            SELECT * FROM accounts WHERE puuid = %s
            ''', (d['puuid'],)
        )
        result = db.fetchall()
        print(result)
        return jsonify({'status': 'success', 'message': 'account added'}), 200

@app.route('/allaccounts')
def view_all_accounts():
    db.query(
        'SELECT * FROM accounts'
    )
    result = db.fetchall()
    print(result)
    return jsonify(result)


def add_account(game_name: str, tag_line: str):
    # Check if account is already added
    db.query(
        '''
        SELECT * FROM accounts WHERE gameName = %s AND tagLine = %s
        ''', (game_name, tag_line)
    )
    result = db.fetchall()
    if result:
        return True
    # Check if account valid
    res = fetch_lol_account(game_name, tag_line)
    data = res.json()
    if not res.ok:
        return False
    # If acount is valid add account to database
    db.query(
        '''
        INSERT INTO accounts VALUES (%s, %s, %s)
        ''', (data['gameName'], data['puuid'], data['tagLine'])
    )
    return True


def fetch_lol_account(game_name: str, tag_line: str):
    url = f'https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{game_name + '/' + tag_line}'
    headers = {"X-Riot-Token": env['RIOT_API_KEY']}
    res = requests.get(url, headers=headers)
    return res


@app.route('/profiles/link_account', methods=['POST'])
def link_account():
    # {profileName, accountName}
    # Check if account is already linked
    pass


@app.route('/test/add_account', methods=['POST'])
def test_add_account():
    data = request.json()
    game_name, _, tag_line = data['accountName'].partition('#')
    result = add_account(game_name, tag_line)
    if result:
        return '', 204
    return 400
    