from .base_page import BasePage
from .locators import AuthPageLocators
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class AuthPage(BasePage):
    def get_current_form(self):
        return self.browser.find_element(*AuthPageLocators.LEFT_FORM)

    def go_to_auth_form(self):
        button = self.browser.find_element(*AuthPageLocators.GO_2_AUTH)
        button.click()

    def fill_name_field(self, name):
        field = self.browser.find_element(*AuthPageLocators.NAME_FIELD)
        field.send_keys(name)

    def fill_surname_field(self, surname):
        field = self.browser.find_element(*AuthPageLocators.SURNAME_FIELD)
        field.send_keys(surname)

    def fill_log_in_email_field(self, email):
        field = self.browser.find_element(*AuthPageLocators.LOG_IN_EMAIL_FIELD)
        field.send_keys(email)

    def fill_log_in_password_field(self, password):
        field = self.browser.find_element(*AuthPageLocators.LOG_IN_PASSWORD_FIELD)
        field.send_keys(password)

    def fill_auth_email_field(self, email):
        field = self.browser.find_element(*AuthPageLocators.AUTH_EMAIL_FIELD)
        field.send_keys(email)

    def fill_auth_password_field(self, password):
        field = self.browser.find_element(*AuthPageLocators.AUTH_PASSWORD_FIELD)
        field.send_keys(password)

    def log_in_button_click(self):
        button = self.browser.find_element(*AuthPageLocators.LOG_IN_BUTTON)
        button.click()

    def auth_button_click(self):
        button = self.browser.find_elements(*AuthPageLocators.AUTH_BUTTON)[1]
        button.click()


    def get_status(self):
        try:
            status = WebDriverWait(self.browser, 10).until(
                EC.visibility_of_element_located(AuthPageLocators.STATUS_DIV)
            )
            return status.text
        except:
            return False

