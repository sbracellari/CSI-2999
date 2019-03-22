from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
from flask import Flask, render_template, jsonify, request, Response
from flask_cors import CORS
import json
import requests

DEBUG = True
app = Flask(__name__)
CORS(app)

percent = 0
temp_current = 0
temp_feels = 0
temp_high = 0
temp_low = 0

@app.route('/zipcode', methods=['POST', 'GET'])
def getZip():
    zipcode = request.json.get('zipcode')
    url=get("https://weather.com/weather/today/l/"+zipcode+":4:US")
    soup = BeautifulSoup(url.content, 'html.parser')
    today = soup.find(id="main-Nowcard-92c6937d-b8c3-4240-b06c-9da9a8b0d22b")
    weather = today.find(class_="today_nowcard")

    temp_current = today.find(class_="today_nowcard-temp").get_text()[:-1]
    temp_feels = today.find(class_="today_nowcard-feels").get_text()[11:-1]
    temp_hilo = today.find_all(class_="deg-hilo-nowcard")
    temp_high = temp_hilo[0].get_text()

    if temp_high == "--": 
        temp_high = temp_current
    else:
        temp_high = temp_hilo[0].get_text()[:-1]

    temp_low = temp_hilo[1].get_text()[:-1]

    temp_current = int(temp_current)
    temp_feels = int(temp_feels)
    temp_high = int(temp_high)
    temp_low = int(temp_low)

    weather = today.find(class_="today_nowcard-sidecar component panel")
    rightnow = today.find_all(class_="")
        
    percent = { 
        "percent": temp_low
    }
    
    return jsonify(percent)
   
if __name__ == "__main__":
    app.run(debug=True)
