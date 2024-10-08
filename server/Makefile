open: setup
	nix-shell --run 'pycharm .'

setup: venv
	venv/bin/pip install pip==24.0
	venv/bin/pip install -e .

venv:
	nix-shell --run 'python3.11 -m venv venv'

watch: setup
	venv/bin/dmypy restart
# watchmedo 는 최초 1회 실행이 없어서 그냥 먼저 실행한다.
# 실행 과정에서 오류가 발생해도 그냥 무시한다. 어차피 계속 실행되어야 한다.
	-$(MAKE) watch-run
	venv/bin/watchmedo shell-command --patterns="*.py;*.ini;*.tsx" --recursive --ignore-directories --drop --command='echo ""; make watch-run' .

# 파일 저장할 때마다 타입 체크
watch-run: code-gen mypy-check

# mypy 타입 체크
mypy-check:
# daemon mypy 로 webapp, ex 아래 소스들 체크
	venv/bin/dmypy run -- was ex bin

code-gen:
	venv/bin/python bin/generate_ts_schema.py admin | venv/bin/python bin/tee.py ../admin/src/api/schema.g.ts
	venv/bin/python bin/generate_ts_schema.py front | venv/bin/python bin/tee.py ../front/src/api/schema.g.ts
	venv/bin/python bin/generate_ts_api.py admin | venv/bin/python bin/tee.py ../admin/src/api/api.g.ts
	venv/bin/python bin/generate_ts_api.py front | venv/bin/python bin/tee.py ../front/src/api/api.g.ts
	venv/bin/python bin/generate_api_dart.py | (type dart > /dev/null && dart format || cat) | venv/bin/python bin/tee.py ../portfolio_app/lib/api/api.gen.dart
	venv/bin/python bin/generate_api_dart_schema.py | (type dart > /dev/null && dart format || cat) | venv/bin/python bin/tee.py ../portfolio_app/lib/api/schema.gen.dart


# 개발용 테스트 데이터 DB 생성
faker-import:
	time venv/bin/python bin/faker_import.py

# 개발용 백그라운드 서비스 실행 (DB)
dev:
	docker compose up -d
	sleep 1

# 개발용 백그라운드 서비스 삭제 및 정리 (DB)
dev-clean:
	docker compose down -v --rmi local

dev-start: dev-clean dev

# 개발용 백그라운드 서비스 초기화 및 샐행 (DB, alembic)
dev-reinitialize: dev-start
	venv/bin/alembic upgrade head
	venv/bin/python bin/faker_import.py
