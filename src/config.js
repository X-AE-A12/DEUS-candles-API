module.exports = {
    db_url: process.env.DB_URL,
    port: process.env.PORT || 8080,
    supported_intervals: [ "1h" ],
    symbols: [ "rTSLA" ]
}
