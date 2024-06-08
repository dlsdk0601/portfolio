open: setup
	nix-shell --run 'pycharm .'

setup: venv
	venv/bin/pip install pip==23.2.1
	venv/bin/pip install -e .

venv:
	nix-shell --run 'python3.11 -m venv venv'

watch: setup
	venv/bin/dmypy restart
	-$(MAKE) watch-run
	venv/bin/watchmedo shell-command --patterns="*.py;*.ini;*.tsx" --recursive --ignore-directories --drop --command='echo ""; make watch-run' .

watch-run: code-gen mypy-check

mypy-check:
	venv/bin/dmypy run -- was ex bin

code-gen:
	(source venv/bin/activate && $(MAKE) '_code-gen')

_code-gen:
	python bin/generate_api_dart_schema.py | (type dart > /dev/null && dart format || cat) | python bin/tee.py ../portfolio_app/lib/api.schema.gen.dart
	python bin/generate_api_dart.py | (type dart > /dev/null && dart format || cat) | python bin/tee.py ../portfolio_app/lib/api/api.gen.dart

faker-import:
	time venv/bin/python bin/faker_import.py

dev:
	docker compose up -d
	sleep 1

dev-clean:
	docker compose down -v --rmi local

dev-reinitialize: dev-clean dev
	venv/bin/alembic upgrade head
	venv/bin/python bin/faker_import.py
