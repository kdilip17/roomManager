/**
 * Created by dilip on 8/1/17.
 */
"use strict";

const Hapi = require('hapi')
const Inert = require('inert')
const Vision = require('vision')
const HmSwagger = require('hm-hapi-swagger')
const Hmauth = require('hm-hapi-auth')

global._RES_MSG = {} // Global constiable for Maintain the Response Message Handle :)

const pack = require('./package')
const routes = require('./lib/route')
const resUtl = require('./lib/util/response')
const appConfig = require('./lib/config/app')

// const onloginService = require('./lib/service/onelogin')
// const logService = require('./lib/service/log')
const msgService = require('./lib/service/msgDespatcher')

// Create a server with a host and port
const server = new Hapi.Server();
//const server = new Hapi.Server({debug: {log: ['error'], request: ['error']}})


/** Setup Configuration **/
server.connection(appConfig.server)

/** Auth Register **/
server.register({register: Hmauth}, (err)=> {
    if (err) {
        server.log(['error'], 'hmauth plugin load error: ' + err)
    }
    else {
        server.auth.strategy('hmauth', 'hm-auth', {
            allowQueryToken     : true,              // optional, true by default
            allowMultipleHeaders: true,        // optional, true by default
            accessTokenName     : 'authToken',    // optional, 'access_token' by default
            validateFunc        : function (authToken, callback) {
                onloginService.validateSessionForSetup({payload: {authToken: authToken}}, (err, authObj)=> {
                    if (err) {
                        return callback(err, false, {token: authToken})
                    }
                    else {
                        return callback(null, authObj);
                    }
                });
            }
        });

        server.auth.strategy('setupauth', 'hm-auth', {
            allowQueryToken     : true,              // optional, true by default
            allowMultipleHeaders: true,        // optional, true by default
            accessTokenName     : 'authToken',    // optional, 'access_token' by default
            validateFunc        : function (authToken, callback) {
                onloginService.validateSessionForSetup({payload: {authToken: authToken}}, (err, authObj)=> {
                    if (err) {
                        return callback(err, false, {token: authToken})
                    }
                    else {
                        return callback(null, authObj)
                    }
                });
            }
        });
    }
});

/** Register the Swagger Plugin **/
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

server.ext('onPostHandler', (request, reply) => {

    if (request.response.isBoom)
        return reply.continue()
    else if (request.route.settings.app.methodId) {
        let res = request.response.source
        const meta = request.pre.data.meta
        if (res && res.isError) {
            return reply(resUtl.getDynamicMsgFailed(meta, res))
        }
        //For Success
        const response = resUtl.getDynamicMsgSuccess(meta, res)
        request.response.source = response
        request.response.statusCode = response.meta.statusCode
        return reply.continue()
    }
    else
        return reply.continue()

});


server.ext('onPreResponse', (request, reply) => {
    request.headers["origin"] = "*";
    if (request.route.settings.app.methodId && request.pre.data) {
        console.log()
        let logObj = {}
        if (request.response.isBoom) {
            logObj = {
                id        : request.id,
                isError   : true,
                statusCode: request.response.output.statusCode,
                res       : request.response.output.payload
            }
        } else {
            logObj = {
                id        : request.id,
                isError   : false,
                statusCode: request.response.statusCode,
                res       : request.response.source
            }
        }
        // logService.closeRequestLog(logObj)
    }
    return reply.continue()
});