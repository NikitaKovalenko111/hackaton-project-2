import requests
from dotenv import load_dotenv
import os
from functools import cache
load_dotenv()
api_url = 'http://' + os.getenv('DB_HOST') + ':3001'
authorization_url = api_url + '/employee/authorization'
data = {
    "employee_email": "testing1@gmail.com",
    "employee_password": "difficultpassword"
}

session = requests.Session()
response = session.post(url=authorization_url, data=data)
access_token = response.json()['accessToken']

session.headers.update({
    "Authorization": f"Bearer {access_token}"
})
response = session.post("http://localhost:3001/company/skill/create",
                        data={'skill_name': '232323',
                              'skill_desc': 'test'})
print(response.json())
def d(cls):
    cls.__name__