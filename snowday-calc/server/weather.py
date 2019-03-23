from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
from flask import Flask, render_template, jsonify, request, Response
from flask_cors import CORS
import json, requests, re

DEBUG = True
app = Flask(__name__)
CORS(app)

@app.route('/zipcode', methods=['POST', 'GET'])
def formula():
    try:
        zipcode = request.json.get('zipcode')

        page = requests.get("https://weather.com/weather/hourbyhour/l/"+zipcode+":4:US")
        soup = BeautifulSoup(page.content, 'html.parser')

        table = soup.find('table', attrs={'class': 'twc-table'})
        table_body = table.find('tbody')

        rows = table_body.find_all('tr')

        for row in rows:
            cols = row.find_all('td')
            cols = [element.text.strip() for element in cols]

            day = cols[1]
            temp = cols[3]
            feels = cols[4]

            if day == "7:00 amMon" or day == "7:00 amTue" or day == "7:00 amWed" or day == "7:00 amThu" or day == "7:00 amFri" or day == "7:00 amSat" or day == "7:00 amSun":
                temperature = cols[3]
                chill = cols[4]
               
            elif day == "7:00 pmMon" or day == "7:00 pmTue" or day == "7:00 pmWed" or day == "7:00 pmThu" or day == "7:00 pmFri" or day == "7:00 pmSat" or day == "7:00 pmSun":
                temperature = cols[3]
                chill = cols[4]

        temp_real = int(temperature[:-1])
        temp_feels = int(chill[:-1])

        if temp_real <= -15:
            value_real = 40
        elif temp_real > -15 and temp_real <= -10:
            value_real = 30
        elif temp_real > -10 and temp_real <= -5:
            value_real = 15
        elif temp_real > -5 and temp_real <= -1:
            value_real = 5
        elif temp_real == 0:
            value_real = 20
        elif temp_real > 0 and temp_real <= 4:
            value_real = 0
        elif temp_real > 4 and temp_real <= 9:
            value_real = 0
        elif temp_real > 9 and temp_real <= 14:
            value_real = 0
        elif temp_real > 14 and temp_real <= 19:
            value_real = 0
        elif temp_real > 19 and temp_real <= 24:
            value_real = -5
        elif temp_real > 24:
            value_real = -10

        if temp_feels <= -15:
            value_feels = 20
        elif temp_feels > -15 and temp_feels <= -10:
            value_feels = 15
        elif temp_feels > -10 and temp_feels <= -5:
            value_feels = 10
        elif temp_feels > -5 and temp_feels <= -1:
            value_feels = 5
        elif temp_feels == 0:
            value_feels = 3
        elif temp_feels > 0 and temp_feels <= 4:
            value_feels = 0
        elif temp_feels > 4 and temp_feels <= 9:
            value_feels = 0
        elif temp_feels > 9 and temp_feels <= 14:
            value_feels = 0
        elif temp_feels > 14 and temp_feels <= 19:
            value_feels = 0
        elif temp_feels > 19 and temp_feels <= 24:
            value_feels = -10
        elif temp_feels > 24:
            value_feels = -15

        #warning = soup.find('span', attrs={'class': 'warning-text'})
        #warning_text = warning.text.strip()
        #if warning == None:
            #value_warn = 0
        #elif warning_text == "Winter Weather Warning":
            #value_warn = 65
        #elif warning_text == "Winter Weather Advisory":
            #value_warn = 45
        #elif warning_text == "Winter Wather Watch":
            #value_warn = 15
        #elif warning_text == "Wind Chill Warning":
            #value_warn = 65
        #elif warning_text == "Wind Chill Advisory":
            #value_warn = 45
        #elif warning_text == "Wind Chill Watch":
            #value_warn = 15

        number = value_feels + value_real
        if number < 0:
            number = 0
        elif number > 100:
            number = 95

        number = str(number)

        percent = { 
            "percent": number
        }
        
        return jsonify(percent)
    except:
        if table is None:
            percent = {
                "percent": "?"
            }
        return jsonify(percent)
   
if __name__ == "__main__":
    app.run(debug=True)
