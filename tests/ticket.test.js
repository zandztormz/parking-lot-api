require("dotenv").config({ path: ".env.test" });
const { HTTP_CODE } = require("../libs/constants");
const request = require("supertest");
let server;
const mockTicket = require("./mockticket.json");
jest.mock("./../service/ticketService");
const ticketService = require("./../service/ticketService");
beforeAll(async () => {
  server = require("./../app");
});
describe("Ticket", () => {
  it("test get ticket", (done) => {
    ticketService.getRegistrationPlateNumberByCarSize.mockImplementation(
      () => mockTicket
    );
    request(server).get("/ticket?size=s").expect(mockTicket, done);
  });

  it("test get ticket expect 400", (done) => {
    ticketService.getRegistrationPlateNumberByCarSize.mockImplementation(
      () => mockTicket
    );
    request(server)
      .get("/ticket")
      .expect(
        { code: HTTP_CODE.BAD_REQUEST, message: "Car size is required" },
        done
      );
  });
  it("test get ticket expect 500", (done) => {
    ticketService.getRegistrationPlateNumberByCarSize.mockImplementation(() => {
      throw new Error("INTERNAL ERROR");
    });
    request(server)
      .get("/ticket?size=s")
      .expect(
        { code: HTTP_CODE.INTERNAL_ERROR, message: "INTERNAL ERROR" },
        done
      );
  });
});
