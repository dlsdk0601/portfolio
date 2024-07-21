docker-build:
	docker build -t portfolio .

docker-bash: docker-build
	docker run -it --rm portfolio bash

docker-run: docker-build
	docker run -it --rm -p 8080:8080 --name porfolio -e PORT=8080 -e SQLALCHEMY_DATABASE_URI=postgres://postgres@127.0.0.1:30322/porfolio porfolio

push:
	git push

release: push
	nix-shell --run 'npm i && npm run release'
	git push --follow-tags origin main

