var express = require("express");
var router = express.Router();
const validator = require("../middleware/validator.middleware");
const carController = require("../controller/car.controller");
const parkingController = require("../controller/parking.controller");
const ticketController = require("../controller/ticket.controller");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("parking lot api");
});
router.post("/parking", validator.validate, parkingController.create);
router.get("/parking/status", parkingController.getStatus);
router.get("/parking/allocated", parkingController.allocated);

router.get("/ticket", ticketController.getTicket);

router.post("/car/park", carController.park);
router.post("/car/leave", carController.leave);

module.exports = router;
