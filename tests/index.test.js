require("dotenv").config({ path: ".env.test" });
const { HTTP_CODE } = require("../libs/constants");
const request = require("supertest");
let server;

beforeAll(() => {
  server = require("./../app");
});

describe("GET /", () => {
  it("returns hello message", (done) => {
    request(server).get("/").expect(
      HTTP_CODE.OK,
      {
        code: HTTP_CODE.OK,
        message: "parking lot api",
      },
      done
    );
  });
});
