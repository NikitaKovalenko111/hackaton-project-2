from selenium.webdriver.common.by import By


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

