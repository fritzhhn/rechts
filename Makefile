.PHONY: dev ios android mobile device-url

PORT ?= 8000

dev:
	./scripts/dev.sh

ios:
	./scripts/dev-ios.sh

android:
	./scripts/dev-android.sh

mobile:
	./scripts/dev-mobile.sh

device-url:
	./scripts/dev-device-url.sh
