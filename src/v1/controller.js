const boom = require('@hapi/boom')

const Config = require("../config")
const CandlestickModel = require("./models/candlestick.model")
const LiveCandlestickModel = require("./models/liveCandlestick.model")
const TransactionModel = require("./models/transaction.model")
const InfoModel = require("./models/info.model")

const ping = () => {
    return {
        statusCode: 200,
    }
}

const getIntervals = async () => {
    try {
        const doc = await InfoModel.findOne({}).lean()
        if (!doc) return []
        return doc.intervals
    } catch (err) {
        throw boom.boomify(err)
    }
}

const getProtocols = async () => {
    try {
        const doc = await InfoModel.findOne({}).lean()
        if (!doc) return []
        return doc.protocols
    } catch (err) {
        throw boom.boomify(err)
    }
}

const getPools = async () => {
    try {
        const doc = await InfoModel.findOne({}).lean()
        if (!doc) return []
        return doc.pools
    } catch (err) {
        throw boom.boomify(err)
    }
}

// http://127.0.0.1:8080/v1/candlesticks?poolContract=0xa478c2975ab1ea89e8196811f51a7b7ade33eb11&interval=1m&from=0&to=99999999999999&live=false
const getCandlesticks = async (req, reply) => {
    try {
        const { poolContract, interval, from, to, live } = req.query
        const promise1 = CandlestickModel.aggregate([
          {
            $match: {
              poolContract: poolContract,
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
              v: 1,
              t: 1,
              _id: 0
            }
          },
          {
            $sort: {
              timestamp: 1 // [ oldest to newest ]
            }
          },
        ]).allowDiskUse(true)

        if (live) {
            const promise2 = LiveCandlestickModel.findOne({ poolContract, interval }).select([ "-_id", "t", "o", "h", "l", "c", "v" ]).lean()
            const [ candlestickHistory, currentCandlestick ] = await Promise.all([ promise1, promise2 ])
            return [ ...candlestickHistory, currentCandlestick ]
        } else {
            return await promise1
        }

    } catch (err) {
        throw boom.boomify(err)
    }
}

// http://127.0.0.1:8080/v1/transactions?poolContract=0xa478c2975ab1ea89e8196811f51a7b7ade33eb11&from=1611584405&to=99999999999999
const getTransactions = async (req, reply) => {
    try {
        const { poolContract, from, to } = req.query
        return await TransactionModel.aggregate([
            {
              $match: {
                poolContract: poolContract,
                timestamp: {
                    $gte: Number(from),
                    $lte: Number(to)
                }
              }
            },
            {
              $project: {
                _id: 0,
                timestamp: 1,
                blockNumber: 1,
                logIndex: 1,
                price: 1,
                volume: 1,
              }
            },
            {
              $sort: {
                timestamp: 1 // [ oldest to newest ]
              }
            },
        ]).allowDiskUse(true)
    } catch (err) {
        throw boom.boomify(err)
    }
}

module.exports = {
    ping,
    getIntervals,
    getProtocols,
    getPools,
    getCandlesticks,
    getTransactions,
}
