module.exports = async (routes) => {

    // Init fastify
    const fastify = require("fastify")({
        logger: true
    })

    // Init routes
    for (const route of routes) {
        fastify.route(route)
    }

    // Init server
    try {
        await fastify.listen(process.env.PORT || 8080, '0.0.0.0')
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }

}
