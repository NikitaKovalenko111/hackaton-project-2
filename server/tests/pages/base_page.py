from selenium.webdriver import Chrome
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from .locators import BaseLocators
import allure


class BasePage():
    def __init__(self, browser: Chrome, timeout=10):
        self.browser = browser
        self.browser.implicitly_wait(timeout)

    def open(self, url):
        with allure.step("opening page"):
            self.browser.get(url)

    def is_user_authorised(self):
        if self.browser.get_cookie('accessToken'):
            return True
        return False

    def is_element_present(self, by, selector):
        try:
            self.browser.find_element(by, selector)
        except NoSuchElementException:
            return False
        return True

    def is_element_disappeared(self, by, selector):
        try:
            WebDriverWait(self.browser, 5).until_not(
                EC.visibility_of_element_located((by, selector))
            )
            return True

        except TimeoutException:
            return False

    def is_element_visible(self, by, selector):
        try:
            element = WebDriverWait(self.browser, 3).until(
                EC.visibility_of_element_located((by, selector))
            )
            return True
        except TimeoutException:
            return False

    def is_url_have(self, text, timeout=5):
        """Ожидает, что URL содержит указанный текст"""
        try:
            WebDriverWait(self.browser, timeout).until(
                EC.url_contains(text)
            )
            return True
        except TimeoutException:
            return False


class BaseMainPage(BasePage):
    def wait_page_load(self):
        self.is_element_present(*BaseLocators.SKILLS_SETTING_LINK)

    def skills_setting_button_click(self):
        button = self.browser.find_element(*BaseLocators.SKILLS_SETTING_LINK)
        button.click()

    def teams_button_click(self):
        button = self.browser.find_element(*BaseLocators.TEAMS_LINK)
        button.click()

    def interviews_button_click(self):
        button = self.browser.find_element(*BaseLocators.INTERVIEWS_LINK)
        button.click()

    def employees_button_click(self):
        button = self.browser.find_element(*BaseLocators.EMPLOYEES_LINK)
        button.click()

    def skill_order_button_click(self):
        button = self.browser.find_element(*BaseLocators.SKILL_ORDERS_LINK)
        button.click()

