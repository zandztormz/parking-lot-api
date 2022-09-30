const ticketService = require("../service/ticketService");
const parkingService = require("../service/parkingService");
const { HTTP_CODE } = require("../libs/constants");

const park = async (req, res) => {
  const { size, floor, plateNumber } = req.body;
  try {
    const parkingLots = await parkingService.findNearestParkingSlot(
      floor,
      size
    );
    if (!parkingLots) {
      throw new Error("no available slot");
    }
    const availableSlot = parkingService.findAvailableSlot(parkingLots);

    const createdTicket = await ticketService.createTicket(
      plateNumber,
      size,
      parkingLots,
      availableSlot.slotID
    );

    await parkingService.allocatedParkingSlot(
      parkingLots._id,
      size,
      availableSlot.slotID
    );

    res.send({
      code: 200,
      data: createdTicket,
      message: `Ticket has created`,
    });
  } catch (e) {
    if (e.message === "no available slot") {
      res.status(HTTP_CODE.NOT_FOUND).send({
        code: HTTP_CODE.NOT_FOUND,
        message: e.message,
      });
    } else {
      res.status(HTTP_CODE.INTERNAL_ERROR).send({
        code: HTTP_CODE.INTERNAL_ERROR,
        message: e.message,
      });
    }
  }
};

const leave = async (req, res, next) => {
  const { id } = req.body;
  try {
    const ticket = await ticketService.findTicketById(id);
    await parkingService.releaseParkingSlot(ticket);
    await ticketService.stampExit(ticket);
    res.send({
      code: 200,
      message: `Ticket has exited`,
    });
  } catch (e) {
    res.status(HTTP_CODE.INTERNAL_ERROR).send({
      code: HTTP_CODE.INTERNAL_ERROR,
      message: e.message,
    });
  }
};

module.exports = {
  park,
  leave,
};
