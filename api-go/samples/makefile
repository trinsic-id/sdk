# Variables
UI_WEB_DIR=../../ui-web/samples
API_GO_DIR=../../api-go/samples

# Targets
.PHONY: all prestart start validate

all: prestart start

prestart:
	@echo "Running prestart tasks..."
	@cd $(UI_WEB_DIR) && npm run build
	@cd $(API_GO_DIR)

start: prestart
	@echo "Starting the application..."
	go run main.go

build:
	@echo "Validating sample app..."
	go build -o go-sample
