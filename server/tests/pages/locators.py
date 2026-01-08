from selenium.webdriver.common.by import By


class BaseLocators:
    LOGO_TEXT = (By.XPATH, "//p[text()='APC']")
    SKILLS_SETTING_LINK = (By.CSS_SELECTOR, '[data-testid="nav-link--skills-settings"]')
    EMPLOYEES_LINK = (By.CSS_SELECTOR, '[data-testid="nav-link--employees"]')
    TEAMS_LINK = (By.CSS_SELECTOR, '[data-testid="nav-link--teams"]')
    INTERVIEWS_LINK = (By.CSS_SELECTOR, '[data-testid="nav-link--interviews"]')
    SKILL_ORDERS_LINK = (By.CSS_SELECTOR, '[data-testid="nav-link--skill-orders"]')


class AuthPageLocators:
    LEFT_FORM = (By.CLASS_NAME, 'left-0')
    GO_2_AUTH = (By.XPATH, "//button[text()='Зарегистрироваться']")
    LOG_IN_EMAIL_FIELD = (By.ID, 'email')
    LOG_IN_PASSWORD_FIELD = (By.ID, 'password')
    AUTH_EMAIL_FIELD = (By.CSS_SELECTOR, '[data-testid="signup-email-input"]')
    AUTH_PASSWORD_FIELD = (By.CSS_SELECTOR, '[data-testid="signup-password-input"]')
    NAME_FIELD = (By.ID, 'name')
    SURNAME_FIELD = (By.ID, 'surname')
    STATUS_DIV = (By.CSS_SELECTOR, '[role="status"]')
    LOG_IN_BUTTON = (By.XPATH, "//button[text()='Войти']")
    AUTH_BUTTON = (By.XPATH, "//button[text()='Зарегистрироваться']")


class CompanyPageLocators:
    NO_COMPANY_LOG_OUT_BUTTON = (By.XPATH, "//button[text()='Выйти']")
    CREATE_COMPANY_BUTTON = (By.XPATH, "//button[text()='Создать компанию']")
    CREATE_COMPANY_BACK_BUTTON = (By.XPATH, "//button[text()='Назад']")
    CREATE_COMPANY_CONFIRM_BUTTON = (By.XPATH, "//button[text()='Создать']")
    CREATE_FORM = (By.CSS_SELECTOR, '[data-testid="create-company-form-container"]')
    MENU_CREATE = (By.CSS_SELECTOR, '.flex.flex-col.gap-5.absolute.top-25')
    COMPANY_NAME_INPUT = (By.ID, 'company_name_input')


class ProfilePageLocators(BaseLocators):
    LOGOUT_BUTTON = (By.XPATH, "//button[text()='Выйти']")
    LOAD_IMAGE_INPUT = (By.CSS_SELECTOR, '[type="file"')
    IMAGE_SIZE_DIALOG = (By.CSS_SELECTOR, '[role="dialog"]')
    RESIZE_IMAGE_BUTTON = (By.CSS_SELECTOR, '[role="dialog"] button')
    IMAGE_CONFIRM_BUTTON = (By.XPATH, "//button[text()='Сохранить']")
    IMAGE_DIALOG_CLOSE_BUTTON = (By.CSS_SELECTOR, '[data-slot="dialog-close"]')
    PROFILE_SKILLS_BUTTON = (By.CSS_SELECTOR, '[data-testid="profile-skills-tab"]')
    PROFILE_TEAMS_BUTTON = (By.CSS_SELECTOR, '[data-testid="profile-team-tab"]')
    PROFILE_PERSONAL_BUTTON = (By.CSS_SELECTOR, '[data-testid="profile-personal-tab"]')
    PROFILE_PERSONAL_TAB = (By.CSS_SELECTOR, '[id$="-personal"]')
    PROFILE_TEAMS_TAB = (By.CSS_SELECTOR, '[id$="-team"]')
    PROFILE_SKILLS_TAB = (By.CSS_SELECTOR, '[id$="-skills"]')
    PROFILE_VISIBLE_EMAIL = (By.CSS_SELECTOR, '.flex.items-center.gap-1:nth-of-type(1)')
    PROFILE_VISIBLE_COMPANY_NAME = (By.CSS_SELECTOR, '.flex.items-center.gap-1:nth-of-type(2)')
    PROFILE_VISIBLE_NAME_AND_SURNAME = (By.CSS_SELECTOR, '.text-2xl.font-bold')


class SkillsPageLocators:
    SEARCH_INPUT = (By.CSS_SELECTOR, '[data-testid="skills-search-input"]')
    SKILL_ADD_BUTTON = (By.CSS_SELECTOR, '[data-testid="skills-add-button"]')
    CREATE_SKILL_DIALOG = (By.CSS_SELECTOR, '[data-testid="create-skill-dialog"]')
    DIALOG_CLOSE_BUTTON = (By.CSS_SELECTOR, '[data-slot="dialog-close"]')
    SKILL_NAME_INPUT = (By.ID, 'name')
    SKILL_DESC_INPUT = (By.ID, 'desc')
    DIALOG_CANCEL_BUTTON = (By.CSS_SELECTOR, '[data-testid="create-skill-cancel-button"]')
    DIALOG_SUBMIT_BUTTON = (By.CSS_SELECTOR, '[data-testid="create-skill-submit-button"]')
    DESC_SORT_BUTTON = (By.CSS_SELECTOR, '[data-slot="button"]:nth-of-type(2)')
    PAGINATE_BACK_BUTTON = (By.CSS_SELECTOR, '[data-testid="skills-table-previous-button"]')
    PAGINATE_FORWARD_BUTTON = (By.CSS_SELECTOR, '[data-testid="skills-table-next-button"]')
    SKILL_ITEM_NAME = (By.CSS_SELECTOR, '.text-center.capitalize')
    SKILL_ITEM_DESC = (By.CSS_SELECTOR, '.text-center.lowercase')
    SKILL_ITEM_DELETE_BUTTON = (By.CSS_SELECTOR, '[data-testid^="skill-delete-button"]')
    TABLE_ROW = (By.CSS_SELECTOR, '[data-slot="table-row"]')
    NOTIFICATION = (By.CSS_SELECTOR, '[role="status"]')
    CONFIRM_DELETE_SKILL_DIALOG = (By.CSS_SELECTOR, '[data-testid="confirm-delete-skill-dialog"]')
    DELETE_DIALOG_CLOSE_BUTTON = (By.XPATH, '(//*[@data-slot="dialog-close"])[2]')
    DELETE_DIALOG_NO_BUTTON = (By.CSS_SELECTOR, '[data-testid="confirm-delete-skill-cancel"]')
    DELETE_DIALOG_YES_BUTTON = (By.CSS_SELECTOR, '[data-testid="confirm-delete-skill-confirm"]')


class SkillDetailedPageLocators:
    ADD_BUTTON = (By.CSS_SELECTOR, "path[d='M12 5v14']")
    REMOVE_BUTTON = (By.CSS_SELECTOR, '[d="M5 12h14"]')
    EMPLOYEE_NAME_CEIL = (By.CSS_SELECTOR, '.capitalize')
    EMPLOYEE_ROLE_NAME = (By.CSS_SELECTOR, '[data-slot="badge"]')



