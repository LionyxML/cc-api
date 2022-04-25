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

const certAllowed =
  "data:text/txt;base64," +
  Buffer.from(Array(Number(config.maxCertificateSize)))
    .fill("R")
    .toString("base64");

const certNotAllowed =
  "data:image/png;base64," +
  Buffer.from(Array(Number(config.maxCertificateSize) + 1))
    .fill("R")
    .toString("base64");

beforeAll(async () => {
  await appLoader({ expressApp: app });
});

describe("POST /certificates/upload", () => {
  it("should return 401 for missing JWT Bearer", function (done) {
    request(app)
      .get(`${apiPrefix}/certificates/list`)
      .set("Accept", "application/json")
      .expect(401, /Unauthorized/, done);
  });

  jest.setTimeout(10_000);
  it("should return 201 when logged user uploads a certificate", function (done) {
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
              .post(`${apiPrefix}/certificates/upload`)
              .send({
                fileName: "test.cert",
                certificate: certAllowed,
              })
              .set("Accept", "application/json")
              .set("Authorization", response.body.token)
              .expect(201, /Certificate is uploaded/, done);
          });
      });
  });

  it("should return 400 when logged user uploads a certificate bigger then max allowed", function (done) {
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
              .post(`${apiPrefix}/certificates/upload`)
              .send({
                fileName: "test.cert",
                certificate: certNotAllowed,
              })
              .set("Accept", "application/json")
              .set("Authorization", response.body.token)
              .expect(400, /Certificate file should not be bigger then/, done);
          });
      });
  });

  it("should return 200 when logged user lists it's own certificates", function (done) {
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
              .post(`${apiPrefix}/certificates/upload`)
              .send({
                fileName: "test.cert",
                certificate: certAllowed,
              })
              .set("Accept", "application/json")
              .set("Authorization", response.body.token)
              .expect(201, /Certificate is uploaded/)
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
                      .get(`${apiPrefix}/certificates/list`)
                      .set("Accept", "application/json")
                      .set("Authorization", response.body.token)
                      .expect(200, /"status":"success"/, done);
                  });
              });
          });
      });
  });

  it("should return 200 when logged user deletes one of its own certificates", function (done) {
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
            const token = response.body.token;
            request(app)
              .post(`${apiPrefix}/certificates/upload`)
              .send({
                fileName: "test.cert",
                certificate: certAllowed,
              })
              .set("Accept", "application/json")
              .set("Authorization", token)
              .expect(201, /Certificate is uploaded/)
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
                      .get(`${apiPrefix}/certificates/list`)
                      .set("Accept", "application/json")
                      .set("Authorization", response.body.token)
                      .expect(200, /"status":"success"/)
                      .end(function (_error, response) {
                        const certId = response.body.certificates[0].id;
                        request(app)
                          .delete(`${apiPrefix}/certificates/delete/${certId}`)
                          .set("Accept", "application/json")
                          .set("Authorization", token)
                          .expect("Content-Type", /json/)
                          .expect(200, /Certificate deleted: 1 matche/, done);
                      });
                  });
              });
          });
      });
  });
});
