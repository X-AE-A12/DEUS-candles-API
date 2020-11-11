"use strict"

const boom = require('@hapi/boom')

let self = undefined;

module.exports = class Controller {
    constructor(config, model) {
        this.config = config;
        this.model = model;
        this.supported_intervals = config.supported_intervals
        this.symbols = config.symbols // TODO: make this dynamic

        self = this
    }

    ping (req, reply) {
        return {
            status: 200
        }
    }

    // http://127.0.0.1:3000/candles?symbol=ETHBTC&interval=1d&from=1597795200&to=1607809600
    async getCandles (req, reply) {

        // TODO: need to sanitize this + sql injection and shit
        // TODO: sort candles so they are in chronological order
        const { symbol, interval, from, to } = req.query
        try {
            return await self.model.aggregate([
              {
                $match: {
                  s: symbol,
                  i: interval,
                  t: {
                      $gte: Number(from),
                      $lte: Number(to)
                  }
                }
              }, {
                $project: {
                  o: 1,
                  h: 1,
                  l: 1,
                  c: 1,
                  bv: 1,
                  qv: 1,
                  t: 1,
                  _id: 0
                }
              }
            ]).exec()
        } catch (err) {
            throw boom.boomify(err)
        }
    }

}
