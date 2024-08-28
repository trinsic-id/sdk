# Variables
UI_WEB_DIR=../../ui-web/samples
API_PY_DIR=../../api-python/samples

# Targets
.PHONY: all prestart start validate

all: prestart start

prestart:
	@echo "Running prestart tasks..."
	@cd $(UI_WEB_DIR) && npm run build
	@cd $(API_PY_DIR)

start: prestart
	@echo "Starting the application..."
	python3 main.py

validate:
	@echo "Validating sample app..."
	python3 validate.py
