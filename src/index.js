const mongoose = require("mongoose")

const Routes = require("./routes")
const Config = require("./config")

const fastify = require('fastify')({
    logger : true
})

// Connect to DB
mongoose.connect(Config.mongoose.url, Config.mongoose.options)
  .then(() => fastify.log.info('MongoDB connected...'))
  .catch(err => fastify.log.error(err))

// Init routes
for (const route of Routes) {
    fastify.route(route)
}

// Init server
const start = async () => {
    try {
        await fastify.listen(process.env.PORT || 8080, '0.0.0.0')
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
