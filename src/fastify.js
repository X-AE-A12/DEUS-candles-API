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
        console.log(process.env.PORT);
        await fastify.listen(process.env.PORT || 8080)
        fastify.log.info(`server listening on port ${process.env.PORT}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }

}
