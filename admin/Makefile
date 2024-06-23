open: setup
	nix-shell --run 'webstorm .'

setup:
	nix-shell --run 'bun i'

watch:
	-$(MAKE) watch-run

watch-run: path-gen type-gen

path-gen:
	nix-shell --run 'bun run watch'

type-gen:
	nix-shell --run 'bun run ./bin/generateTypes.ts'

run:
	nix-shell --run 'bun run dev'
