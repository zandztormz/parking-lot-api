const ticketService = require("../service/ticketService");
const parkingService = require("../service/parkingService");

const create = async (req, res) => {
  try {
    res.status(201).send(await parkingService.createParkingLot(req.body));
  } catch (e) {
    res.status(500).send({
      code: 500,
      message: e.message,
    });
  }
};

const getStatus = async (req, res) => {
  try {
    res.send(await parkingService.getParkingStatus());
  } catch (e) {
    res.status(400).send({
      code: 400,
      message: e.message,
    });
  }
};

const allocated = async (req, res) => {
  const { size } = req.query;
  try {
    if (!size) {
      throw Error("Car size is required");
    }
    res.send(await ticketService.getAllocatedByCarSize(size));
  } catch (e) {
    res.status(400).send({
      code: 400,
      message: e.message,
    });
  }
};

module.exports = {
  create,
  allocated,
  getStatus,
};
