import psycopg2
import pytest
from .testing_data import (user_no_company_data, user_with_company_data,
                           test_company_name, test_skill_name, test_skill_desc)
from dotenv import load_dotenv
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import requests
import allure
from allure_commons.types import AttachmentType
load_dotenv()

api_url = 'http://' + os.getenv('DB_HOST') + ':3001'
site_url = os.getenv('FRONTEND_ORIGIN')


@pytest.hookimpl(hookwrapper=True, tryfirst=True)
def pytest_runtest_makereport(item, call):
    """хук для получения статуса теста"""
    outcome = yield
    report = outcome.get_result()

    # Сохраняем отчет в атрибуты теста
    setattr(item, f"rep_{report.when}", report)
    if report.failed:
        # Добавляем скриншот в Allure
        if hasattr(item, 'browser'):  # если есть драйвер
            allure.attach(
                item.browser.get_screenshot_as_png(),
                name=f"screenshot_{item.name}",
                attachment_type=AttachmentType.PNG
            )


@pytest.fixture
def browser(request):
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    browser = webdriver.Chrome(options=options)
    browser.set_window_size(width=1920, height=1080)

    request.node.browser = browser

    yield browser

    browser.quit()


def _add_user_to_browser(browser: webdriver.Chrome, email, password):
    browser.get(site_url)
    authorization_url = api_url + '/employee/authorization'
    data = {
        "employee_email": email,
        "employee_password": password
    }
    response = requests.post(url=authorization_url, data=data)
    assert response.status_code == 200, 'could not get authorized user via api'

    access_token = response.json()['accessToken']
    browser.add_cookie({
        "name": "accessToken",
        "value": access_token,
        "path": "/"
    })
    browser.refresh()


@pytest.fixture
def user_no_company_browser(browser):
    _add_user_to_browser(browser=browser,
                         email=user_no_company_data.get('employee_email'),
                         password=user_no_company_data.get('employee_password'))
    return browser


@pytest.fixture
def user_with_company_browser(browser: webdriver.Chrome):
    _add_user_to_browser(browser=browser,
                         email=user_with_company_data.get('employee_email'),
                         password=user_with_company_data.get('employee_password'))
    return browser


@pytest.fixture
def user_with_company_with_many_skills(user_with_company_browser):
    create_skill_url = api_url + '/company/skill/create'

    access_token = user_with_company_browser.get_cookie('accessToken').get('value')
    headers = {
                 "Authorization": f"Bearer {access_token}"
                  }
    for i in range(30):
        data = {'skill_name': test_skill_name + str(i),
                'skill_desc': test_skill_desc + str(i)}
        response = requests.post(
            url=create_skill_url,
            data=data,
            headers=headers)
        assert response.status_code == 201, 'could not create skill via api'

    return user_with_company_browser


def clean_all_db():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=5432,
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
    )
    cur = conn.cursor()

    cur.execute("""
        DO $$
        DECLARE
            r RECORD;
        BEGIN
            FOR r IN (
                SELECT tablename
                FROM pg_tables
                WHERE schemaname = 'public'
            )
            LOOP
                EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE;';
            END LOOP;
        END $$;
        """)

    conn.commit()
    cur.close()
    conn.close()


def create_users_and_initial_company():
    registration_url = api_url + '/employee/registration'

    response = requests.post(url=registration_url, data=user_no_company_data)
    assert response.status_code == 201, 'could not create user via api'

    response = requests.post(url=registration_url, data=user_with_company_data)
    assert response.status_code == 201, 'could not create user via api'
    access_token = response.json()['accessToken']

    create_company_url = api_url + '/company/create'
    data = {
        "company_name": test_company_name
    }
    headers = {
                 "Authorization": f"Bearer {access_token}"
                  }
    response = requests.post(
        url=create_company_url,
        data=data,
        headers=headers)
    assert response.status_code == 201, 'could not create company via api'

    create_skill_url = api_url + '/company/skill/create'
    data ={'skill_name': test_skill_name,
           'skill_desc': test_skill_desc}
    response = requests.post(
        url=create_skill_url,
        data=data,
        headers=headers)
    assert response.status_code == 201, 'could not create skill via api'


@pytest.fixture(scope='session', autouse=True)
def initial_state():
    clean_all_db()
    create_users_and_initial_company()


@pytest.fixture
def fresh_state():
    clean_all_db()
    create_users_and_initial_company()
