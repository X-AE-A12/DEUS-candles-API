module.exports = (controller) => {
    return [
      {
        method: 'GET',
        url: '/ping',
        handler: controller.ping
      },
      {
        method: 'GET',
        url: '/candles',
        handler: controller.getCandles
      }
    ]
}
