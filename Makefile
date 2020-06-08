STACK_NAME = sam-app-stack
DOCKER_NETWORK = aws-local-network
TABLE_NAME = local-db

all: build

deploy: build
	sam deploy

build:
	sam build

install:
	yarn install

delete:
	aws cloudformation delete-stack \
		--stack-name $(STACK_NAME)

local:
	docker-compose --verbose -f docker/docker-compose.yml up -d
	aws dynamodb create-table \
		--table-name $(TABLE_NAME) \
		--cli-input-json file://docker/resources/db.template.json \
		--endpoint-url http://localhost:8000
	aws dynamodb scan \
		--table-name $(TABLE_NAME) \
		--endpoint-url http://localhost:8000

local-stop:
	docker-compose --verbose -f docker/docker-compose.yml down

# invoke functions locally against local docker dynamodb
invoke-local:
	sam local invoke putItemFunction \
		-e events/event-post-item.json \
		--env-vars env.json \
		--docker-network $(DOCKER_NETWORK)
	sam local invoke getAllItemsFunction \
		-e events/event-get-all-items.json \
		--env-vars env.json \
		--docker-network $(DOCKER_NETWORK)
	sam local invoke getByIdFunction \
		-e events/event-get-by-id.json \
		--env-vars env.json \
		--docker-network $(DOCKER_NETWORK)

# Start API gateway & lambda functions locally
start-local-api:
	sam local start-api  \
		--env-vars env.json \
		--docker-network $(DOCKER_NETWORK)

scan-local:
	aws dynamodb scan \
		--table-name $(TABLE_NAME) \
		--endpoint-url http://localhost:8000
