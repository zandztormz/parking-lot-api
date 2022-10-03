const Ticket = require("../models/ticket.model");
const findTicketById = (ticketId) => Ticket.findById(ticketId);
const stampExit = (ticket) =>
  ticket.updateOne({
    exitedAt: new Date(),
  });

const createTicket = (plateNumber, size, parkingLots, slotID) =>
  new Ticket({
    plateNumber,
    size,
    parkingFloor: parkingLots.floor,
    parkingId: parkingLots._id,
    slotID,
    parkedAt: new Date(),
  }).save();

const getAllocatedByCarSize = async (size) => {
  const tickets = await Ticket.find({ size, exitedAt: { $eq: null } });
  return tickets.map((value) => ({
    ticketId: value._id,
    plateNumber: value.plateNumber,
    carSize: value.size,
    parkingLotId: value.slotID,
    parkingId: value.parkingId,
    parkingFloor: value.parkingFloor,
    parkedAt: value.parkedAt,
  }));
};

const getRegistrationPlateNumberByCarSize = (size) =>
  Ticket.aggregate([
    {
      $match: {
        size: size,
      },
    },
    {
      $group: {
        _id: {
          plateNumber: "$plateNumber",
          size: "$size",
        },

        totalOfPark: { $sum: 1 },
      },
    },
    {
      $project: {
        plateNumber: "$_id.plateNumber",
        size: "$_id.size",
        totalOfPark: "$totalOfPark",
        _id: 0,
      },
    },
    { $sort: { plateNumber: -1 } },
  ]);

module.exports = {
  findTicketById,
  stampExit,
  createTicket,
  getAllocatedByCarSize,
  getRegistrationPlateNumberByCarSize,
};
