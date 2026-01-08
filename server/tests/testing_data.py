LONG_STRING = 'a' * 1000

invalid_emails = ['invalid@', 'invalid@mail', '@mail', '@mail.ru',
                  ' ', '', LONG_STRING + 'google.com', "invalid@.com",
                  'invalid@@gmail.com']
valid_emails = ['test@example.com', 'user.name@mail.ru', 'user-name@domain.org',
                'user123@sub.domain.com']

invalid_passwords = ['123', LONG_STRING, '']
invalid_names = [' ', '', LONG_STRING, "@#$%", '1']
valid_names = ['Иван', 'Ivan', 'Jean-Pierre']
invalid_surnames = [' ', '', LONG_STRING, "@#$%", '1']
valid_surnames = ['иванов', 'Ivanov', 'Van-Damme']

invalid_company_names = [LONG_STRING, '', ' ', '@#$%']
valid_company_names = ['company', 'компания', '1', 'компания-другая',
                      'name with space']

invalid_auth_data = {
    "name": invalid_names,
    "surname": invalid_surnames,
    "email": invalid_emails,
    "password": invalid_passwords
}

valid_auth_data = {
    "name": valid_names,
    "surname": valid_surnames,
    "email": valid_emails,
}

invalid_auth_data_tuples = [(field, value) for field, values in invalid_auth_data.items()
                            for value in values]

valid_auth_data_tuples = [(field, value) for field, values in valid_auth_data.items()
                          for value in values]


user_no_company_data = {
        "employee_name": "test",
        "employee_surname": "testov",
        "employee_email": "testing@gmail.com",
        "employee_password": "difficultpassword"
    }

user_with_company_data = {
        "employee_name": "test1",
        "employee_surname": "testov1",
        "employee_email": "testing1@gmail.com",
        "employee_password": "difficultpassword"
    }
test_company_name = "testing company"

test_skill_name = 'Test'
test_skill_desc = 'test description'
valid_skill_name = "Python"
valid_skill_desc = "ability to use a python language"

invalid_skill_names = ['', ' ', LONG_STRING]
invalid_skill_descs = ['', ' ', LONG_STRING]
