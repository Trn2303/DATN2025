exports.index = (req, res) => {
  res.send("Order index");
};
exports.order = (req, res) => {
  try {
    const { body } = req;
    console.log(body);
  } catch (error) {
    res.status(500).json(error);
  }
};
