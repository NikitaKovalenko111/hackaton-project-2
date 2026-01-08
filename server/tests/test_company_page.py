from .pages.company_page import CompanyPage
import pytest
from dotenv import load_dotenv
import os
import allure
from .testing_data import valid_company_names, invalid_company_names
load_dotenv()


@pytest.fixture
def page(user_no_company_browser):
    base_url = os.getenv('FRONTEND_ORIGIN')
    link = base_url + '/company'
    page = CompanyPage(user_no_company_browser)
    page.open(link)
    return page


@allure.feature("menu and form changing")
class TestMenuFormChanging:
    def test_form_should_be_visible_after_button_clicked(self, page):
        page.click_create_company_button()
        with allure.step("checking form visible"):
            assert page.is_form_visible(), \
                "form is not visible after create company button clicked"

    def test_menu_should_be_visible_after_back_button_clicked(self, page):
        page.click_create_company_button()
        page.click_create_company_back_button()
        with allure.step("checking menu visible"):
            assert page.is_menu_visible(), \
                "menu is not visible after create company back button clicked"

    def test_menu_should_disappear_after_button_clicked(self, page):
        page.click_create_company_button()
        with allure.step("checking menu disappeared"):
            assert page.is_menu_disappeared(), \
                "menu is not disappeared after create company button clicked"

    def test_form_should_disappear_after_back_button_clicked(self, page):
        page.click_create_company_button()
        page.click_create_company_back_button()
        with allure.step("checking form disappeared"):
            assert page.is_form_disappeared(), \
                "form is not disappeared after create company button clicked"


@allure.feature("logout button")
def test_user_should_logout_after_logout_button_clicked(page):
    page.click_no_company_log_out_button()
    with allure.step("checking current url have '/auth'"):
        assert page.is_url_have('/auth'), \
            "user was not redirected to auth page after logout"
    with allure.step("checking user's browser haven't accessToken"):
        assert page.is_user_authorised() is False, \
            "user didn't log out after logout button clicked"


@allure.feature("Company creation")
class TestCompanyCreation:
    @pytest.mark.parametrize('name', valid_company_names)
    def test_user_can_create_company_with_valid_name(self, fresh_state, page, name):
        page.click_create_company_button()
        page.fill_form(name)
        page.click_create_company_confirm_button()
        with allure.step("checking current url have '/profile'"):
            assert page.is_url_have('profile'), \
                f"user cant create company with name = {name}"

    @pytest.mark.parametrize('name', invalid_company_names)
    def test_user_cant_create_company_with_invalid_name(self, fresh_state, page, name):
        page.click_create_company_button()
        page.fill_form(name)
        page.click_create_company_confirm_button()
        with allure.step("checking current url have '/profile'"):
            assert page.is_url_have('/profile') is False, \
                f"user can create company with invalid name = {name}"
