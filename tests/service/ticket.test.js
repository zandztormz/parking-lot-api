require("dotenv").config({ path: ".env.test" });
jest.mock("./../../models/ticket.model");
const Ticket = require("./../../models/ticket.model");
const ticketService = require("./../../service/ticketService");
describe("ticketService test", () => {
  it("findTicketById", (done) => {
    Ticket.findById.mockImplementation(() => ({
      _id: "633adbc35019dd4aeb3b7454",
      plateNumber: "4AVSBCD-RR",
      size: "s",
      slotID: 1,
      parkingId: "63384f1250e573dbebf12848",
      parkingFloor: 4,
      parkedAt: "2022-10-03T12:55:31.827Z",
    }));
    ticketService.findTicketById("633adbc35019dd4aeb3b7454");
    done();
  });
  it("stampExit", (done) => {
    Ticket.updateOne.mockImplementation(() => true);
    ticketService.stampExit(
      new Ticket({
        _id: "633adbc35019dd4aeb3b7454",
        plateNumber: "4AVSBCD-RR",
        size: "s",
        slotID: 1,
        parkingId: "63384f1250e573dbebf12848",
        parkingFloor: 4,
        parkedAt: "2022-10-03T12:55:31.827Z",
      })
    );
    done();
  });
  it("createTicket", (done) => {
    new Ticket().save.mockImplementation(() => true);
    ticketService.createTicket("4AVSBCD-RR", "s", {
      floor: 5,
      _id: "633adbc35019dd4aeb3b7454",
    });
    done();
  });
  it("getAllocatedByCarSize", (done) => {
    Ticket.find.mockImplementation(() =>
      Promise.resolve([
        {
          _id: "633adbdb593f259693d70430",
          plateNumber: "4AVSBCD-RR",
          size: "s",
          slotID: 2,
          parkingId: "63384f1250e573dbebf12848",
          parkingFloor: 4,
          parkedAt: "2022-10-03T12:55:55.096Z",
        },
      ])
    );
    ticketService.getAllocatedByCarSize().then((data) => {
      expect(data).toMatchObject([
        {
          ticketId: "633adbdb593f259693d70430",
          plateNumber: "4AVSBCD-RR",
          carSize: "s",
          parkingLotId: 2,
          parkingId: "63384f1250e573dbebf12848",
          parkingFloor: 4,
          parkedAt: "2022-10-03T12:55:55.096Z",
        },
      ]);
    });
    done();
  });
  it("getRegistrationPlateNumberByCarSize", (done) => {
    Ticket.aggregate.mockImplementation(() => [
      {
        plateNumber: "4AVSBCD-RR",
        size: "s",
        totalOfPark: 6,
      },
    ]);
    ticketService.getRegistrationPlateNumberByCarSize("s");
    done();
  });
});
