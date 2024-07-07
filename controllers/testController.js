const asyncHandler = require("express-async-handler");

exports.list = asyncHandler(async (req, res, next) => {
  res.ok()
});