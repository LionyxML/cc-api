import request from "supertest";
import express from "express";
import appLoader from "../../../loaders";
import config from "../../../config";
import { faker } from "@faker-js/faker";

const app = express();
const apiPrefix = config.api.prefix;

const imageAllowed =
  "data:image/png;base64," +
  Buffer.from(Array(Number(config.maxProfileSize)))
    .fill("R")
    .toString("base64");

const imageBTAllowed =
  "data:image/png;base64," +
  Buffer.from(Array(Number(config.maxProfileSize) + 1))
    .fill("R")
    .toString("base64");

beforeAll(async () => {
  await appLoader({ expressApp: app });
});

describe("POST /users/register", () => {
  it("should return 400 if fields are not all filled", function (done) {
    request(app)
      .post(`${apiPrefix}/users/register`)
      .send({})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        400,
        {
          status: "error",
          msg: "All fields must be filled in.",
        },
        done
      );
  });

  it("should return 400 if bigger profile picture then allowed", function (done) {
    request(app)
      .post(`${apiPrefix}/users/register`)
      .send({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.internet.userName(),
        email: faker.internet.email(),
        password: "123123123",
        passwordConfirmation: "123123123",
        profilePic: imageBTAllowed,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, /Profile Pic should not be bigger then/, done);
  });

  it("should return 400 if passwords do not match", function (done) {
    request(app)
      .post(`${apiPrefix}/users/register`)
      .send({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        passwordConfirmation: "123123123",
        profilePic: imageAllowed,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, /Passwords do not match/, done);
  });

  it("should return 200 for a valid user entry", function (done) {
    request(app)
      .post(`${apiPrefix}/users/register`)
      .send({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.internet.userName(),
        email: faker.internet.email(),
        password: "123123123",
        passwordConfirmation: "123123123",
        profilePic: imageAllowed,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201, /User is now registered/, done);
  });

  it("should return 400 if userName is already taken", function (done) {
    request(app)
      .post(`${apiPrefix}/users/register`)
      .send({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: "fooUser",
        email: faker.internet.email(),
        password: "123123123",
        passwordConfirmation: "123123123",
        profilePic: imageAllowed,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201, /User is now registered/)
      .end(function () {
        request(app)
          .post(`${apiPrefix}/users/register`)
          .send({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            userName: "fooUser",
            email: faker.internet.email(),
            password: "123123123",
            passwordConfirmation: "123123123",
            profilePic: imageAllowed,
          })
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(400, /Username is already taken/, done);
      });
  });

  it("should return 400 if email is already registered", function (done) {
    request(app)
      .post(`${apiPrefix}/users/register`)
      .send({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.internet.userName(),
        email: "foo@bar.net",
        password: "123123123",
        passwordConfirmation: "123123123",
        profilePic: imageAllowed,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201, /User is now registered/)
      .end(function () {
        request(app)
          .post(`${apiPrefix}/users/register`)
          .send({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            userName: `${faker.internet.userName()}--another`,
            email: "foo@bar.net",
            password: "123123123",
            passwordConfirmation: "123123123",
            profilePic: imageAllowed,
          })
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(400, /E-mail already registered/, done);
      });
  });
});

describe("POST /users/login", () => {
  it("should return 404 for unknown user attempt to login", function (done) {
    request(app)
      .post(`${apiPrefix}/users/login`)
      .send({
        email: "a_fake@_email_that_does_not_exist.com",
        password: "123123123",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404, /Username not found/, done);
  });

  it("should return 404 for incorrect password", function (done) {
    request(app)
      .post(`${apiPrefix}/users/register`)
      .send({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.internet.userName(),
        email: "foo@bar.net",
        password: "123123123",
        passwordConfirmation: "123123123",
        profilePic: imageAllowed,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201, /User is now registered/)
      .end(function () {
        request(app)
          .post(`${apiPrefix}/users/login`)
          .send({
            email: "foo@bar.net",
            password: "1231231233",
          })
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(404, /Incorrect password/, done);
      });
  });

  it("should return 201 for proper login", function (done) {
    request(app)
      .post(`${apiPrefix}/users/register`)
      .send({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.internet.userName(),
        email: "foo@bar.net",
        password: "123123123",
        passwordConfirmation: "123123123",
        profilePic: imageAllowed,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201, /User is now registered/)
      .end(function () {
        request(app)
          .post(`${apiPrefix}/users/login`)
          .send({
            email: "foo@bar.net",
            password: "123123123",
          })
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200, /"status":"success"/, done);
      });
  });
});

describe("GET /users/profile", () => {
  it("should return 401 for missing JWT Bearer", function (done) {
    request(app)
      .get(`${apiPrefix}/users/profile`)
      .set("Accept", "application/json")
      .expect(401, /Unauthorized/, done);
  });

  it("should return 201 when users logged in with valid JWT", function (done) {
    request(app)
      .post(`${apiPrefix}/users/register`)
      .send({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.internet.userName(),
        email: "foo@bar.net",
        password: "123123123",
        passwordConfirmation: "123123123",
        profilePic: imageAllowed,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201, /User is now registered/)
      .end(function () {
        request(app)
          .post(`${apiPrefix}/users/login`)
          .send({
            email: "foo@bar.net",
            password: "123123123",
          })
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200, /"status":"success"/)
          .end(function (_error, response) {
            request(app)
              .get(`${apiPrefix}/users/profile`)
              .set("Accept", "application/json")
              .set("Authorization", response.body.token)
              .expect(200, done);
          });
      });
  });
});
