import pytest
from dotenv import load_dotenv
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import requests
load_dotenv()


@pytest.fixture
def browser(request):
    options = Options()
    #options.add_argument('--headless')
    #options.add_argument('--no-sandbox')
    #options.add_argument('--disable-dev-shm-usage')
    browser = webdriver.Chrome(options=options)

    yield browser
    print("\nquit browser..")
    browser.quit()


@pytest.fixture
def auth_browser(browser):
    api_url = 'http://' + os.getenv('DB_HOST') + ':3001'
    site_url = os.getenv('FRONTEND_ORIGIN')
    browser.get(site_url)
    authorization_url = api_url + '/employee/authorization'
    data = {
        "employee_email": "testing1@gmail.com",
        "employee_password": "difficultpassword"
    }
    response = requests.post(url=authorization_url, data=data)
    access_token = response.json()['accessToken']
    browser.add_cookie({
        "name": "accessToken",
        "value": access_token,
        "path": "/"
    })
    return browser

