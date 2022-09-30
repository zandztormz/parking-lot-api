const ParkingLot = require("../models/parking_lot.model");
const getParkingStatus = () => ParkingLot.find();
const findNearestParkingSlot = async (floor, carSize) => {
  const parkingLots = await ParkingLot.aggregate([
    {
      $project: {
        diff: { $abs: { $subtract: [parseInt(floor), "$floor"] } },
        floor: "$floor",
        slots: `$slots.${carSize}`,
        name: "$name",
      },
    },
    {
      $sort: { diff: 1, floor: 1 },
    },
  ]);

  return parkingLots.filter(
    (parks) =>
      parks.slots.filter((value) => value.status === "available").length > 0
  )[0];
};

const findAvailableSlot = (parkingLots) =>
  parkingLots.slots.filter((val) => val.status === "available")[0];

const releaseParkingSlot = async (ticket) => {
  const { slotID, size, parkingId } = ticket;
  await ParkingLot.updateOne(
    {
      _id: parkingId,
      [`slots.${size}.slotID`]: slotID,
    },
    {
      $set: {
        [`slots.${size}.$.status`]: "available",
      },
    }
  );
};

const allocatedParkingSlot = async (parkingLotId, size, slotId) => {
  await ParkingLot.updateOne(
    {
      _id: parkingLotId,
      [`slots.${size}.slotID`]: slotId,
    },
    {
      $set: {
        [`slots.${size}.$.status`]: "unavailable",
      },
    }
  );
};

const createParkingLot = (params) => {
  const { name, floor, slots } = params;
  const { s, m, l, xl } = slots;
  const slot = {
    s: [],
    m: [],
    l: [],
    xl: [],
  };
  for (let i = 1; i <= s; i++) {
    slot.s.push({
      slotID: i,
      status: "available",
    });
  }
  for (let i = 1; i <= m; i++) {
    slot.m.push({
      slotID: i + slot.s.length,
      status: "available",
    });
  }
  for (let i = 1; i <= l; i++) {
    slot.l.push({
      slotID: i + slot.m.length + slot.s.length,
      status: "available",
    });
  }
  for (let i = 1; i <= xl; i++) {
    slot.xl.push({
      slotID: i + slot.l.length + slot.m.length + slot.s.length,
      status: "available",
    });
  }
  return new ParkingLot({
    name,
    floor,
    slots: slot,
  }).save();
};

module.exports = {
  releaseParkingSlot,
  findNearestParkingSlot,
  findAvailableSlot,
  allocatedParkingSlot,
  getParkingStatus,
  createParkingLot,
};
