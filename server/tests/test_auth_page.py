from .pages.auth_page import AuthPage
import pytest
from dotenv import load_dotenv
import os
from faker import Faker

load_dotenv()
invalid_emails = ['invalid@', 'invalid@mail', '@mail', '@mail.ru',
                ' ', '', 'invalid'*1000 + 'google.com', "' OR '1'='1"]

invalid_passwords = ['123', '123'*1000, "' OR '1'='1", '']
invalid_names = [' ', '', 'long' * 1000, "' OR '1'='1"]
invalid_surnames = [' ', '', 'long' * 1000, "' OR '1'='1"]



@pytest.fixture
def page(browser):
    base_url = os.getenv('FRONTEND_ORIGIN')
    link = base_url + '/auth'
    page = AuthPage(browser, link)
    page.open()
    return page


def test_change_form(page):
    current_form = page.get_current_form()
    page.go_to_auth_form()
    assert current_form != page.get_current_form(), "form didn't changed after button clicked"


def test_guest_can_log_in(page):
    page.fill_log_in_email_field('testing1@gmail.com')
    page.fill_log_in_password_field('difficultpassword')
    page.log_in_button_click()
    assert page.get_status() == 'Вы вошли!'

def test_guest_can_do_authorisation(page):
    faker = Faker()
    full = faker.name().split()
    name = full[0]
    surname = full[-1]

    email = faker.email(domain='gmail.com')
    password = faker.password()
    page.go_to_auth_form()

    page.fill_name_field(name)
    page.fill_surname_field(surname)
    page.fill_auth_email_field(email)
    page.fill_auth_password_field(password)
    page.auth_button_click()
    assert page.get_status() == 'Вы зарегистрировались!'



@pytest.mark.parametrize('email', invalid_emails)
def test_guest_cant_login_with_invalid_email(page, email):
    page.fill_log_in_email_field(email)
    page.fill_log_in_password_field('123456')
    page.log_in_button_click()
    assert page.get_status() != 'Вы вошли!'


@pytest.mark.parametrize('password', invalid_passwords)
def test_guest_cant_login_with_invalid_password(page, password):
    page.fill_log_in_email_field('testing1@gmail.com')
    page.fill_log_in_password_field(password)
    page.log_in_button_click()
    assert page.get_status() != 'Вы вошли!'


@pytest.mark.parametrize('email', invalid_emails)
def test_guest_cant_do_auth_with_invalid_email(page, email):
    page.go_to_auth_form()
    full = Faker().name().split()
    name = full[0]
    surname = full[-1]
    page.fill_name_field(name)
    page.fill_surname_field(surname)
    page.fill_auth_email_field(email)
    page.fill_auth_password_field('123456')
    page.auth_button_click()
    assert page.get_status() != 'Вы зарегистрировались!'


@pytest.mark.parametrize('password', invalid_passwords)
def test_guest_cant_do_auth_with_invalid_password(page, password):
    page.go_to_auth_form()
    faker = Faker()
    full = faker.name().split()
    name = full[0]
    surname = full[-1]
    page.fill_name_field(name)
    page.fill_surname_field(surname)
    page.fill_auth_email_field(faker.email(domain='google.com'))
    page.fill_auth_password_field(password)
    page.auth_button_click()
    assert page.get_status() != 'Вы зарегистрировались!'


@pytest.mark.parametrize('name', invalid_names)
def test_guest_cant_do_auth_with_invalid_name(page, name):
    page.go_to_auth_form()
    faker = Faker()
    full = faker.name().split()
    surname = full[-1]
    page.fill_name_field(name)
    page.fill_surname_field(surname)
    page.fill_auth_email_field(faker.email(domain='google.com'))
    page.fill_auth_password_field('123456')
    page.auth_button_click()
    assert page.get_status() != 'Вы зарегистрировались!'


@pytest.mark.parametrize('surname', invalid_surnames)
def test_guest_cant_do_auth_with_invalid_surname(page, surname):
    page.go_to_auth_form()
    faker = Faker()
    full = faker.name().split()
    name = full[0]
    page.fill_name_field(name)
    page.fill_surname_field(surname)
    page.fill_auth_email_field(faker.email(domain='google.com'))
    page.fill_auth_password_field('123456')
    page.auth_button_click()
    assert page.get_status() != 'Вы зарегистрировались!'
