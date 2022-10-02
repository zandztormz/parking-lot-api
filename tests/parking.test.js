require("dotenv").config({ path: ".env.test" });
const { HTTP_CODE } = require("../libs/constants");
const request = require("supertest");
let server;
const mockParking = require("./mockData.json");
const mockAllocated = require("./mockAllocated.json");
jest.mock("./../service/parkingService");
jest.mock("./../service/ticketService");
const parkingService = require("./../service/parkingService");
const ticketService = require("./../service/ticketService");
beforeAll(async () => {
  server = require("./../app");
});

describe("Parking", () => {
  it("create parking expect success", (done) => {
    parkingService.createParkingLot.mockImplementation(() => mockParking);
    request(server)
      .post("/parking")
      .send({
        name: "Central World Floor 4",
        floor: 4,
        slots: {
          s: 2,
          m: 2,
          l: 2,
          xl: 2,
          xxl: 6,
        },
      })
      .expect(mockParking, done);
  });

  it("create parking expect 400", (done) => {
    parkingService.createParkingLot.mockImplementation(() => mockParking);
    request(server)
      .post("/parking")
      .send({
        name: "Central World Floor 4",
        floor: 4,
        slots: {
          s: "asd",
          m: 2,
          l: 2,
          xl: 2,
          xxl: 6,
        },
      })
      .expect(
        {
          code: HTTP_CODE.BAD_REQUEST,
          message: "Slots have contained a string",
        },
        done
      );
  });

  it("create parking expect internal error", (done) => {
    parkingService.createParkingLot.mockImplementation(() => {
      throw new Error("INTERNAL_ERROR");
    });
    request(server)
      .post("/parking")
      .send({
        name: "Central World Floor 4",
        floor: 4,
        slots: {
          s: 1,
          m: 2,
          l: 2,
          xl: 2,
          xxl: 6,
        },
      })
      .expect(
        {
          code: HTTP_CODE.BAD_REQUEST,
          message: "INTERNAL_ERROR",
        },
        done
      );
  });

  it("test get status", (done) => {
    parkingService.getParkingStatus.mockImplementation(() => mockParking);
    request(server).get("/parking/status").expect(mockParking, done);
  });

  it("test get status expect 500", (done) => {
    parkingService.getParkingStatus.mockImplementation(() => {
      throw new Error("INTERNAL_ERROR");
    });
    request(server)
      .get("/parking/status")
      .expect(
        { code: HTTP_CODE.INTERNAL_ERROR, message: "INTERNAL_ERROR" },
        done
      );
  });

  it("test get allocated", (done) => {
    ticketService.getAllocatedByCarSize.mockImplementation(() => mockAllocated);
    request(server)
      .get("/parking/allocated?size=xl")
      .expect(mockAllocated, done);
  });

  it("test get allocated expect 400", (done) => {
    request(server)
      .get("/parking/allocated")
      .expect(
        { code: HTTP_CODE.BAD_REQUEST, message: "Car size is required" },
        done
      );
  });
  it("test get allocated expect 500", (done) => {
    ticketService.getAllocatedByCarSize.mockImplementation(() => {
      throw new Error("INTERNAL_ERROR");
    });
    request(server)
      .get("/parking/allocated?size=xl")
      .expect(
        { code: HTTP_CODE.INTERNAL_ERROR, message: "INTERNAL_ERROR" },
        done
      );
  });
});
