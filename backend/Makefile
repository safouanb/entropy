# Simple Makefile for PyRecycle Heat Go backend

.PHONY: help run run-dev run-tls build fmt tidy lint test smoke

help:
	@echo "Targets: run-dev, run-tls, run, build, fmt, tidy, lint, test, smoke"

# legacy alias
run:
	go run ./cmd/server

run-dev:
	@echo "Running in dev (h2c) mode on :8080"
	go run ./cmd/server

run-tls:
	@if [ -z "$$TLS_CERT" ] || [ -z "$$TLS_KEY" ]; then \
		echo "TLS_CERT and TLS_KEY must be set"; exit 1; \
	fi
	@echo "Running with TLS on :8080"
	TLS_CERT=$$TLS_CERT TLS_KEY=$$TLS_KEY go run ./cmd/server

build:
	CGO_ENABLED=1 go build -o bin/server ./cmd/server

fmt:
	go fmt ./...
	gofmt -s -w .

tidy:
	go mod tidy

lint:
	@echo "go vet" && go vet ./...

test:
	go test ./...

proto-lint:
	@echo "Validating protobuf files..." && buf lint ../shared/common/proto
buf-gen:
	@echo "Generating protobuf code..." && buf generate ../shared/common/proto

sqlc-gen:
	@echo "Generating SQL code..." && sqlc generate

smoke-test:
	@echo "Running smoke test..." && ./scripts/smoke-test.sh

migrate-up:
	@echo "Running migrations up..." && migrate -path internal/migrations -database "sqlite3://district_heating.db" up

migrate-down:
	@echo "Running migrations down..." && migrate -path internal/migrations -database "sqlite3://district_heating.db" down


