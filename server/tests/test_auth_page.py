from .pages.auth_page import AuthPage
from .testing_data import invalid_auth_data_tuples, valid_auth_data_tuples, \
    invalid_passwords

import pytest
from dotenv import load_dotenv
import os
from faker import Faker
import allure
load_dotenv()


@pytest.fixture
def page(browser):
    base_url = os.getenv('FRONTEND_ORIGIN')
    link = base_url + '/auth'
    page = AuthPage(browser)
    page.open(link)
    return page


@pytest.fixture
def test_data():
    faker = Faker()
    name, surname = faker.name().split(maxsplit=1)
    data = {
        'name': name,
        'surname': surname,
        'email': faker.email(),
        'password': faker.password()
    }
    return data


@allure.feature("form changing")
def test_form_should_be_changing(page):
    current_form = page.get_current_form()
    page.go_to_auth_form()
    with allure.step("checking current form don't match with previous form"):
        assert current_form != page.get_current_form(), \
            "form didn't changed after button clicked"


@allure.feature("account login")
class TestLogin:
    def test_guest_can_log_in(self, page):
        page.fill_log_in_email_field('testing@gmail.com')
        page.fill_log_in_password_field('difficultpassword')
        page.log_in_button_click()
        with allure.step("checking current url is having 'company'"):
            assert page.is_url_have('company'), \
                "user was not redirected to company page after login"
        with allure.step("checking user's browser have accessToken"):
            assert page.is_user_authorised(), \
                "user is not authorised after login"

    @pytest.mark.parametrize('password', invalid_passwords)
    def test_guest_cant_login_with_invalid_password(self, page, password):
        page.fill_log_in_email_field('testing@gmail.com')
        page.fill_log_in_password_field(password)
        page.log_in_button_click()
        with allure.step("checking current page url haven't 'company'"):
            assert page.is_url_have('company') is False, \
                f"user was redirected to company page after login with invalid password = {password}"
        with allure.step("checking user's browser haven't accessToken"):
            assert page.is_user_authorised() is False, \
                f"user is having session data after login with invalid password = {password}"


@allure.feature("authorisation")
class TestAuthorisation:
    @pytest.mark.parametrize('test_field', valid_auth_data_tuples)
    def test_guest_can_do_authorisation_with_valid_data(self, page, test_data, test_field):
        test_data[test_field[0]] = test_field[1]
        page.go_to_auth_form()
        page.fill_auth_form(test_data)
        page.auth_button_click()

        with allure.step("checking current url is having 'company'"):
            assert page.is_url_have('company'), \
                f"user was not redirected to company page after auth with {test_field[0]} = {test_field[1]}"
        with allure.step("checking current url is having 'company'"):
            assert page.is_user_authorised(), \
                f"session data was not set with {test_field[0]} = {test_field[1]}"

    @pytest.mark.parametrize('test_field', invalid_auth_data_tuples)
    def test_guest_cant_do_authorization_with_invalid_data(self, page, test_data, test_field):
        test_data[test_field[0]] = test_field[1]
        page.go_to_auth_form()
        page.fill_auth_form(test_data)
        page.auth_button_click()

        with allure.step("checking current url haven't 'company'"):
            assert page.is_url_have('company') is False, \
                (f"user was redirected to company page after auth"
                 f" with invalid {test_field[0]} = {test_field[1]}")

        with allure.step("checking user's browser haven't accessToken"):
            assert page.is_user_authorised() is False, \
                (f"user is having session data after auth with"
                 f" invalid {test_field[0]} = {test_field[1]}")
