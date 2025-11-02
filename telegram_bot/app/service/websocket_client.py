import socketio
from aiogram import Bot

import os, sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from config import BOT_TOKEN, WS_URL


class WebSocketClient:
    def __init__(self):
        self.sio = socketio.AsyncClient()
        self.is_connected = False
        self.bot = Bot(token=BOT_TOKEN)
        self.telegram_id = None
        self.sio.on('newRequest', self._new_request)
        self.sio.on('canceledRequest', self._cancel_request)
        self.sio.on('completedRequest', self._complete_request)

    async def connect(self, telegram_id: int, employee_data: dict):
        """Подключение к Socket.IO серверу только для newRequest"""
        try:
            if self.is_connected:
                await self.disconnect()
                print("🔌 Предыдущее подключение отключено")
            self.telegram_id = telegram_id

            print(f"🔌 Подключаюсь к Socket.IO...")
            print(WS_URL)

            # Подключаемся с аутентификацией
            await self.sio.connect(
                WS_URL,
                headers={
                    "client_type": "telegram",
                    "telegram_id": str(telegram_id)
                }
            )
            self.is_connected = True

            print("✅ Успешно подключился к Socket.IO")
            await self._send_telegram_message("🔌 Подключен к системе уведомлений")

        except Exception as e:
            print(f"❌ Ошибка подключения к Socket.IO: {e}")
            self.is_connected = False
            await self._send_telegram_message(f"❌ Ошибка подключения, причина: {e}")

    async def _send_telegram_message(self, text: str):
        """Отправка сообщения в Telegram"""
        try:
            if self.telegram_id:
                await self.bot.send_message(self.telegram_id, text,  parse_mode="HTML")
        except Exception as e:
            print(f"❌ Ошибка отправки сообщения в Telegram: {e}")

    async def _new_request(self, data: dict):
        """Обработка нового запроса"""
        request_info = (
            "❗️ Новый запрос "
            f"№ {data.get('request_id', 'N/A')}\n"
            f"📋Тип: {'повышение компетенции' if data.get('request_type') == 'upgrade' else data.get('request_type', 'N/A')}\n"
            f"📊Статус: {data.get('request_status', 'N/A')}\n"
            f"📅Дата: {data.get('request_date', 'N/A').split('T')[0]}\n"
            f"👤Отправитель: {data.get('request_owner', {}).get('employee_name', 'N/A')} {data.get('request_owner', {}).get('employee_surname', 'N/A')}"
        )
        await self._send_telegram_message(request_info)

    async def _cancel_request(self, data: dict):
        """Сообщение об отмен запроса"""
        request_info = (
            f"❗️ Запрос № {data.get('request_id', 'N/A')} <b>отменен</b>\n"
            f"📋Тип: {'повышение компетенции' if data.get('request_type') == 'upgrade' else data.get('request_type', 'N/A')}\n"
            f"📊Статус: {data.get('request_status', 'N/A')}\n"
            f"📅Дата: {data.get('request_date', 'N/A').split('T')[0]}\n"
            f"👤Отправитель: {data.get('request_owner', {}).get('employee_name', 'N/A')} {data.get('request_owner', {}).get('employee_surname', 'N/A')}"
        )
        await self._send_telegram_message(request_info)

    async def _complete_request(self, data: dict):
        """Сообщение, что запррс выполнен"""
        request_info = (
            f"❗️ Запрос № {data.get('request_id', 'N/A')} <b>одобрен</b>\n"
            f"📋Тип: {'повышение компетенции' if data.get('request_type') == 'upgrade' else data.get('request_type', 'N/A')}\n"
            f"📊Статус: {data.get('request_status', 'N/A')}\n"
            f"📅Дата: {data.get('request_date', 'N/A').split('T')[0]}\n"
            f"👤Отправитель: {data.get('request_owner', {}).get('employee_name', 'N/A')} {data.get('request_owner', {}).get('employee_surname', 'N/A')}"
        )
        await self._send_telegram_message(request_info)

    async def disconnect(self):
        """Отключение от Socket.IO"""
        if self.sio.connected:
            await self.sio.disconnect()
            self.is_connected = False
            self.telegram_id = None
            print("🔌 Отключился от Socket.IO")

    async def disconnect_user(self, telegram_id: int):
        """Отключение конкретного пользователя"""
        if self.is_connected and self.telegram_id == telegram_id:
            await self.disconnect()

websocket_client = WebSocketClient()
