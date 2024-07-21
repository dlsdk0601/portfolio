FROM ubuntu:22.04

# 시간대 한국
ENV TZ=Asia/Seoul
ENV PGTZ=$TZ
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# node.js 운영
ENV NODE_ENV=production


# next.js 운영
ENV NEXT_PUBLIC_BASE_URL='' NEXT_PUBLIC_API_DELAY='0'

# APT 바이너리 유지하도록, 클린업 삭제
RUN rm /etc/apt/apt.conf.d/docker-clean

# proxy 설정
ARG NO_PROXY=''
ENV NO_PROXY=$NO_PROXY

# 빌드 시스템 설치
RUN --mount=target=/var/lib/apt/lists,type=cache \
    --mount=target=/var/cache/apt,type=cache \
    --mount=target=/root/.npm,type=cache \
    --mount=target=/root/.cache,type=cache \
    --mount=target=/download,type=cache

RUN <<EOF
#!/bin/bash
set -euxo pipefail
apt-get -y update

# python 그 외
apt-get update -y && \
apt-get install -y ca-certificates curl gnupg unzip python3.11 python3.11-venv python3.11-dev python3.11-distutils build-essential libpcre2-dev

# bun
curl -fsSL https://bun.sh/install | bash
echo 'export BUN_INSTALL="$HOME/.bun"' | tee -a /root/.bashrc /root/.profile
echo 'export PATH="$BUN_INSTALL/bin:$PATH"' | tee -a /root/.bashrc /root/.profile
EOF

# Bun 설치 경로를 환경 변수로 설정
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

COPY . /app
WORKDIR /app

RUN --mount=target=/root/.npm,type=cache \
    --mount=target=/root/.cache,type=cache \
    --mount=target=/root/.pub-cahce,type=cache

RUN <<EOF
#!/bin/bash
set -euxo pipefail

# front / admin package install
(cd /app/admin && bun i)
(cd /app/front && bun i)

# python 준비
cd /app/server
python3.11 -m venv venv
venv/bin/pip install -e .
venv/bin/pip install wheel==0.42.0
venv/bin/pip install uwsgi==2.0.25.1

# api schema generate
venv/bin/python bin/generate_ts_schema.py
venv/bin/python bin/generate_ts_api.py sf | venv/bin/python bin/tee.py ../admin/src/api/api.g.ts
venv/bin/python bin/generate_ts_api.py front | venv/bin/python bin/tee.py ../front/src/api/api.g.ts

# admin build
(cd /app/admin && bun bin/generateUrl.ts && bun run build)

# front build
(cd /app/front && bun bin/generateUrl.ts && bun run build)

EOF

CMD ./serve.sh
