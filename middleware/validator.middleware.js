module.exports = {
  validate: (req, res, next) => {
    let isError = false;
    Object.values(req.body.slots).forEach((value) => {
      if (typeof value !== "number") {
        isError = true;
      }
    });

    if (isError) {
      res.status(400).send({
        code: 400,
        message: "Slots have contained a string",
      });
    } else {
      next();
    }
  },
};
