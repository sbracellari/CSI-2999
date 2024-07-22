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
        exception = ''

        # get latitude and longitude from zipcode
        nomi = pgeocode.Nominatim('us')
        result = nomi.query_postal_code(code)

        latitude = result.latitude
        longitude = result.longitude

        if (math.isnan(latitude) or math.isnan(longitude)):
            exception = 'The zipcode you entered is invalid. Please enter a valid zipcode.'
            raise Exception("Invalid Zip Code")
        else:
            # get weather for the next time its 7:00am
            try:
                forecast = weather_library.get_hourly_forecast(latitude, longitude)
            except:
                exception = 'Unable to reach api.weather.gov, please check your internet connection.'
                raise Exception("API Connection issue")

            df = pd.DataFrame.from_dict(forecast)
            df = df[df['startTime'].str.contains('07:00:00')].head(1)

            
            # extract temperature and chill from weather data
            if not df.empty:
                temperature = int(df.iloc[0]['temperature'])
                wind_speed = int(re.findall(r'\d+', df.iloc[0]['windSpeed'])[0])
            else:
                exception = 'Weather data is unavailable for the zipcode you entered.'
                raise ValueError("DataFrame is empty after filtering.")    

            if temperature < 50 and wind_speed > 3:
                chill = weather_library.calc_wind_chill(temperature, wind_speed)
            else:
                chill = temperature

            # Define ranges and their corresponding values
            real_ranges = [
                (range(-200, -15), 40),
                (range(-15, -10), 30),
                (range(-10, -5), 15),
                (range(-5, -1), 5),
                (range(-1, 0), 2),
                (range(0, 20), 0),
                (range(20, 25), -5),
                (range(25, 200), -10),
            ]

            # Find the value for temperature
            value_real = next((value for r, value in real_ranges if temperature in r), None)

            # If real doesn't fall in any defined range, handle it as needed
            if value_real is None:
                exception = 'The temperature is out of the defined ranges.'
                raise Exception("real is out of the defined ranges.")

            # Define ranges and their corresponding values
            feel_ranges = [
                (range(-200, -15), 20),
                (range(-15, -10), 15),
                (range(-10, -5), 10),
                (range(-5, -1), 5),
                (range(-1, 0), 3),
                (range(0, 20), 0),
                (range(20, 25), -10),
                (range(25, 200), -15),
            ]

            # Find the value for chill
            value_feels = next((value for r, value in feel_ranges if chill in r), None)

            # If real doesn't fall in any defined range, handle it as needed
            if value_feels is None:
                exception = 'The wind chill is out of the defined ranges.'
                raise Exception("feels is out of the defined ranges.")

            # now onto the alert data
            try:
                alerts = weather_library.get_alert_data(latitude, longitude)
            except:
                exception = 'Unable to reach api.weather.gov, please check your internet connection.'
                raise Exception("API Connection issue")
            
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

            percent # return jsonified percent back to frontend

            return jsonify(percent) # return jsonified percent back to frontend
    except: # error handling in the event that the user inputs an invalid zip code
        percent = {
            'percent': exception
        }
        return jsonify(percent) # return jsonified question mark back to frontend

if __name__ == '__main__':
    app.run(debug=True)