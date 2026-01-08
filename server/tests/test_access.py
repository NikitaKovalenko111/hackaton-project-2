import pytest
from selenium.webdriver import Chrome
from .pages.base_page import BasePage
from dotenv import load_dotenv
import os
import allure

load_dotenv()
base_url = os.getenv('FRONTEND_ORIGIN')

need_to_be_authorized_pages = ['profile', 'skills-settings', 'employees',
                               'teams', 'interviews', 'skill-orders', 'skills-settings/1']


@allure.feature("Page access control")
class TestPageAccess:
    @pytest.mark.parametrize('page', need_to_be_authorized_pages + ['company'])
    def test_guest_cant_go_to_main_pages(self, browser: Chrome, page: str):
        page_url = base_url + '/' + page
        p = BasePage(browser)
        p.open(page_url)
        with allure.step("checking current url have '/auth'"):
            assert p.is_url_have('/auth'), f'guest can go to {page} page'

    def test_user_cant_go_to_auth_page(self, user_no_company_browser):
        page_url = base_url + '/auth'
        p = BasePage(user_no_company_browser)
        p.open(page_url)
        with allure.step("checking current url haven't '/auth'"):
            assert p.is_url_have('/auth') is False, \
                f'user can go to auth page, but should not'

    @pytest.mark.parametrize('page', need_to_be_authorized_pages)
    def test_user_no_company_cant_go_to_main_pages(self, user_no_company_browser, page):
        page_url = base_url + '/' + page
        p = BasePage(user_no_company_browser)
        p.open(page_url)
        with allure.step("checking current url have '/company'"):
            assert p.is_url_have('/company'), \
                (f'user with no company can go to {page} page, '
                 'but should not')

    @pytest.mark.parametrize('page', need_to_be_authorized_pages)
    def test_user_with_company_can_go_to_main_pages(self, user_with_company_browser, page):
        page_url = base_url + '/' + page
        p = BasePage(user_with_company_browser)
        p.is_url_have('profile')
        p.open(page_url)
        with allure.step(f"checking current url have '/{page}'"):
            assert p.is_url_have(page), \
                f'user with company cant go to {page} page'

    def test_user_with_company_cant_go_to_create_company_page(self, user_with_company_browser):
        page_url = base_url + '/company'
        p = BasePage(user_with_company_browser)
        p.open(page_url)
        with allure.step("checking current url have '/profile'"):
            assert p.is_url_have('/profile'), \
                ("user with company can go to create company page, "
                 "but should not")
