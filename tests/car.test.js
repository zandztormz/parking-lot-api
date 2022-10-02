require("dotenv").config({ path: ".env.test" });
const { HTTP_CODE } = require("../libs/constants");
const request = require("supertest");
let server;
const mockTicket = require("./mockticket.json");
jest.mock("./../service/parkingService");
jest.mock("./../service/ticketService");
const parkingService = require("./../service/parkingService");
const ticketService = require("./../service/ticketService");

beforeAll(() => {
  server = require("./../app");
  //   server.listen();
});
afterEach(() => {
  jest.resetAllMocks();
});
describe("Car controller test", () => {
  it("test parking", (done) => {
    parkingService.findNearestParkingSlot.mockImplementation(() => ({
      _id: "63384f1250e573dbebf12848",
      diff: 3,
      floor: 4,
      slots: [
        { slotID: 1, status: "available" },
        { slotID: 2, status: "available" },
      ],
      name: "Central World Floor 4",
    }));
    parkingService.findAvailableSlot.mockImplementation(() => ({
      slotID: 1,
      status: "available",
    }));
    ticketService.createTicket.mockImplementation(() => ({
      plateNumber: "4AVSBCD-RR",
      size: "s",
      slotID: 1,
      parkingId: "63384f1250e573dbebf12848",
      parkingFloor: 4,
      parkedAt: "2022-10-02T07:10:53.070Z",
      _id: "6339397ddc8048826a417979",
    }));
    parkingService.allocatedParkingSlot.mockImplementation(() => true);
    request(server)
      .post("/car/park")
      .send({
        floor: 7,
        size: "s",
        plateNumber: "4AVSBCD-RR",
      })
      .expect(
        {
          code: HTTP_CODE.CREATED,
          data: {
            plateNumber: "4AVSBCD-RR",
            size: "s",
            slotID: 1,
            parkingId: "63384f1250e573dbebf12848",
            parkingFloor: 4,
            parkedAt: "2022-10-02T07:10:53.070Z",
            _id: "6339397ddc8048826a417979",
          },
          message: "Ticket has created",
        },
        done
      );
  });

  it("test parking expect 404", (done) => {
    parkingService.findNearestParkingSlot.mockImplementation(() => null);
    request(server)
      .post("/car/park")
      .send({
        floor: 7,
        size: "s",
        plateNumber: "4AVSBCD-RR",
      })
      .expect(
        { code: HTTP_CODE.NOT_FOUND, message: "no available slot" },
        done
      );
  });

  it("test parking expect 500", (done) => {
    parkingService.findNearestParkingSlot.mockImplementation(() => {
      throw new Error("INTERNAL ERROR");
    });
    request(server)
      .post("/car/park")
      .send({
        floor: 7,
        size: "s",
        plateNumber: "4AVSBCD-RR",
      })
      .expect(
        { code: HTTP_CODE.INTERNAL_ERROR, message: "INTERNAL ERROR" },
        done
      );
  });

  it("test leave expect 422", (done) => {
    ticketService.findTicketById.mockImplementation(() => ({
      _id: "633938837f1739d428fa8a36",
      plateNumber: "4AVSBCD-RR",
      size: "s",
      slotID: 2,
      parkingId: "63384f1250e573dbebf12848",
      parkingFloor: 4,
      parkedAt: "2022-10-02T07:06:43.582Z",
      exitedAt: "2022-10-02T07:51:04.070Z",
    }));
    request(server)
      .post("/car/leave")
      .send({
        id: "633938837f1739d428fa8a36",
      })
      .expect(
        {
          code: HTTP_CODE.UNPROCESSABLE_ENTITY,
          message: "ticket has already exited",
        },
        done
      );
  });

  it("test leave expect 422", (done) => {
    ticketService.findTicketById.mockImplementation(() => ({
      _id: "633938837f1739d428fa8a36",
      plateNumber: "4AVSBCD-RR",
      size: "s",
      slotID: 2,
      parkingId: "63384f1250e573dbebf12848",
      parkingFloor: 4,
      parkedAt: "2022-10-02T07:06:43.582Z",
      exitedAt: "2022-10-02T07:51:04.070Z",
    }));
    request(server)
      .post("/car/leave")
      .send({
        floor: 7,
        size: "s",
        plateNumber: "4AVSBCD-RR",
      })
      .expect(
        {
          code: HTTP_CODE.UNPROCESSABLE_ENTITY,
          message: "ticket has already exited",
        },
        done
      );
  });

  it("test leave expect 404", (done) => {
    ticketService.findTicketById.mockImplementation(() => []);
    request(server)
      .post("/car/leave")
      .send({
        id: "633938837f1739d428fa8a36",
      })
      .expect(
        {
          code: HTTP_CODE.NOT_FOUND,
          message: "ticket not found",
        },
        done
      );
  });

  it("test leave expect 500", (done) => {
    ticketService.findTicketById.mockImplementation(() => {
      throw new Error("INTERNAL ERROR");
    });
    request(server)
      .post("/car/leave")
      .send({
        floor: 7,
        size: "s",
        plateNumber: "4AVSBCD-RR",
      })
      .expect(
        {
          code: HTTP_CODE.INTERNAL_ERROR,
          message: "INTERNAL ERROR",
        },
        done
      );
  });

  it("test leave expect 200", (done) => {
    ticketService.findTicketById.mockImplementation(() => ({
      _id: "633938837f1739d428fa8a36",
      plateNumber: "4AVSBCD-RR",
      size: "s",
      slotID: 2,
      parkingId: "63384f1250e573dbebf12848",
      parkingFloor: 4,
      parkedAt: "2022-10-02T07:06:43.582Z",
    }));
    parkingService.releaseParkingSlot.mockImplementation(() => true);
    ticketService.stampExit.mockImplementation(() => true);

    request(server)
      .post("/car/leave")
      .send({
        id: "633938837f1739d428fa8a36",
      })
      .expect(
        {
          code: HTTP_CODE.OK,
          message: "Ticket has exited",
        },
        done
      );
  });
});
