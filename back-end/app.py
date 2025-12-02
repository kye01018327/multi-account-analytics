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


def fetch_profile_db(profile_name: str):
    db.query(
        '''
        SELECT * FROM profiles
        WHERE profile_name = %s
        ''', (profile_name,)
    )
    rows = db.fetchall()
    return rows


def profile_exists_in_db(profile_name: str) -> bool:
    db.query(
        '''
        SELECT EXISTS (SELECT * FROM profiles
        WHERE profile_name = %s)
        ''', (profile_name,)
    )
    return db.fetchone()[0]


def fetch_accounts_linked_to_profile(profile_name) -> list[str]:
    db.query(
        '''
        SELECT a.game_name, a.tag_line
        FROM accounts AS a
        JOIN profile_account_link AS pa ON a.account_id = pa.account_id
        JOIN profiles AS p ON pa.profile_id = p.profile_id
        WHERE p.profile_name = %s
        ''', (profile_name,)
    )
    rows = db.fetchall()
    accounts = []
    for account in rows:
        accounts.append(account[0] + '#' + account[1])
    return accounts


@app.route('/profiles/<profile_name>')
def get_profile_route(profile_name):
    d = {}
    # Check if profile exists
    exists = profile_exists_in_db(profile_name)
    if not exists:
        abort(404)
    rows = fetch_profile_db(profile_name)
    d['profile_id'] = rows[0][0]
    d['profile_name'] = rows[0][1]
    # Get linked accounts
    d['accounts'] = fetch_accounts_linked_to_profile(profile_name)
    return jsonify(d)


def add_account_to_db(puuid: str, game_name: str, tag_line: str) -> None:
    db.query(
        '''
        INSERT INTO accounts (puuid, game_name, tag_line) VALUES (%s, %s, %s)
        ''', (puuid, game_name, tag_line)
    )


def fetch_puuid_riot(game_name: str, tag_line: str):
    url = f'https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}'
    headers = {"X-Riot-Token": env['RIOT_API_KEY']}
    res = requests.get(url, headers=headers)
    if not res.ok:
        return None
    d = res.json()
    puuid = d['puuid']
    return puuid


def fetch_account(game_name: str, tag_line: str) -> bool:
    db.query(
        '''
        SELECT * FROM accounts WHERE game_name = %s AND tag_line = %s 
        ''', (game_name, tag_line)
    )
    row = db.fetchall()
    return row


def entry_exists(input: str):
    return True if input else False


def add_account_db(game_name, tag_line):
    # Check if puuid exists
    row = fetch_account(game_name, tag_line)
    exists = entry_exists(row)
    if exists:
        return jsonify({'status': 'success', 'message': 'account already exists'}), 200
    # Else add account to database
    # Check if account name is valid
    puuid = fetch_puuid_riot(game_name, tag_line)
    if puuid is None:
        return jsonify({'status': 'failure', 'message': 'error, invalid account name'}), 400
    add_account_to_db(puuid, game_name, tag_line)
    return jsonify({'status': 'success', 'message': 'account added'}), 200


@app.route('/add_account', methods=['POST'])
def add_account_route():
    d = request.json
    return add_account_db(d['gameName'], d['tagLine'])


def remove_account_from_db(game_name: str, tag_line: str) -> None:
    db.query(
        '''
        DELETE FROM accounts
        WHERE game_name = %s AND tag_line = %s
        ''', (game_name, tag_line)
    )


@app.route('/remove_account', methods=['POST'])
def remove_account_route():
    d = request.json
    row = fetch_account(d['gameName'], d['tagLine'])
    exists = entry_exists(row)
    if not exists:
        return jsonify({'status': 'success', 'message': 'cannot remove, account does not exist'}), 200
    # Else remove account
    elif exists:
        remove_account_from_db(d['gameName'], d['tagLine'])
        return jsonify({'status': 'success', 'message': 'account removed from database'}), 200

def account_linked_to_profile(profile_name: str, game_name: str, tag_line: str) -> bool:
    db.query(
        '''
        SELECT EXISTS ((SELECT * FROM profile_account_link 
        WHERE profile_id = (SELECT profile_id FROM profiles WHERE profile_name = %s) 
        AND account_id = 
        (SELECT account_id FROM accounts WHERE game_name = %s and tag_line = %s)))
        ''', (profile_name, game_name, tag_line)
    )
    return db.fetchone()[0]


def add_profile_account_link(profile_name: str, game_name: str, tag_line: str) -> None:
    db.query(
        '''
        INSERT INTO profile_account_link VALUES (
            (SELECT profile_id FROM profiles WHERE profile_name = %s),
            (SELECT account_id FROM accounts WHERE game_name = %s AND tag_line = %s)
        )
        ''', (profile_name, game_name, tag_line)
    )


def link_account_to_profile(profile_name, game_name, tag_line):
    # Check if already linked
    exists = account_linked_to_profile(profile_name, game_name, tag_line)
    if exists:
       return jsonify({'status': 'success', 'message': 'account already linked'}), 200 

    # If not linked, add profile_account_link row in db table
    elif not exists:
        add_profile_account_link(profile_name, game_name, tag_line)
        return jsonify({'status': 'success', 'message': 'added account to profile'}), 200


@app.route('/link_account', methods=['POST'])
def link_account_route():
    # {'profileName', 'gameName', 'tagLine}
    d = request.json
    row = fetch_account(d['gameName'], d['tagLine'])
    exists = entry_exists(row)
    if exists:
        return link_account_to_profile(d['profileName'], d['gameName'], d['tagLine'])
    elif not exists:
        # Add account to database
        add_account_db(d['gameName'], d['tagLine'])
        # Then add profile_account_link row in db table
        return link_account_to_profile(d['profileName'], d['gameName'], d['tagLine'])


def account_link_exists(profile_name: str, game_name: str, tag_line: str) -> bool:
    db.query(
        '''
        SELECT * FROM (SELECT * FROM profiles
        JOIN profile_account_link ON profiles.profile_id = profile_account_link.profile_id
        JOIN accounts ON profile_account_link.account_id = accounts.account_id)
        WHERE profile_name = %s AND game_name = %s AND tag_line = %s
        ''', (profile_name, game_name, tag_line)
    )
    rows = db.fetchall()
    exists = True if rows else False
    return exists

def unlink_account(profile_name: str, game_name: str, tag_line: str) -> None:
    db.query(
        '''
        DELETE FROM profile_account_link WHERE
        profile_id = (SELECT profile_id FROM profiles WHERE profile_name = %s) AND
        account_id = (SELECT account_id FROM accounts WHERE game_name = %s AND tag_line = %s)
        ''', (profile_name, game_name, tag_line)
    )


@app.route('/unlink_account', methods=['POST'])
def unlink_account_route():
    # {'profileName', 'accountName'}
    d = request.json
    # Check if account link exists
    exists = account_link_exists(d['profileName'], d['gameName'], d['tagLine'])
    # If account is not linked, do nothing
    if not exists:
        return jsonify({'status': 'success', 'message': 'nothing to unlink'}), 200
    # Else unlink
    unlink_account(d['profileName'], d['gameName'], d['tagLine'])
    return jsonify({'status': 'success', 'message': 'unlinked account'}), 200


def fetch_all_accounts_info() -> list:
    db.query(
        '''
        SELECT game_name, tag_line, total_mastery FROM accounts
        JOIN account_total_masteries ON accounts.account_id = account_total_masteries.account_id
        '''
    )
    rows = db.fetchall()
    accounts = []
    for entry in rows:
        account = {}
        game_name = entry[0]
        tag_line = entry[1]
        account['accountName'] = game_name + '#' + tag_line
        account['totalMastery'] = entry[2]
        accounts.append(account)
    return accounts


def fetch_puuid_db(game_name: str, tag_line: str) -> str:
    # Check if account exists in db
    # If exists, fetch puuid from db
    # If does not exist in db
        # Add account to db
        # Get puuid from db
    rows = fetch_account(game_name, tag_line)
    exists = entry_exists(rows)
    if not exists:
        add_account_to_db(game_name, tag_line)
    db.query(
        '''
        SELECT puuid FROM accounts
        WHERE game_name = %s AND tag_line = %s
        ''', (game_name, tag_line)
    )
    r = db.fetchall()
    puuid = r[0][0]
    return puuid


@app.route('/test')
def test():
    puuid = fetch_puuid('kevin22703307064', 'NA1')
    return jsonify('test')


def fetch_puuid(game_name: str, tag_line: str) -> str:
    # Given game_name and tag_line of an account, fetch the puuid of that account
    # Get puuid from project database
        # Check whether account exists in database
        # If exists
            # Get puuid from database
        # If does not exist
            # Fetch puuid from Riot
            # Insert new account into database
    # Return puuid as string

    row = fetch_account(game_name, tag_line)
    exists = entry_exists(row)
    puuid = None
    if exists:
        # Get puuid from database
        puuid = fetch_puuid_db(game_name, tag_line)
        return puuid
    elif not exists:
        # Fetch puuid from Riot
        puuid = fetch_puuid_riot(game_name, tag_line)
        # Insert new account into database
        add_account_to_db(puuid, game_name, tag_line)
    return puuid


def fetch_account_total_mastery_riot(game_name: str, tag_line: str) -> int:
    # Given the gameName and tagLine of a North American account, return all the champion masteries of that account
    # Get puuid
    puuid = fetch_puuid(game_name, tag_line)
    url = f'https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}'
    headers = {'X-Riot-Token': env['RIOT_API_KEY']}
    res = requests.get(url, headers=headers)
    champion_masteries = res.json()
    total_champion_mastery_score = 0
    for champion in champion_masteries:
        total_champion_mastery_score += champion['championPoints']
    return total_champion_mastery_score


def fetch_profile_id(profile_name: str) -> int:
    db.query(
        '''
        SELECT profile_id FROM profiles
        WHERE profile_name = %s
        ''', (profile_name,)
    )
    profile_id = db.fetchone()[0]
    return profile_id


def account_exists_db(game_name: str, tag_line: str) -> bool:
    db.query(
        '''
        SELECT EXISTS (SELECT 1 FROM accounts WHERE game_name = %s AND tag_line = %s)
        ''', (game_name, tag_line)
    )
    return db.fetchone()[0]


def query_fetch_account_id(game_name: str, tag_line: str) -> int:
    db.query(
        '''
        SELECT account_id FROM accounts
        WHERE game_name = %s AND tag_line = %s
        ''', (game_name, tag_line)
    )
    result = db.fetchone()
    return result[0] if result else None


def fetch_account_id(game_name: str, tag_line: str) -> int:
    if not account_exists_db(game_name, tag_line):
        add_account_db(game_name, tag_line)
    account_id = query_fetch_account_id(game_name, tag_line)
    return account_id


def fetch_account_total_mastery_db(account_id: int) -> int:
    db.query(
        '''
        SELECT total_mastery FROM account_total_masteries
        WHERE account_id = %s
        ''', (account_id,)
    )
    result = db.fetchone()
    return result[0] if result else None


def account_total_mastery_exists(account_id: int) -> bool:
    db.query(
        '''
        SELECT EXISTS(
            SELECT 1 FROM account_total_masteries
            WHERE account_id = %s
        )
        ''', (account_id,)
    )
    return db.fetchone()[0]


def add_account_total_mastery_db(game_name: str, tag_line: str):
    # Check if total mastery exists for account
    # If does not exist
        # fetch total mastery from riot
        # add to db
    account_id = fetch_account_id(game_name, tag_line)
    if account_total_mastery_exists(account_id):
        return
    total_mastery = fetch_account_total_mastery_riot(game_name, tag_line)
    db.query(
        '''
        INSERT INTO account_total_masteries VALUES (%s, %s)
        ''', (account_id, total_mastery)
    )


def fetch_account_total_mastery(game_name: str, tag_line: str) -> int:
    # Check if total_mastery exists in db
    # If not exist
        # Fetch total mastery score from riot
        # Add to database
    # Fetch total_mastery from db

    account_id = fetch_account_id(game_name, tag_line)
    if not account_total_mastery_exists(account_id):
        add_account_total_mastery_db(game_name, tag_line)
    total_mastery = fetch_account_total_mastery_db(account_id)
    return total_mastery


@app.route('/fetch_account_total_mastery_riot', methods=['GET'])
def fetch_account_total_mastery_riot_route():
    # Given the gameName and tagLine of a North American account, return all the champion masteries of that account
    game_name = request.args.get('gameName')
    tag_line = request.args.get('tagLine')
    total_champion_mastery_score = fetch_account_total_mastery_riot(game_name, tag_line)
    return jsonify(total_champion_mastery_score)


@app.route('/fetch_account_total_mastery', methods=['GET'])
def fetch_account_total_mastery_route():
    # Given the gameName and tagLine of a North American account, return all the champion masteries of that account
    game_name = request.args.get('gameName')
    tag_line = request.args.get('tagLine')
    total_champion_mastery_score = fetch_account_total_mastery(game_name, tag_line)
    return jsonify(total_champion_mastery_score)


@app.route('/allaccounts')
def view_all_accounts():
    account_info = fetch_all_accounts_info()
    return jsonify(account_info)


@app.route('/fetch_profile_total_mastery', methods=['GET'])
def fetch_profile_total_mastery_route():
    pass
