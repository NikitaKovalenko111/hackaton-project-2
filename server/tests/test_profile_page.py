from time import sleep

import allure

from .testing_data import user_with_company_data, test_company_name
from .pages.profile_page import ProfilePage
import pytest
from dotenv import load_dotenv
import os
load_dotenv()


@pytest.fixture
def page(user_with_company_browser):
    base_url = os.getenv('FRONTEND_ORIGIN')
    link = base_url + '/profile'
    page = ProfilePage(user_with_company_browser)
    page.open(link)
    page.wait_page_load()
    return page


@allure.feature("logout button")
def test_user_should_logout_after_logout_button_clicked(page):
    page.logout_button_click()
    with allure.step("checking current url have '/auth'"):
        assert page.is_url_have('/auth'), \
            "user was not redirected to auth page after logout"
    with allure.step("checking user's browser haven't accessToken"):
        assert page.is_user_authorised() is False, \
            "user didn't log out after logout button clicked"


@allure.feature("load profile image")
class TestImageDialog:
    def test_image_dialog_visible_after_file_input(self, page):
        abs_path = os.path.join(os.path.dirname(__file__), 'test_image.jpg')
        page.send_image(abs_path)
        with allure.step("checking image dialog visible"):
            assert page.is_image_dialog_visible(), \
                "image dialog isn't visible after image file inputted"

    def test_image_dialog_disappears_after_close_button_clicked(self, page):
        abs_path = os.path.join(os.path.dirname(__file__), 'test_image.jpg')
        page.send_image(abs_path)
        page.close_image_dialog()
        with allure.step("checking image dialog disappeared"):
            assert page.is_image_dialog_disappeared(), \
                "image dialog didn't disappear after close button clicked"


@allure.feature("Profile tabs")
class TestProfileTabs:
    def test_skills_tab_visible_after_going_to_it(self, page):
        page.profile_skills_button_click()
        with allure.step("checking skills tab visible"):
            assert page.is_skills_tab_visible(), \
                "skills tab not visible after user clicked profile skills button"

        with allure.step("checking teams tab not visible"):
            assert page.is_teams_tab_visible() is False, \
                "teams tab is visible, but should not"

        with allure.step("checking personal tab not visible"):
            assert page.is_personal_tab_visible() is False, \
                "personal tab is visible, but should not"

    def test_teams_tab_visible_after_going_to_it(self, page):
        page.profile_teams_button_click()

        with allure.step("checking teams tab visible"):
            assert page.is_teams_tab_visible(), \
                "teams tab not visible after user clicked profile teams button"

        with allure.step("checking skills tab not visible"):
            assert page.is_skills_tab_visible() is False, \
                "skills tab is visible, but should not"

        with allure.step("checking personal tab not visible"):
            assert page.is_personal_tab_visible() is False, \
                "personal tab is visible, but should not"

    def test_personal_tab_visible_after_going_to_it(self, page):
        page.profile_skills_button_click()
        page.profile_personal_button_click()
        with allure.step("checking personal tab visible"):
            assert page.is_personal_tab_visible(), \
                "personal tab not visible after user clicked profile personal button"

        with allure.step("checking teams tab not visible"):
            assert page.is_teams_tab_visible() is False, \
                "teams tab is visible, but should not"

        with allure.step("checking skills tab not visible"):
            assert page.is_skills_tab_visible() is False, \
                "skills tab is visible, but should not"


@allure.feature("Visible user data")
class TestVisibleUserData:
    def test_visible_email_matches_with_testing_data(self, page):
        visible_email = page.get_visible_email()
        with allure.step("checking visible email matches with testing value"):
            assert visible_email == user_with_company_data.get('employee_email'), \
                "user email dont matches with visible email"

    def test_visible_company_name_matches_with_testing_data(self, page):
        visible_company_name = page.get_visible_company_name()
        with allure.step("checking visible company name matches with testing value"):
            assert visible_company_name == test_company_name, \
                "user company name dont matches with visible company name"

    def test_visible_user_name_matches_with_testing_data(self, page):
        visible_user_name = page.get_visible_user_name()
        with allure.step("checking visible user name matches with testing value"):
            assert visible_user_name == user_with_company_data.get('employee_name'), \
                "user name dont matches with visible name"

    def test_visible_user_surname_matches_with_testing_data(self, page):
        visible_user_surname = page.get_visible_user_surname()
        with allure.step("checking visible user surname matches with testing value"):
            assert visible_user_surname == user_with_company_data.get('employee_surname'), \
                "user surname dont matches with visible surname"

