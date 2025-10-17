from flask import Flask, jsonify, send_from_directory
import requests
import os

app = Flask(__name__)

RIOT_API_KEY = os.getenv("RIOT_API_KEY")

ACCOUNTNAME = "billgates1076394/11111"

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/script.js")
def script():
    return send_from_directory(".", "script.js")

@app.route("/account")
def get_account():
    url = f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{ACCOUNTNAME}"
    headers = {"X-Riot-Token": RIOT_API_KEY}
    res = requests.get(url, headers=headers)
    return jsonify(res.json()), res.status_code

if __name__ == "__main__":
    app.run(debug=True)
