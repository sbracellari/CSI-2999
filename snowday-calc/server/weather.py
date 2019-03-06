import requests
import csv
from bs4 import BeautifulSoup

page = requests.get("https://forecast.weather.gov/MapClick.php?lat=42.68342000000007&lon=-83.13701999999995#.XGJV91xKiUk")
soup = BeautifulSoup(page.content, 'html.parser')
today = soup.find(id="current-conditions-body")
items = today.find_all(class_="pull-left")
now = items[0]

temp = now.find(class_="myforecast-current-lrg").get_text()

print(temp)

with open('weather_file.csv', mode='w') as csv_file:
    fieldnames = ['temp']
    writer = csv.DictWriter(csv_file, fieldnames)

    writer.writeheader()
    writer.writerow({'temp': temp})
