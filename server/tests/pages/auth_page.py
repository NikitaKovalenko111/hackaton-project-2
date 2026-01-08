from .base_page import BasePage
from .locators import AuthPageLocators
import allure


class AuthPage(BasePage):
    def get_current_form(self):
        with allure.step("getting curent visible form"):
            return self.browser.find_element(*AuthPageLocators.LEFT_FORM)

    def go_to_auth_form(self):
        with allure.step("clicking to auth form button"):
            button = self.browser.find_element(*AuthPageLocators.GO_2_AUTH)
            button.click()

    def fill_name_field(self, name):
        with allure.step("send keys to name field"):
            field = self.browser.find_element(*AuthPageLocators.NAME_FIELD)
            field.send_keys(name)

    def fill_surname_field(self, surname):
        with allure.step("send keys to surname field"):
            field = self.browser.find_element(*AuthPageLocators.SURNAME_FIELD)
            field.send_keys(surname)

    def fill_log_in_email_field(self, email):
        with allure.step("send keys to email field"):
            field = self.browser.find_element(*AuthPageLocators.LOG_IN_EMAIL_FIELD)
            field.send_keys(email)

    def fill_log_in_password_field(self, password):
        with allure.step("send keys to password field"):
            field = self.browser.find_element(*AuthPageLocators.LOG_IN_PASSWORD_FIELD)
            field.send_keys(password)

    def fill_auth_email_field(self, email):
        with allure.step("send keys to email field"):
            field = self.browser.find_element(*AuthPageLocators.AUTH_EMAIL_FIELD)
            field.send_keys(email)

    def fill_auth_password_field(self, password):
        with allure.step("send keys to password field"):
            field = self.browser.find_element(*AuthPageLocators.AUTH_PASSWORD_FIELD)
            field.send_keys(password)

    def fill_auth_form(self, data):
        self.fill_name_field(data['name'])
        self.fill_surname_field(data['surname'])
        self.fill_auth_email_field(data['email'])
        self.fill_auth_password_field(data['password'])

    def log_in_button_click(self):
        with allure.step("clicking login button"):
            button = self.browser.find_element(*AuthPageLocators.LOG_IN_BUTTON)
            button.click()

    def auth_button_click(self):
        with allure.step("clicking authorisation button"):
            button = self.browser.find_elements(*AuthPageLocators.AUTH_BUTTON)[1]
            button.click()

