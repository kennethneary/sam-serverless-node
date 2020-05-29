STACK_NAME = sam-app-stack
DOCKER_NETWORK = sam-demo
DOCKER_CONTAINER = dynamodb
S3_DEPLOY_BUCKET = sam-deploy-bucket-kn

all: build

deploy:
	# sam deploy \
	# 	--template-file template.yml \
	# 	--s3-bucket $(S3_DEPLOY_BUCKET) \
	# 	--stack-name $(STACK_NAME) \
	# 	--capabilities CAPABILITY_IAM

build:
	sam build \
		--template-file template.yml

local:
	docker network create $(DOCKER_NETWORK)

	docker run \
		--network $(DOCKER_NETWORK) \
		--name $(DOCKER_CONTAINER) \
		-d -p 8000:8000 amazon/dynamodb-local

	aws dynamodb create-table \
		--table-name documentTable \
		--cli-input-json file://docker/resources/db.template.yml
		--endpoint-url http://localhost:8000

	aws dynamodb scan \
		--table-name documentTable \
		--endpoint-url http://localhost:8000


start-local-api:
	# https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-start-api.html
	# sam local start-api --env-vars env.json

	sam local start-api \
		--docker-network $(DOCKER_NETWORK)
	# set up dynamobd
	# docker compose
	# sam local invoke "Ratings" -e event.json

install:
	yarn install

package:
	sam package \
		--template-file template.yml \
		--s3-bucket $(S3_DEPLOY_BUCKET)

scan-local:
	aws dynamodb scan \
		--table-name documentTable \
		--endpoint-url http://localhost:8000

delete:
	aws cloudformation delete-stack \
		--stack-name $(STACK_NAME)
