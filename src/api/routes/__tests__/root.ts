import request from "supertest";
import express from "express";

import appLoader from "../../../loaders";
import config from "../../../config";

const app = express();
const apiPrefix = config.api.prefix;

beforeAll(async () => {
  await appLoader({ expressApp: app });
});

describe("GET /api/", () => {
  it("should return 200 & valid response if request param list is empty", function (done) {
    request(app)
      .get(`${apiPrefix}`)
      .expect("Content-Type", /text\/html/)
      .expect(200, done);
  });
});
