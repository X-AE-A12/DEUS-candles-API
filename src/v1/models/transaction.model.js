const mongoose = require("mongoose")
module.exports = mongoose.model("Transaction", mongoose.Schema(), "transactions")
