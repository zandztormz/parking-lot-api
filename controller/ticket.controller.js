const ticketService = require("../service/ticketService");
const getTicket = async (req, res, next) => {
  const { size } = req.query;
  try {
    if (!size) {
      throw Error("Car size is required");
    }

    res.send(await ticketService.getRegistrationPlateNumberByCarSize(size));
  } catch (e) {
    res.status(400).send({
      code: 400,
      message: e.message,
    });
  }
};
module.exports = {
  getTicket,
};
