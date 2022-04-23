# CC API
[![Tests](https://github.com/LionyxML/cc-api/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/LionyxML/cc-api/actions/workflows/tests.yml)

A base API for registering users and recovering profiles with JWT.

Features:
- Node.js
- Express
- Typescript
- Sequelize
- Swagger
- Docker
- Jest
- Winston

## Setup

### Method 1 - On your host system with node and yarn installed

Clone this repo.

Issue `yarn install`.

Minimum requirements for "node" and "yarn" are provided inside `package.json`.

Copy `.env_example` to `.env` and fill it in as needed (look for process.env calls inside the code, most if not all are inside `/src/config`).

Server can be run in two modes: `development` and `production`:

- production mode: `yarn start`

- development mode: `yarn dev`

Start making requests to [http://localhost:5001/api/](http://localhost:5001/api/) (where 5001 is the defalut port you can set in .env)

### Method 2 - In a container

`Dockerfile.dev` and `Dockerfile.prod` are provided for both a Development and Production server respectively.

Clone this repo and follow the instructions for creating the `.env` file on method 1.

#### Method 2.1 - Usual Docker Setup

For development:

- Run `docker build -f ./Dockerfile.dev -t cc-api:dev .` for building the development image.
- Run `docker run -it --rm -p 5001:5001 cc-api:dev` for running the development image.

For production:

- Run `docker build -f ./Dockerfile.prod -t cc-api:prod .` for building the production image.
- Run `docker run -it --rm -p 5001:5001 cc-api:prod` for running the production image.

#### Method 2.2 - Using docker-compose

Development mode:

- Run `docker-compose -f "docker-compose-dev.yml" up -d --build `
- When done, run `docker-compose -f "docker-compose-dev.yml" down` to stop the server.
- If you need to restart the server, run `docker-compose -f "docker-compose-dev.yml" restart`.

Production mode:

- Run `docker-compose -f "docker-compose-prod.yml" up -d --build `
- When done, run `docker-compose -f "docker-compose-prod.yml" down` to stop the server.
- If you need to restart the server, run `docker-compose -f "docker-compose-prod.yml" restart`.

## Logs

You can check for logs inside the  `/dist/logs/` folder.

## Swagger

The swagger file (`src/swagger/swagger_output.json`) is auto-generated with some minor manual 
notations. The auto-gen script must be run manually with `yarn swagger-autogen`.

After server is up and running in either `development` or `production` mode you can access the
swagger page served from [http://localhost:5001/api/docs](http://localhost:5001/api/docs).

