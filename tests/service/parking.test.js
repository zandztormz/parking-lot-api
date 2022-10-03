require("dotenv").config({ path: ".env.test" });

jest.mock("./../../models/parking_lot.model");
const ParkingLot = require("./../../models/parking_lot.model");
const parkingService = require("./../../service/parkingService");
const mockParking = require("./../mockData.json");

describe("ParkingService test", () => {
  it("getParkingStatus", (done) => {
    ParkingLot.find.mockImplementation(() => mockParking);
    const response = parkingService.getParkingStatus();
    expect(response).toBe(mockParking);
    done();
  });

  it("findNearestParkingSlot", (done) => {
    ParkingLot.aggregate.mockImplementation(() =>
      Promise.resolve([
        {
          _id: "63384f1250e573dbebf12848",
          diff: 3,
          floor: 4,
          slots: [
            { slotID: 1, status: "available" },
            { slotID: 2, status: "available" },
          ],
          name: "Central World Floor 4",
        },
      ])
    );
    parkingService.findNearestParkingSlot().then((response) => {
      expect(response).toMatchObject({
        _id: "63384f1250e573dbebf12848",
        diff: 3,
        floor: 4,
        name: "Central World Floor 4",
        slots: [
          { slotID: 1, status: "available" },
          { slotID: 2, status: "available" },
        ],
      });
    });
    done();
  });

  it("findAvailableSlot", (done) => {
    const response = parkingService.findAvailableSlot({
      _id: "63384f1250e573dbebf12848",
      diff: 3,
      floor: 4,
      name: "Central World Floor 4",
      slots: [
        { slotID: 1, status: "unavailable" },
        { slotID: 2, status: "available" },
      ],
    });
    expect(response).toMatchObject({
      slotID: 2,
      status: "available",
    });
    done();
  });

  it("allocatedParkingSlot", (done) => {
    ParkingLot.updateOne.mockImplementation(() => true);
    expect(parkingService.allocatedParkingSlot()).toBeTruthy();
    done();
  });

  it("releaseParkingSlot", (done) => {
    ParkingLot.updateOne.mockImplementation(() => true);
    expect(
      parkingService.releaseParkingSlot({
        slotID: 1,
        size: "s",
        parkingId: "63384f1250e573dbebf12848",
      })
    ).toBeTruthy();
    done();
  });

  it("createParkingLot", (done) => {
    new ParkingLot().save.mockImplementation(() => ({
      name: "Central World Floor 4",
      floor: 2,
      slots: {
        s: [
          {
            slotID: 1,
            status: "available",
          },
        ],
        m: [
          {
            slotID: 3,
            status: "available",
          },
        ],
        l: [
          {
            slotID: 5,
            status: "available",
          },
        ],
        xl: [
          {
            slotID: 7,
            status: "available",
          },
        ],
        xxl: [
          {
            slotID: 9,
            status: "available",
          },
        ],
      },
      _id: "633aec69d057cff907e6f8bd",
      createdAt: "2022-10-03T14:06:33.926Z",
      updatedAt: "2022-10-03T14:06:33.926Z",
    }));
    const create = parkingService.createParkingLot({
      name: "Central World Floor 4",
      floor: 2,
      slots: {
        s: 1,
        m: 1,
        l: 1,
        xl: 1,
        xxl: 1,
      },
    });
    expect(create).toMatchObject({
      name: "Central World Floor 4",
      floor: 2,
      slots: {
        s: [
          {
            slotID: 1,
            status: "available",
          },
        ],
        m: [
          {
            slotID: 3,
            status: "available",
          },
        ],
        l: [
          {
            slotID: 5,
            status: "available",
          },
        ],
        xl: [
          {
            slotID: 7,
            status: "available",
          },
        ],
        xxl: [
          {
            slotID: 9,
            status: "available",
          },
        ],
      },
      _id: "633aec69d057cff907e6f8bd",
      createdAt: "2022-10-03T14:06:33.926Z",
      updatedAt: "2022-10-03T14:06:33.926Z",
    });
    done();
  });
});
