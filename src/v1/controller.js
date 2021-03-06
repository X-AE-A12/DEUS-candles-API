const boom = require('@hapi/boom')

const Config = require("../config")
const Helpers = require("./helpers")

const CandlestickModel = require("./models/candlestick.model")
const LiveCandlestickModel = require("./models/liveCandlestick.model")
const TransactionModel = require("./models/transaction.model")
const ProtocolModel = require("./models/protocol.model")
const PoolModel = require("./models/pool.model")
const IntervalModel = require("./models/interval.model")

const ping = () => {
    return {
        statusCode: 200,
    }
}

const getIntervals = async () => {
    try {
        const docs = await IntervalModel.find({}).select("-_id -__v").lean()
        if (!docs) return []
        return docs
    } catch (err) {
        throw boom.boomify(err)
    }
}

const getProtocols = async () => {
    try {
        const docs = await ProtocolModel.find({}).select("-_id -__v").lean()
        if (!docs) return []
        return docs
    } catch (err) {
        throw boom.boomify(err)
    }
}

const getPools = async () => {
    try {
        const docs = await PoolModel.find({}).select("-_id -__v").lean()
        if (!docs) return []
        return docs
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

        return await promise1
        // NOT ACTIVATED YET
        // if (live) {
        //     const promise2 = LiveCandlestickModel.findOne({ poolContract, interval }).select([ "-_id", "t", "o", "h", "l", "c", "v" ]).lean()
        //     const [ candlestickHistory, currentCandlestick ] = await Promise.all([ promise1, promise2 ])
        //     return [ ...candlestickHistory, currentCandlestick ]
        // } else {
        //     return await promise1
        // }

    } catch (err) {
        throw boom.boomify(err)
    }
}

// http://127.0.0.1:8080/v1/transactions?poolContract=0xa478c2975ab1ea89e8196811f51a7b7ade33eb11&from=1611584405&to=99999999999999
const getTransactions = async (req, reply) => {
    try {
        const { poolContract, from, to } = req.query
        const promise1 = TransactionModel.aggregate([
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

        const promise2 = Helpers.getPoolFromPoolContract(poolContract)
        const [ results, poolInfo ] = await Promise.all([ promise1, promise2 ])
        if (!poolInfo) throw new Error("poolContract doesn't exist")

        const { tokenName, pairName, inversePrice } = poolInfo
        const priceDirection = (inversePrice)
            ? `${pairName}:${tokenName}`
            : `${tokenName}:${pairName}`;

        return {
            tokenName: tokenName,
            pairName: pairName,
            priceDirection: priceDirection,
            results: results
        }
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
