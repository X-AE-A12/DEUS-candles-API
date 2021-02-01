const controller = require("./controller")

module.exports = [
    {
      method: 'GET',
      url: '/v1/ping',
      handler: controller.ping
    },
    {
      method: 'GET',
      url: '/v1/pools',
      handler: controller.getPools
    },
    {
      method: 'GET',
      url: '/v1/intervals',
      handler: controller.getIntervals
    },
    {
      method: 'GET',
      url: '/v1/protocols',
      handler: controller.getProtocols
    },
    {
      method: 'GET',
      url: '/v1/candlesticks',
      handler: controller.getCandlesticks
    },
    {
      method: 'GET',
      url: '/v1/transactions',
      handler: controller.getTransactions
    },
]
