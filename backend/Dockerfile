FROM python:3.10 AS builder

WORKDIR /app

RUN pip install poetry

COPY poetry.lock pyproject.toml ./

RUN poetry install --no-dev

RUN poetry export -o requirements.txt

FROM python:3.10

WORKDIR /app

COPY --from=builder /app/requirements.txt .

RUN pip install -r requirements.txt

COPY . .

ENTRYPOINT ["./entrypoint.sh"]

CMD ["gunicorn", "-b", "0.0.0.0:8080", "--reload", "app:create_app()"]
