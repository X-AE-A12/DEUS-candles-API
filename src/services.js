"use strict"

const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const Config = require("./config");
const Controller = require("./controller");
const Fastify = require("./fastify");
const Model = require("./model");
const Routes = require("./routes");

let config = undefined;
let fastify = undefined;
let model = undefined;
let controller = undefined;
let routes = undefined;

module.exports = {

    init: function() {
        this.initDatabase();
        this.initFastify();
    },

    initDatabase: function() {
    		return mongoose.connect(this.getConfig().db_url, {
      			useNewUrlParser: true,
      			useFindAndModify: false,
      			useCreateIndex: true,
      			useUnifiedTopology: true
    		}).then(() => console.log("MongoDB connected…"))
          .catch(err => console.log(err));
  	},

    initFastify: function() {
        return Fastify(
            this.getRoutes()
        );
    },

    getConfig: function () {
        if (config) return config;

        try {
            return config = require("./config");
        } catch (e) {
            throw "Invalid config.js file. Please check" + String(e);
            return process.exit();
        }
    },

    getController: function () {
        if (controller) return controller;
        return (controller = new Controller(
            this.getConfig(),
            this.getModel()
        ))
    },

    getModel: function () {
        return Model;
    },

    getRoutes: function() {
        return Routes(
            this.getController()
        )
    }

}
