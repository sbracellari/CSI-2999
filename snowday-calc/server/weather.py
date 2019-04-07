import json, requests, re, psycopg2
from requests import get
from bs4 import BeautifulSoup
from flask import Flask, jsonify, request
from flask_cors import CORS

# connect to database
conn=psycopg2.connect("host=snowdaycalculator.ctk9e6sh47tc.us-east-2.rds.amazonaws.com dbname=SnowdayCalculator user=ProjectAdmin password=SnowdayCalculator")

# SQL statements
exists="""SELECT EXISTS(SELECT 1 FROM snowday WHERE zipcode=%s)"""
insert="""INSERT INTO snowday (temp_feels, temp_real, winteradvisory, zipcode) VALUES (%s, %s, %s, %s)"""
update="""UPDATE snowday SET temp_feels=%s, temp_real=%s, winteradvisory=%s WHERE zipcode=%s"""

DEBUG = True
app = Flask(__name__)
CORS(app) # allow for cross origin requests

@app.route('/zipcode', methods=['POST', 'GET'])
def formula():
    try:
        code = request.json.get('zipcode') # get zipcode from frontend

        # scraping from weather.com, the location is the provided zipcode
        page = requests.get('https://weather.com/weather/hourbyhour/l/'+code+':4:US')
        soup = BeautifulSoup(page.content, 'html.parser')

        table = soup.find('table', attrs={'class': 'twc-table'})
        table_body = table.find('tbody')

        rows = table_body.find_all('tr')

        # getting time of day, real temp, feels like temp
        for row in rows:
            cols = row.find_all('td')
            cols = [element.text.strip() for element in cols]

            date = cols[1]

            day = re.sub('\n','', date)

            if day == '7:00 amMon' or day == '7:00 amTue' or day == '7:00 amWed' or day == '7:00 amThu' or day == '7:00 amFri' or day == '7:00 amSat' or day == '7:00 amSun':
                temperature = cols[3]
                chill = cols[4]
               
            elif day == '7:00 pmMon' or day == '7:00 pmTue' or day == '7:00 pmWed' or day == '7:00 pmThu' or day == '7:00 pmFri' or day == '7:00 pmSat' or day == '7:00 pmSun':
                temperature = cols[3]
                chill = cols[4]

        # formatting
        real = int(temperature[:-1])
        feels = int(chill[:-1])

        # point system to get a snow day percentage
        if real <= -15:
            value_real = 40
        elif real > -15 and real <= -10:
            value_real = 30
        elif real > -10 and real <= -5:
            value_real = 15
        elif real > -5 and real <= -1:
            value_real = 5
        elif real == 0:
            value_real = 2
        elif real > 0 and real <= 4:
            value_real = 0
        elif real > 4 and real <= 9:
            value_real = 0
        elif real > 9 and real <= 14:
            value_real = 0
        elif real > 14 and real <= 19:
            value_real = 0
        elif real > 19 and real <= 24:
            value_real = -5
        elif real > 24:
            value_real = -10

        if feels <= -15:
            value_feels = 20
        elif feels > -15 and feels <= -10:
            value_feels = 15
        elif feels > -10 and feels <= -5:
            value_feels = 10
        elif feels > -5 and feels <= -1:
            value_feels = 5
        elif feels == 0:
            value_feels = 3
        elif feels > 0 and feels <= 4:
            value_feels = 0
        elif feels > 4 and feels <= 9:
            value_feels = 0
        elif feels > 9 and feels <= 14:
            value_feels = 0
        elif feels > 14 and feels <= 19:
            value_feels = 0
        elif feels > 19 and feels <= 24:
            value_feels = -10
        elif feels > 24:
            value_feels = -15

        # get the winter weather warning if there is one
        warning = soup.find('span', attrs={'class': 'warning-text'})
        
        warning_text = ''
        if warning == None:
            value_warn = 0
        else: 
            warning_text = warning.text.strip()

            if warning_text == 'Winter Weather Warning':
                value_warn = 65
            elif warning_text == 'Winter Weather Advisory':
                value_warn = 45
            elif warning_text == 'Winter Wather Watch':
                value_warn = 15
            elif warning_text == 'Wind Chill Warning':
                value_warn = 65
            elif warning_text == 'Wind Chill Advisory':
                value_warn = 45
            elif warning_text == 'Wind Chill Watch':
                value_warn = 15
            else:
                value_warn = 0

        # quick check to make sure the percent is a valid number
        number = value_feels + value_real + value_warn
        if number < 0:
            number = 0
        elif number > 100:
            number = 95 # never want to give 100% certainty

        number = str(number)

        # json formatting
        percent = { 
            'percent': number
        }
        
        cur = conn.cursor() # create cursor
        cur.execute(exists, [code]) # check to see if the zipcode is already in the database

        warning_exists = False
        if (warning_text is not ''):
            warning_text = True

        if(cur.fetchone()[0]): # if the zipcode already exists in the database, update its corresponding values
            try:
                cur.execute(update, [feels, real, warning_exists, code])
            except Exception as e:
                print(e)
        else: # else, insert new values
            try:
                cur.execute(insert, [feels, real, warning_exists, code])
            except Exception as e:
                print(e)

        conn.commit() # save changes to database
        cur.close() # close cursor connection

        return jsonify(percent) # return jsonified percent back to frontend
    except: # error handling in the event that the user inputs an invalid zip code
        if table is None:
            percent = {
                'percent': '?'
            }
        return jsonify(percent) # return jsonified question mark back to frontend

if __name__ == '__main__':
    app.run(debug=True)
