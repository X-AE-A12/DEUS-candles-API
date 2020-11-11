"use strict";

const mongoose = require("mongoose");

const candleSchema = mongoose.Schema({
	s:   {type: String, required: true}, // symbol => rTSLA
	i:   {type: String, required: true}, // interval
	t:   {type: Number, required: true}, // open time => UNIX
	o:   {type: Number, required: true}, // open
	h:   {type: Number, required: true}, // high
	l:   {type: Number, required: true}, // low
	c:   {type: Number, required: true}, // close
	bv:  {type: Number, required: true}, // volume of base asset => DEUS:rTSLA > DEUS
	qv:  {type: Number, required: true}  // volume of quote asset => DEUS:rTSLA > rTSLA
});
const CandleStickModel = mongoose.model("candle", candleSchema);

module.exports = CandleStickModel;
