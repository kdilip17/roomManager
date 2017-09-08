/**
 * Created by dilip on 21/2/17.
 */
"use strict";

// var routes = require('./lib/routes');
const appConfig = require('./lib/config/app');
// const fs = require('fs');
// var DB        = require('./lib/config/dbConfig')
// var ctrlPath = appConfig.ctrlPath;
const path = require('path');
const pack = require('./package')
const routes = require('./lib/route')
const Inert = require('inert')
const Vision = require('vision')
const HmSwagger = require('hm-hapi-swagger')
const Hmauth = require('hm-hapi-auth')
const Hapi = require('hapi');


// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host:"0.0.0.0",
    port: 9000
});



appConfig.swaggerOptions.apiVersion = pack.version
server.register([
    Inert,
    Vision,
    {
        register: HmSwagger,
        options : appConfig.swaggerOptions
    }], (err)=> {
})

/** Load routes in routes Dir **/
for (const route in routes) {
    if (Array.isArray(routes[route]))
        server.route(routes[route])
}

/** Load Public Directory Files **/
server.route({
    method : 'GET',
    path   : '/static/{param*}',
    handler: {
        directory: {
            path: 'public'
        }
    }
})

/** Start the Server Command **/
server.start(() => {
    console.log("Server " + pack.version + " started at %s", server.info.uri)
})
