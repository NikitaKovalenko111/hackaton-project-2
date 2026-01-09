from selenium.common import TimeoutException

from .base_page import BaseMainPage
from .locators import SkillsPageLocators
from selenium.webdriver.support.ui import WebDriverWait
import allure


class SkillsPage(BaseMainPage):
    @allure.step("clicking skill add button")
    def skill_add_button_click(self):
        button = self.browser.find_element(*SkillsPageLocators.SKILL_ADD_BUTTON)
        button.click()

    def is_skill_dialog_visible(self):
        return self.is_element_visible(*SkillsPageLocators.CREATE_SKILL_DIALOG)

    def is_skill_dialog_disappeared(self):
        return self.is_element_disappeared(*SkillsPageLocators.CREATE_SKILL_DIALOG)

    def is_delete_dialog_visible(self):
        return self.is_element_visible(*SkillsPageLocators.CONFIRM_DELETE_SKILL_DIALOG)

    def is_delete_dialog_disappeared(self):
        return self.is_element_disappeared(*SkillsPageLocators.CONFIRM_DELETE_SKILL_DIALOG)

    @allure.step("send keys to skill name field")
    def fill_skill_name_input(self, value):
        field = self.browser.find_element(*SkillsPageLocators.SKILL_NAME_INPUT)
        field.send_keys(value)

    @allure.step("send keys to skill description field")
    def fill_skill_desc_input(self, value):
        field = self.browser.find_element(*SkillsPageLocators.SKILL_DESC_INPUT)
        field.send_keys(value)

    @allure.step("send keys to search skill field")
    def fill_search_skill_input(self, value):
        field = self.browser.find_element(*SkillsPageLocators.SEARCH_INPUT)
        field.send_keys(value)
        self.wait_skill_quantity_changed(self.get_skill_items_quantity())

    @allure.step("clicking dialog submit button")
    def dialog_submit_button_click(self):
        button = self.browser.find_element(*SkillsPageLocators.DIALOG_SUBMIT_BUTTON)
        button.click()

    @allure.step("clicking dialog close button")
    def dialog_close_button_click(self):
        button = self.browser.find_element(*SkillsPageLocators.DIALOG_CLOSE_BUTTON)
        button.click()

    @allure.step("clicking dialog cancel button")
    def dialog_cancel_button_click(self):
        button = self.browser.find_element(*SkillsPageLocators.DIALOG_CANCEL_BUTTON)
        button.click()

    @allure.step("clicking dialog close button")
    def delete_dialog_close_button_click(self):
        button = self.browser.find_element(*SkillsPageLocators.DELETE_DIALOG_CLOSE_BUTTON)
        button.click()

    @allure.step("clicking dialog reject button")
    def delete_dialog_no_button_click(self):
        button = self.browser.find_element(*SkillsPageLocators.DELETE_DIALOG_NO_BUTTON)
        button.click()

    @allure.step("clicking dialog accept button")
    def delete_dialog_yes_button_click(self):
        button = self.browser.find_element(*SkillsPageLocators.DELETE_DIALOG_YES_BUTTON)
        button.click()

    @allure.step("clicking sort by description button")
    def desc_sort_button_click(self):
        button = self.browser.find_element(*SkillsPageLocators.DESC_SORT_BUTTON)
        button.click()

    @allure.step("clicking last (lowest) item delete button")
    def last_skill_item_delete_button_click(self):
        button = self.browser.find_elements(*SkillsPageLocators.SKILL_ITEM_DELETE_BUTTON)[-1]
        button.click()

    @allure.step("clicking previous page button")
    def paginate_back_button_click(self):
        button = self.browser.find_element(*SkillsPageLocators.PAGINATE_BACK_BUTTON)
        button.click()

    @allure.step("clicking next page button")
    def paginate_forward_button_click(self):
        button = self.browser.find_element(*SkillsPageLocators.PAGINATE_FORWARD_BUTTON)
        button.click()

    def get_last_skill_item_name(self):
        item = self.browser.find_elements(*SkillsPageLocators.SKILL_ITEM_NAME)[-1]
        return item.text

    def get_last_skill_item_desc(self):
        item = self.browser.find_elements(*SkillsPageLocators.SKILL_ITEM_DESC)[-1]
        return item.text

    def get_first_skill_item_name(self):
        item = self.browser.find_element(*SkillsPageLocators.SKILL_ITEM_NAME)
        return item.text

    def get_first_skill_item_desc(self):
        item = self.browser.find_element(*SkillsPageLocators.SKILL_ITEM_DESC)
        return item.text

    def get_skill_items_quantity(self):
        items = self.browser.find_elements(*SkillsPageLocators.TABLE_ROW)
        return len(items)-1

    @allure.step("waiting skill quantity changed")
    def wait_skill_quantity_changed(self, initial_quantity):
        print("initial", initial_quantity)
        def condition(driver):
            return self.get_skill_items_quantity() != initial_quantity and self.get_last_skill_item_name() != ''

        try:
            WebDriverWait(self.browser, 3).until(condition)
            print("then", self.get_skill_items_quantity())
            return True
        except TimeoutException:
            return False

    def is_notification_visible(self):
        return self.is_element_visible(*SkillsPageLocators.NOTIFICATION)

    def get_notification_text(self):
        notification = self.browser.find_element(*SkillsPageLocators.NOTIFICATION)
        return notification.text

    @allure.step("waiting notification disappeared")
    def wait_notification_disappeared(self):
        self.is_element_disappeared(*SkillsPageLocators.NOTIFICATION)

    def is_paginate_forward_button_clickable(self):
        button = self.browser.find_element(*SkillsPageLocators.PAGINATE_FORWARD_BUTTON)
        return button.is_enabled()

    def is_paginate_back_button_clickable(self):
        button = self.browser.find_element(*SkillsPageLocators.PAGINATE_BACK_BUTTON)
        return button.is_enabled()

