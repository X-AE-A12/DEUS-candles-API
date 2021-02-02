const PoolModel = require("./models/pool.model")

const getPoolFromPoolContract = async (poolContract) => {
    try {
        if (!poolContract) throw new Error("Params are missing")
        let result = await PoolModel.findOne({ poolContract: poolContract }).select("-_id -__v")
        if (result) return result.toJSON()
        return null
    } catch (err) {
        throw err
    }
}

module.exports = {
    getPoolFromPoolContract,
}
