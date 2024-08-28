# Variables
UI_WEB_DIR=../../ui-web/samples
API_PHP_DIR=../../api-php/samples

# Targets
.PHONY: all prestart start validate

all: prestart start

prestart:
	@echo "Running prestart tasks..."
	@cd $(UI_WEB_DIR) && pwsh ./copy-dist.ps1 --destination ../../api-php/samples/public
	@cd $(API_PHP_DIR)

start: prestart
	@echo "Starting the application..."
	php -S localhost:8080 -t public
