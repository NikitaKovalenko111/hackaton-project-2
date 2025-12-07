FROM python:3.12-slim

WORKDIR /telegram_bot

COPY requirements.txt requirements.txt
RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "main.py"]