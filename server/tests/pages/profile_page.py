from .base_page import BaseMainPage
from .locators import ProfilePageLocators
import allure


class ProfilePage(BaseMainPage):
    @allure.step("waiting page loaded")
    def wait_page_load(self):
        self.is_element_present(*ProfilePageLocators.LOAD_IMAGE_INPUT)

    @allure.step("clicking logout button")
    def logout_button_click(self):
        button = self.browser.find_element(*ProfilePageLocators.LOGOUT_BUTTON)
        button.click()

    @allure.step("sending image")
    def send_image(self, abs_path):
        image_input = self.browser.find_element(*ProfilePageLocators.LOAD_IMAGE_INPUT)
        image_input.send_keys(abs_path)

    @allure.step("loading image")
    def load_image(self):
        with allure.step("clicking resize button"):
            resize_button = self.browser.find_element(*ProfilePageLocators.RESIZE_IMAGE_BUTTON)
            resize_button.click()
        with allure.step("clicking confirm button"):
            confirm_button = self.browser.find_element(*ProfilePageLocators.IMAGE_CONFIRM_BUTTON)
            confirm_button.click()

    @allure.step("clicking close image dialog")
    def close_image_dialog(self):
        close_button = self.browser.find_element(*ProfilePageLocators.IMAGE_DIALOG_CLOSE_BUTTON)
        close_button.click()

    def is_image_dialog_visible(self):
        return self.is_element_visible(*ProfilePageLocators.IMAGE_SIZE_DIALOG)

    def is_image_dialog_disappeared(self):
        return self.is_element_disappeared(*ProfilePageLocators.IMAGE_SIZE_DIALOG)

    @allure.step("clicking profile skills tab button")
    def profile_skills_button_click(self):
        button = self.browser.find_element(*ProfilePageLocators.PROFILE_SKILLS_BUTTON)
        button.click()

    @allure.step("clicking profile teams tab button")
    def profile_teams_button_click(self):
        button = self.browser.find_element(*ProfilePageLocators.PROFILE_TEAMS_BUTTON)
        button.click()

    @allure.step("clicking profile personal tab button")
    def profile_personal_button_click(self):
        button = self.browser.find_element(*ProfilePageLocators.PROFILE_PERSONAL_BUTTON)
        button.click()

    def is_personal_tab_visible(self):
        element = self.browser.find_element(*ProfilePageLocators.PROFILE_PERSONAL_BUTTON)
        return element.get_attribute("data-state") == 'active'

    def is_teams_tab_visible(self):
        element = self.browser.find_element(*ProfilePageLocators.PROFILE_TEAMS_BUTTON)
        return element.get_attribute("data-state") == 'active'

    def is_skills_tab_visible(self):
        element = self.browser.find_element(*ProfilePageLocators.PROFILE_SKILLS_TAB)
        return element.get_attribute("data-state") == 'active'

    def get_visible_email(self):
        email_div = self.browser.find_element(*ProfilePageLocators.PROFILE_VISIBLE_EMAIL)
        return email_div.text

    def get_visible_company_name(self):
        company_name_div = self.browser.find_element(*ProfilePageLocators.PROFILE_VISIBLE_COMPANY_NAME)
        return company_name_div.text

    def get_visible_user_name(self):
        username_and_surname = self.browser.find_element(*ProfilePageLocators.PROFILE_VISIBLE_NAME_AND_SURNAME)
        return username_and_surname.text.split(maxsplit=1)[0]

    def get_visible_user_surname(self):
        username_and_surname = self.browser.find_element(*ProfilePageLocators.PROFILE_VISIBLE_NAME_AND_SURNAME)
        return username_and_surname.text.split(maxsplit=1)[1]
