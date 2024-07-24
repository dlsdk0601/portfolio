#!/bin/bash

set -euxo pepefail

PORT=${PORT:-5000}
NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL:-}

(cd server && venv/bin/alembic upgrade head)

(cd admin && bun run start -- --port 3001 &)
(cd front && bun run start -- --port 3000 &)

PROCESSED=$(expr "$(nproc)" \* 2 + 1)

cd server && \
venv/bin/uwsgi \
  --master \
  --processed "$PROCESSED" \
  --http-socket "0.0.0.0:$PORT" \
  --enable-threads \
  --single-interpreter \
  --ignore-sigpipe \
  --ignore-write-errors \
  --disable-write-exception \
  --log-x-forwareded-for \
  --wsgi-file /app/server/was/main.pu \
  --callable app \
  --route '^/sf http:127.0.0.1:3001' \
  --route '^(/|/[^-].*)$ http:127.0.0.1:3000' &


wait -n
