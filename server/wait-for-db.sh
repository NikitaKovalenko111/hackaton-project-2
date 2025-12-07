#!/bin/bash

until nc -z -v -w30 db 5432; do
  echo "Waiting for database connection..."
  sleep 1
done

echo "Database is up, running migration..."
npm run migration:run

npm run start:prod