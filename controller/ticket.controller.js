const { HTTP_CODE } = require("../libs/constants");
const ticketService = require("../service/ticketService");
const getTicket = async (req, res, next) => {
  const { size } = req.query;
  try {
    if (!size) {
      throw Error("Car size is required");
    }

    res.send(await ticketService.getRegistrationPlateNumberByCarSize(size));
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
  getTicket,
};
