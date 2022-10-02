const ticketService = require("../service/ticketService");
const parkingService = require("../service/parkingService");
const { HTTP_CODE } = require("../libs/constants");

const create = async (req, res) => {
  try {
    res
      .status(HTTP_CODE.CREATED)
      .send(await parkingService.createParkingLot(req.body));
  } catch (e) {
    res.status(HTTP_CODE.BAD_REQUEST).send({
      code: HTTP_CODE.BAD_REQUEST,
      message: e.message,
    });
  }
};

const getStatus = async (req, res) => {
  try {
    res.send(await parkingService.getParkingStatus());
  } catch (e) {
    res.status(HTTP_CODE.INTERNAL_ERROR).send({
      code: HTTP_CODE.INTERNAL_ERROR,
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
    if (e.message === "Car size is required") {
      res.status(HTTP_CODE.BAD_REQUEST).send({
        code: HTTP_CODE.BAD_REQUEST,
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

module.exports = {
  create,
  allocated,
  getStatus,
};
