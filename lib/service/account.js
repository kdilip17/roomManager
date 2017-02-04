/**
 * Created by dilip on 8/1/17.
 */
"use strict";


const esDb = require("../config/esConfig");
var esIndex = require('../config/esIndex');
var dataSchm = require("../schema/data/account")
var joi = require('joi');
var utils = require("../util/response")
var _ = require("underscore")
let external = {}

external.deleteUserSrv = (emailId,callBack) => {
    var params = {
        "index": esIndex.user,
        "type": esIndex.org,
        "id": emailId
    }
    esDb.delete(params, function (err, result) {
        if(err){
            return callBack({code: "REG004", msg:"ES ERROR"});
        }else{
            callBack(null,result)
        }
    });
}

external.editUser = (payload, callBack) => {
    joi.validate(payload, dataSchm.register, {}, function (err, validDoc) {
        console.log(err)
        if (err) {
            return callBack({code: "REG001", msg:"VALIDATION ERROR"});
        } else {
            var updateParam = {
                "index": esIndex.user,
                "type": validDoc.orgId,
                "id": validDoc.emailId
            };

            updateParam.body = {doc: validDoc};
            esDb.update(updateParam, function (err, result) {
                if(err){
                    return callBack({code: "REG003", msg:"ES ERROR"});
                }else{
                    callBack(null,result)
                }
            });
        }
    });
}

external.register = (payload, callBack)=> {
    joi.validate(payload, dataSchm.register, {}, function (err, validDoc) {
        console.log(err)
        if (err) {
            return callBack({code: "REG001", msg:"VALIDATION ERROR"});
        } else {
            var createParam = {"index": esIndex.user, "type": esIndex.org, "id": payload.emailId};

            createParam.body = validDoc;
            esDb.create(createParam, function (err, result) {
                console.log(err)
                if(err){
                    return callBack({code: "REG002", msg:"ES ERROR"});
                }else{
                    callBack(null,result)
                }
            });
        }
    });
}

external.getUserList = (payload,callBack) => {
    var countQuery = {
        index: esIndex.user,
        type : esIndex.org
    };
    esDb.count(countQuery, function (err, expCount, status) {
        if (err) {
            if (status == 404) {
                return callBack(null, false);
            } else {
                return callBack({code: "GEN01", msg:"NO RECORD FOUND"});
            }
        } else {
            if (expCount.count > 0) {
                payload.index = 0
                payload.limit = expCount.count;
                if (!payload.filters) {
                    payload.filters = [];
                }
                payload.orgId = esIndex.org
                // console.log(payload);
                utils.buildFilterQuery(payload, esIndex.user, function (err, searchQuery) {
                    if (!err) {
                        console.log(JSON.stringify(searchQuery))
                        esDb.search(searchQuery, function (err, res, status) {
                            // console.log(err,res,status)
                            if (_.isEmpty(err)) {
                                return callBack(null, res);
                            } else {
                                if (status == 404) {
                                    return callBack(null, false);
                                } else {
                                    return callBack({code: "GEN01", data: {}});
                                }
                            }
                        });
                    } else {
                        return callBack(err);
                    }
                });
            } else {
                return callBack(null, false);
            }
        }
    });
}

external.getUserByEmail = (emailId,callBack) => {
    let getParams = {
        index: esIndex.user,
        type: esIndex.org,
        id:emailId
    }
    // console.log(getParams);
    esDb.get(getParams,function (err,res) {
        if(err){
            if(err.status=="404"){
                return callBack(null,{isExist:false})
            }else{
                return callBack(err)
            }
        }else{
            return callBack(null,{isExist:true,data:res})
        }
    })
}

module.exports = external;
