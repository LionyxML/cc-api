# cc-api

CC project - API

A base API for registering users and recovering profiles with JWT.

## Setup

Clone this repo.

Issue `yarn install`.

Minimum requirements for "node" and "yarn" are provided inside `package.json`.

Copy `.env_example` to `.env` and fill it in as needed (look for process.env calls inside the code, most if not all are inside `/src/config`).

Server can be run in two modes: `development` and `production`:

- production mode: `yarn start`

- development mode: `yarn dev`

Start making requests to [http://localhost:5001/api/](http://localhost:5001/api/) (where 5001 is the defalut port you can set in .env)

## Logs

You can check for logs in `/dist/logs/`

## Swagger

Swagger is auto-generated with some minor manual notations, but the scripts that generates it
must be run manually with `yarn swagger-autogen`.

After server is up and running in either `development` or `production` mode you can access it from [http://localhost:5001/api/docs](http://localhost:5001/api/docs).
