# cc-api

CC project - API

A base API for registering users and recovering profiles with JWT.

[![Tests](https://github.com/LionyxML/cc-api/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/LionyxML/cc-api/actions/workflows/tests.yml)

## Setup

#### Method 1 - On your host system with node and yarn installed

Clone this repo.

Issue `yarn install`.

Minimum requirements for "node" and "yarn" are provided inside `package.json`.

Copy `.env_example` to `.env` and fill it in as needed (look for process.env calls inside the code, most if not all are inside `/src/config`).

Server can be run in two modes: `development` and `production`:

- production mode: `yarn start`

- development mode: `yarn dev`

Start making requests to [http://localhost:5001/api/](http://localhost:5001/api/) (where 5001 is the defalut port you can set in .env)

#### Method 2 - In a container

`Dockerfile.dev` and `Dockerfile.prod` are provided for both a Development and Production server respectively.

##### Method 2.1 - Usual Docker Setup

Clone this repo.

For development:

- Run `docker build -f ./Dockerfile.dev -t cc-api:dev .` for building the development image.
- Run `docker run -it --rm -p 5001:5001 cc-api:dev` for running the development image.

For production:

- Run `docker build -f ./Dockerfile.prod -t cc-api:prod .` for building the production image.
- Run `docker run -it --rm -p 5001:5001 cc-api:prod` for running the production image.

##### Method 2.2 - Using docker-compose

Clone this repo.

For development:

- Run `docker-compose -f "docker-compose-dev.yml" up -d --build `
- When done, run `docker-compose -f "docker-compose-dev.yml" down` to stop the server.
- If you need to restart the server, run `docker-compose -f "docker-compose-dev.yml" restart`.

For production:

- Run `docker-compose -f "docker-compose-prod.yml" up -d --build `
- When done, run `docker-compose -f "docker-compose-prod.yml" down` to stop the server.
- If you need to restart the server, run `docker-compose -f "docker-compose-prod.yml" restart`.

## Logs

You can check for logs in `/dist/logs/`

## Swagger

Swagger is auto-generated with some minor manual notations, but the scripts that generates it
must be run manually with `yarn swagger-autogen`.

After server is up and running in either `development` or `production` mode you can access it from [http://localhost:5001/api/docs](http://localhost:5001/api/docs).
