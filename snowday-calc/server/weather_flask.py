import re, pgeocode, weather_library, pandas as pd, re, math
from flask import Flask, jsonify, request
from flask_cors import CORS


DEBUG = True
app = Flask(__name__)
CORS(app) # allow for cross origin requests

@app.route('/zipcode', methods=['POST', 'GET'])
def formula():
    try:
        # get zipcode from frontend
        code = request.json.get('zipcode')

        # get latitude and longitude from zipcode
        nomi = pgeocode.Nominatim('us')
        result = nomi.query_postal_code(code)

        latitude = result.latitude
        longitude = result.longitude

        if (math.isnan(latitude) or math.isnan(longitude)):
            raise Exception("Invalid Zip Code")
        else:
            # get weather for the next time its 7:00am
            forecast = weather_library.get_hourly_forecast(latitude, longitude)

            df = pd.DataFrame.from_dict(forecast)
            df = df[df['startTime'].str.contains('07:00:00')].head(1)

            # extract temperature and chill from weather data
            temperature = int(df.at(0, 'temperature'))
            wind_speed = int(re.findall(r'\d+', df.at(0, 'windSpeed')))
            chill = weather_library.calc_wind_chill(temperature, wind_speed)

            # Define ranges and their corresponding values
            real_ranges = [
                (range(-float('inf'), -15), 40),
                (range(-15, -10), 30),
                (range(-10, -5), 15),
                (range(-5, -1), 5),
                (range(-1, 0), 2),
                (range(0, 20), 0),
                (range(20, 25), -5),
                (range(25, float('inf')), -10),
            ]

            # Find the value for temperature
            value_real = next((value for r, value in real_ranges if temperature in r), None)

            # If real doesn't fall in any defined range, handle it as needed
            if value_real is None:
                print("real is out of the defined ranges.")

            # Define ranges and their corresponding values
            feel_ranges = [
                (range(-float('inf'), -15), 20),
                (range(-15, -10), 15),
                (range(-10, -5), 10),
                (range(-5, -1), 5),
                (range(-1, 0), 3),
                (range(0, 20), 0),
                (range(20, 25), -10),
                (range(25, float('inf')), -15),
            ]

            # Find the value for chill
            value_feels = next((value for r, value in feel_ranges if chill in r), None)

            # If real doesn't fall in any defined range, handle it as needed
            if value_feels is None:
                print("feels is out of the defined ranges.")

            # now onto the alert data
            alerts = weather_library.get_alert_data(latitude, longitude)
            value_warn = 0

            alert_dict = {
                'Winter Weather Advisory': 45,
                'Wind Chill Warning': 65,
                'Wind Chill Advisory': 45,
                'Winter Storm Warning': 65,
                'Winter Storm Watch': 15,
                'Blizzard Warning': 65
            }

            df = pd.DataFrame.from_dict(alerts)
            df['properties'] = df['properties'].apply(lambda x: x['event'])

            for index, row in df.iterrows():
                if row['properties'] in alert_dict:
                    value_warn += alert_dict[row['properties']]

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

            return jsonify(percent) # return jsonified percent back to frontend
    except: # error handling in the event that the user inputs an invalid zip code
        if (math.isnan(latitude) or math.isnan(longitude)):
            percent = {
                'percent': '?'
            }
        return jsonify(percent) # return jsonified question mark back to frontend

if __name__ == '__main__':
    app.run(debug=True)