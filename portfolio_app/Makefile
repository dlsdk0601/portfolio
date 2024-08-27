open: setup
	nix-shell --run 'idea .'

setup:
	nix-shell --run 'flutter pub get'

watch: setup
	nix-shell --run 'flutter pub run build_runner watch --delete-conflicting-outputs'

build-apk:
	nix-shell --run 'flutter clean && flutter pub get && dart run build_runner build --delete-conflicting-outputs'
	nix-shell --run 'flutter build apk --target lib/main_stg.dart'
	rm -rf ./portfolio_app.apk
	cp build/app/outputs/flutter-apk/app-release.apk ./portfolio_app.apk

build-appbundle:
	flutter clean
	flutter pub get
	flutter pub run build_runner build --delete-conflicting-outputs
	flutter build apk
	flutter build appbundle
	open build/app/outputs/bundle/release

clean:
	nix-shell --run 'flutter clean'