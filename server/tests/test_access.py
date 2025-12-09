import pytest
from selenium.webdriver import Chrome
from time import sleep


need_to_be_authorized_pages = ['profile', 'skills-settings', 'employees',
                               'teams', 'interviews', 'skill-orders']

@pytest.mark.parametrize('page', need_to_be_authorized_pages)
def test_guest_cant_go_to_main_pages(browser: Chrome, page: str):
    base_url = 'http://localhost:3000/'
    page_url = base_url + page
    browser.get(page_url)
    assert 'auth' in browser.current_url, f'guest can go to {page} page'

def test_user_cant_go_to_auth_page(auth_browser):
    base_url = 'http://localhost:3000/'
    page_url = base_url + 'auth'
    auth_browser.get(page_url)
    assert '/auth' not in auth_browser.current_url, f'user can go to auth page'
