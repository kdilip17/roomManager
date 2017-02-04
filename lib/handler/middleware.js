/**
 * Created by dilip on 8/1/17.
 */
"use strict";

//This Controller will handle all route PreRequest & PostResponse Privilege
const boom = require('boom')
const middleWare = {}
// const aclService = require('../service/acl')
// const logService = require('../service/log')
const pack = require('../../package')

/**
 *  // Prepare the Request Data
 * @param req
 * @param reply
 */
middleWare.prepareReq = (req, reply)=> {
    req.headers["origin"] = "*";
    const newReq = {
        params : req.params,
        query  : req.query,
        payload: req.payload,
        auth   : req.auth.credentials,
        meta   : {
            id      : req.id,
            methodId: req.route.settings.app.methodId,
            apiVer  : pack.version
        }
    };
    return reply(newReq);
}

/**
 *  //Check Privilege for all request using ACL
 * @param req  => Request Parameter
 * @param reply
 */
/*middleWare.checkPrivilege = (req, reply)=> {
    aclService.checkPrivilege(req.pre.data, (err, res) => {
        if (err) {
            let error = boom.create(403);
            error.reformat();
            error.output.payload = {
                id        : req.pre.data.meta.id,
                code      : err.code,
                message   : err.msg ? err.msg : "Sorry: You don't have access this route permission :(",
                "error"   : "Forbidden",
                statusCode: 403,
                userMsg   : "You don't have permission"
            };
            return reply();
        }
        else {
            req.pre.data.meta.userLevel = res.userLevel
            return reply()
        }

    })
}*/

/**
 *  //Initialise Request Log to Log Engine For all Request
 * @param req  => Request Parameter
 * @param reply
 */

/*middleWare.initReqLog = (req, reply)=> {
    let reqInfos = req.id.split(":");
    let logObj = {
        id       : req.id,
        methodId : req.pre.data.meta.methodId,
        serverId : reqInfos[1],
        processId: reqInfos[2],
        clientIp : req.info.remoteAddress,
        crDt     : new Date(),
        buildVer : pack.version,
        req      : req.pre.data
    }
    logService.initRequestLog(logObj)
    return reply();
}*/

module.exports = middleWare


