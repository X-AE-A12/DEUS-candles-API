const v1Routes = require("./v1/routes")
const baseRoutes = [{
    method: 'GET',
    url: '/',
    handler: (req, res) => {
        return res.redirect("/v1/ping")
    }
}]

module.exports = [
    ...baseRoutes,
    ...v1Routes
]
