from .base_page import BasePage
from .locators import CompanyPageLocators
import allure


class CompanyPage(BasePage):
    def click_no_company_log_out_button(self):
        with allure.step("clicking logout button"):
            but = self.browser.find_element(*CompanyPageLocators.NO_COMPANY_LOG_OUT_BUTTON)
            but.click()

    def click_create_company_button(self):
        with allure.step("clicking create company button"):
            but = self.browser.find_element(*CompanyPageLocators.CREATE_COMPANY_BUTTON)
            but.click()

    def click_create_company_back_button(self):
        with allure.step("clicking back to menu button "):
            but = self.browser.find_element(*CompanyPageLocators.CREATE_COMPANY_BACK_BUTTON)
            but.click()

    def click_create_company_confirm_button(self):
        with allure.step("clicking create company confirm button"):
            but = self.browser.find_element(*CompanyPageLocators.CREATE_COMPANY_CONFIRM_BUTTON)
            but.click()

    def is_form_disappeared(self):
        return self.is_element_disappeared(*CompanyPageLocators.CREATE_FORM)

    def is_menu_disappeared(self):
        return self.is_element_disappeared(*CompanyPageLocators.MENU_CREATE)

    def is_form_visible(self):
        return self.is_element_visible(*CompanyPageLocators.CREATE_FORM)

    def is_menu_visible(self):
        return self.is_element_visible(*CompanyPageLocators.MENU_CREATE)

    def fill_form(self, company_name):
        with allure.step("send keys to company name field"):
            field = self.browser.find_element(*CompanyPageLocators.COMPANY_NAME_INPUT)
            field.send_keys(company_name)
