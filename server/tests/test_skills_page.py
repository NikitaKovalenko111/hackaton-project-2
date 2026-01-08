import os
import allure

import pytest
from dotenv import load_dotenv

from .pages.skills_page import SkillsPage
from .testing_data import (valid_skill_name, valid_skill_desc,
                           invalid_skill_names, invalid_skill_descs)

load_dotenv()
base_url = os.getenv('FRONTEND_ORIGIN')
profile_link = base_url + '/profile'
skills_link = base_url + '/skills-settings'


def add_skill(page, skill_name=valid_skill_name, skill_desc=valid_skill_desc):
    page.skill_add_button_click()
    page.fill_skill_name_input(skill_name)
    page.fill_skill_desc_input(skill_desc)
    page.dialog_submit_button_click()
    page.wait_skill_quantity_changed(page.get_skill_items_quantity())


@pytest.fixture
def page(user_with_company_browser):
    page = SkillsPage(user_with_company_browser)
    page.open(profile_link)
    page.wait_page_load()
    page.open(skills_link)
    return page


@allure.feature("Skill creation")
class TestSkillCreationDialog:
    def test_dialog_visible_after_add_skill_button_clicked(self, page):
        page.skill_add_button_click()
        with allure.step("checking skill creation dialog visible"):
            assert page.is_skill_dialog_visible(), \
                "skill add dialog isn't visible after add skill button clicked"

    def test_dialog_disappears_after_close_button_clicked(self, page):
        page.skill_add_button_click()
        page.dialog_close_button_click()
        with allure.step("checking skill creation dialog disappeared"):
            assert page.is_skill_dialog_disappeared(), \
                "skill add dialog is visible after close button clicked"

    def test_dialog_disappears_after_cancel_button_clicked(self, page):
        page.skill_add_button_click()
        page.dialog_cancel_button_click()
        with allure.step("checking skill creation dialog disappeared"):
            assert page.is_skill_dialog_disappeared(), \
                "skill add dialog is visible after cancel button clicked"

    def test_dialog_disappears_after_submit_button_clicked(self, page, fresh_state):
        add_skill(page)
        with allure.step("checking skill creation dialog disappeared"):
            assert page.is_skill_dialog_disappeared(), \
                "skill add dialog is visible after cancel button clicked"

    def test_user_can_add_skill(self, page, fresh_state):
        skill_items_quantity = page.get_skill_items_quantity()
        add_skill(page, valid_skill_name, valid_skill_desc)
        with allure.step("checking quantity of skills in tab had increased"):
            assert page.get_skill_items_quantity() == skill_items_quantity + 1, \
                "no unit was added to the skill table"

    def test_user_see_notification_after_adding_skill(self, page, fresh_state):
        add_skill(page)
        with allure.step("checking notification visible"):
            assert page.is_notification_visible(), \
                "notification isn't visible after user added skill"
        with allure.step("checking text of notification"):
            assert page.get_notification_text() == "Компетенция добавлена!", \
                "notification text isn't success"

    def test_added_skill_name_matches_with_testing_data(self, page, fresh_state):
        add_skill(page)
        with allure.step("checking name of added skill matching with testing value"):
            assert page.get_last_skill_item_name() == valid_skill_name, \
                "added skill name don't match with test data"

    def test_added_skill_desc_matches_with_testing_data(self, page, fresh_state):
        add_skill(page)
        with allure.step("checking description of added skill matching with testing value"):
            assert page.get_last_skill_item_desc() == valid_skill_desc, \
                "added skill desc don't match with test data"

    def test_user_cant_create_skills_with_equal_name(self, fresh_state, page):
        add_skill(page)
        initial = page.get_skill_items_quantity()
        add_skill(page)
        page.wait_notification_disappeared()
        with allure.step("checking quantity of skills in tab didn't changed"):
            assert page.get_skill_items_quantity() == initial, \
                "user can create skills with equal name"

    @pytest.mark.parametrize('name', invalid_skill_names)
    def test_user_cant_create_skill_with_invalid_name(self, page, name, fresh_state):
        initial = page.get_skill_items_quantity()
        add_skill(page=page, skill_name=name)
        with allure.step("checking quantity of skills in tab didn't changed"):
            assert page.get_skill_items_quantity() == initial, \
                "user can create skills with invalid name"

    @pytest.mark.parametrize('desc', invalid_skill_descs)
    def test_user_cant_create_skill_with_invalid_desc(self, page, desc, fresh_state):
        initial = page.get_skill_items_quantity()
        add_skill(page=page, skill_desc=desc)
        with allure.step("checking quantity of skills in tab didn't changed"):
            assert page.get_skill_items_quantity() == initial, \
                "user can create skills with invalid description"


@allure.feature("skill deleting")
class TestDeleteSkillDialog:
    def test_delete_dialog_visible_after_delete_button_clicked(self, page):
        page.last_skill_item_delete_button_click()
        with allure.step("checking delete dialog visible"):
            assert page.is_delete_dialog_visible(), \
                "delete dialog isn't visible after add delete button clicked"

    def test_delete_dialog_disappears_after_close_button_clicked(self, page):
        page.last_skill_item_delete_button_click()
        page.delete_dialog_close_button_click()
        with allure.step("checking delete dialog disappeared"):
            assert page.is_delete_dialog_disappeared(), \
                "delete dialog is visible after close button clicked"

    def test_delete_dialog_disappears_after_reject_button_clicked(self, page):
        page.last_skill_item_delete_button_click()
        page.delete_dialog_no_button_click()
        with allure.step("checking delete dialog disappeared"):
            assert page.is_delete_dialog_disappeared(), \
                "delete dialog is visible after no button clicked"

    def test_user_can_delete_skill(self, page, fresh_state):
        add_skill(page)
        initial_quantity = page.get_skill_items_quantity()
        page.last_skill_item_delete_button_click()
        page.delete_dialog_yes_button_click()
        page.wait_skill_quantity_changed(initial_quantity)
        with allure.step("checking quantity of items in tab had decreased"):
            assert page.get_skill_items_quantity() == initial_quantity - 1, \
                "unit was not deleted from list after user deleted it"

    def test_user_see_notification_after_deleting_skill(self, page, fresh_state):
        add_skill(page)
        page.wait_notification_disappeared()
        page.last_skill_item_delete_button_click()
        page.delete_dialog_yes_button_click()
        with allure.step("checking notification visible"):
            assert page.is_notification_visible(), \
                "notification isn't visible after user deleted skill"

        with allure.step("checking text of notification"):
            assert page.get_notification_text() == "Компетенция удалена из компании!", \
                "notification text isn't success"


@allure.feature("skill searching")
class TestSkillSearching:
    def test_one_skill_appears_after_searching(self, page, fresh_state):
        add_skill(page)
        page.fill_search_skill_input(valid_skill_name)
        with allure.step("checking quantity of items in tab is 1"):
            assert page.get_skill_items_quantity() == 1, \
                "items quantity after searching isn't 1"

    def test_two_skills_appears_after_partial_search(self, page, fresh_state):
        add_skill(page)
        add_skill(page, skill_name=valid_skill_name+'-1')
        page.fill_search_skill_input(valid_skill_name[1:-1])
        with allure.step("checking quantity of items in tab is 2"):
            assert page.get_skill_items_quantity() == 2, \
                "items quantity after partial searching should be 2"


@allure.feature("skills tab pagination")
class TestSkillsPagination:
    @pytest.fixture(autouse=True)
    def setup(self, fresh_state, user_with_company_with_many_skills, page):
        self.page = page

    def test_user_can_go_next_skills_page(self):
        with allure.step("checking next page button clickable"):
            assert self.page.is_paginate_forward_button_clickable(), \
                "user cant go to next skills page"

    def test_user_cant_go_previous_skills_page(self):
        with allure.step("checking previous page button clickable"):
            assert self.page.is_paginate_back_button_clickable() is False, \
                "user can go to previous skills page, but should not"

    def test_all_paginate_button_clickable_after_user_go_to_second_skills_page(self):
        self.page.paginate_forward_button_click()
        with allure.step("checking next page button clickable"):
            assert self.page.is_paginate_forward_button_clickable(), \
                "user cant go to next skills page in second page"

        with allure.step("checking previous page button clickable"):
            assert self.page.is_paginate_back_button_clickable(), \
                "user cant go to previous skills page in second page"

    def test_information_changing_after_next_button_clicked(self):
        initial_first_skill_name = self.page.get_first_skill_item_name()
        self.page.paginate_forward_button_click()
        with allure.step("checking current first item name don't match with previous first item name"):
            assert self.page.get_first_skill_item_name() != initial_first_skill_name, \
                "first skill didn't changed after next page button clicked"

    def test_skills_page_changing_after_sort_button_clicked(self):
        initial_first_skill_name = self.page.get_first_skill_item_name()
        self.page.desc_sort_button_click()
        with allure.step("checking current first item description don't match with previous first item description"):
            assert self.page.get_first_skill_item_name() != initial_first_skill_name, \
                "first skill didn't changed after sort page button clicked"

