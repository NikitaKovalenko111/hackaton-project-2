from aiogram import Router, types
from aiogram.filters import CommandStart, Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
import sys
import os
import aiohttp
import asyncio

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from config import API_URL
from app.service.websocket_client import websocket_client
API_URL += "employee/authorization/telegram"

class AuthStates(StatesGroup):
    waiting_for_email = State()
    waiting_for_password = State()

authorized_users = {}

async def send_to_server(user_data: dict, password: str) -> dict:
    """Отправка данных на сервер"""
    try:
        data = {
            "employee_email": user_data['email'],
            "employee_password": password,
            "tg_id": user_data['tg_id']
        }

        print(f"📤 Отправка данных на сервер: {data}")

        async with aiohttp.ClientSession() as session:
            async with session.post(
                    API_URL,
                    json=data,
                    headers={"Content-Type": "application/json"}
            ) as response:

                print(f"📡 Ответ сервера: {response.status}")

                if (response.status in [200, 201]):
                    response_data = await response.json()
                    print("✅ Данные успешно получены от сервера")
                    print(response_data)
                    authorized_users[user_data['tg_id']] = response_data
                    asyncio.create_task(websocket_client.connect(user_data['tg_id'], response_data))
                    return {"success": True, "data": response_data}
                else:
                    error_text = await response.text()
                    print(f"❌ Ошибка сервера: {response.status} - {error_text}")
                    return {"success": False, "error": f"Ошибка {response.status}"}

    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
        return {"success": False, "error": f"Ошибка подключения"}


router = Router()


@router.message(CommandStart())
async def cmd_start(message: types.Message, state: FSMContext):
    tg_id = message.from_user.id
    if tg_id in authorized_users:

        employee_data = authorized_users[tg_id]

        welcome_text = (
            "👋 <b>С возвращением!</b>\n\n"
            f"Вы уже авторизованы как:\n"
            f"👤 {employee_data.get('employee_name', 'N/A')} {employee_data.get('employee_surname', 'N/A')}\n"
            f"📧 {employee_data.get('employee_email', 'N/A')}\n\n"
            "Если хотите выйти из аккаунта, используйте /logout\n"
            "Или продолжите работу с ботом."
        )
        await message.answer(welcome_text)
        return
    await state.update_data(tg_id=message.from_user.id)
    welcome_text = (
        "👋 <b>Добро пожаловать!</b>\n\n"
        "Для начала работы необходимо выполнить авторизацию.\n"
        "Вам потребуется ввести почту и пароль от вашего аккаунта.\n\n"
        "🔐 <i>Ваши данные защищены и передаются безопасно</i>"
    )

    await message.answer(welcome_text)
    await message.answer("🎯 <b>Начнем</b>")
    await message.answer("📧 Введите вашу почту:")
    await state.set_state(AuthStates.waiting_for_email)


@router.message(AuthStates.waiting_for_email)
async def process_email(message: types.Message, state: FSMContext):
    await state.update_data(email=message.text)
    await message.answer("🔑 Введите ваш пароль:")
    await state.set_state(AuthStates.waiting_for_password)


@router.message(AuthStates.waiting_for_password)
async def process_password(message: types.Message, state: FSMContext):
    user_data = await state.get_data()
    print(user_data)
    result_text = (
        "✅ Полученные данные:\n\n"
        f"🆔 Telegram ID: {user_data['tg_id']}\n"
        f"📧 Email: {user_data['email']}\n"
        f"🔑 Пароль: {'*' * len(message.text)}"
    )
    await message.answer(result_text)
    result = await send_to_server(user_data, message.text)

    if result["success"] == True:
        employee_data = result["data"]
        response_text = (
            "✅ Авторизация успешна! 🎉\n\n"
            f"👤 Сотрудник: {employee_data.get('employee_name', 'N/A')} {employee_data.get('employee_surname', 'N/A')}\n"
            f"📧 Email: {employee_data.get('employee_email', 'N/A')}\n"
            f"🆔 ID: {employee_data.get('employee_id', 'N/A')}\n"
        )
        if employee_data.get("employee_status"):
            response_text += f"📊 Статус: {employee_data.get('employee_status', 'N/A')}\n"
        if employee_data.get('company'):
            response_text += f"🏢 Компания: {employee_data['company'].get('company_name', 'N/A')}\n"
        response_text += "🔌 Подключаюсь к системе уведомлений..."
        await message.answer(response_text)

    else:
        await message.answer("❌ Неверные данные. Попробуйте снова /start")
    await state.clear()

@router.message(Command("logout"))
async def cmd_logout(message: types.Message):
        tg_id = message.from_user.id
        if tg_id in authorized_users:
            await websocket_client.disconnect_user(tg_id)
            del authorized_users[tg_id]
            await message.answer("✅ Вы успешно вышли из системы. Для повторной авторизации используйте /start")
        else:
            await message.answer("❌ Вы не авторизованы. Используйте /start для авторизации")

