import requests

# Calls the NWS API with an appropriate User-Agent header
# Please replace the User-Agent with your own
# Returns the JSON response
def __call_api(url):
    try:
        response = requests.get(url, headers={"User-Agent":"enter app info here"})
    except:
        raise Exception('API connection issue')
    
    if response.status_code == 200:
        return response.json()
    else:
        return None

# 2 API calls required to get the hourly forecast via latitude and longitude
# Returns the hourly forecast for the next 7 days
def get_hourly_forecast(latitude, longitude):
    url = f'https://api.weather.gov/points/{latitude},{longitude}'
    
    hourly = __call_api(url)['properties']['forecastHourly']

    return __call_api(hourly)['properties']['periods']
    
# 1 API call required to get the alerts via latitude and longitude
# Returns the current alerts for the specified coordinates
def get_alert_data(latitude, longitude):
    url = f'https://api.weather.gov/alerts?point={latitude},{longitude}'
    
    return __call_api(url)['features']

# Calculates the wind chill given the temperature and wind speed
# Formula derived from the National Weather Service https://www.weather.gov/media/epz/wxcalc/windChill.pdf
def calc_wind_chill(temperature, wind_speed):
    return int(35.74 + 0.6215 * temperature - 35.75 * wind_speed ** 0.16 + 0.4275 * temperature * wind_speed ** 0.16)