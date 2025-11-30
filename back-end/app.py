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


@app.route('/')
def test_message():
    return jsonify({'status': 'success', 'message': 'server is running'}), 200


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
    return add_account(game_name, tag_line)


def add_account(game_name, tag_line):
    res = fetch_lol_account(game_name, tag_line)
    if not res.ok:
        return jsonify({'status': 'failure', 'message': 'error, invalid account'}), 400
    d = res.json()
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
            INSERT INTO accounts (puuid, gameName, tagLine) VALUES (%s, %s, %s)
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



def check_account_exists_in_db(game_name, tag_line):
    db.query(
        '''
        SELECT * FROM accounts WHERE gamename = %s AND tagline = %s 
        ''', (game_name, tag_line)
    )
    return db.fetchall()


@app.route('/remove_account', methods=['POST'])
def remove_account():
    data = request.json
    game_name, _, tag_line = data['accountName'].partition('#')
    result = check_account_exists_in_db(game_name, tag_line)
    if not result:
        return jsonify({'status': 'success', 'message': 'cannot remove, account does not exist'}), 200
    # Else remove account
    db.query(
        '''
        DELETE FROM accounts
        WHERE gamename = %s AND tagline = %s
        ''', (game_name, tag_line)
    )
    return jsonify({'status': 'success', 'message': 'account removed from database'}), 200


@app.route('/link_account')
def link_account_route():
    # {'profileName', 'accountName'}
    data = request.json
    game_name, _, tag_line = data['accountName'].partition('#')
    result = check_account_exists_in_db(game_name, tag_line)
    exists = True if result else False
    if exists:
        # Add profile_account row in db table
        db.query(
            '''
            INSERT INTO profile_account VALUES (
                SELECT profile_id FROM profiles WHERE profile_name = %s,
                SELECT account_id FROM accounts WHERE gamename = %s AND tagline = %s
            )
            ''', (data['profileName'], game_name, tag_line)
        )
        return jsonify({'status': 'success', 'message': 'added account to profile'}), 200
    elif not exists:
        # Add account to database

        # Then add profile_account row in db table
        pass


@app.route('/allaccounts')
def view_all_accounts():
    db.query(
        'SELECT * FROM accounts'
    )
    result = db.fetchall()
    account_names_only = []
    for account in result:
        game_name = account[2]
        tag_line = account[3]
        account_name = game_name + '#' + tag_line
        account_names_only.append(account_name)
    return jsonify(account_names_only)


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
