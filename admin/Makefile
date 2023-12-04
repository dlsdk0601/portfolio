open: setup
	nix-shell --run 'webstorm .'

setup:
	nix-shell --run 'bun i'

watch:
	nix-shell --run 'bun --watch bin/generateUrl.ts'

run:
	bun --bun run dev

cypress-open:
	npx cypress open

cypress-headless:
	npx cypress run

e2e:
	start-server-and-test dev http://localhost:3000 cypress

e2e-headless:
	start-server-and-test dev http://localhost:3000 cypress-headless
