/**
 * Created by dilip on 4/2/17.
 */
"use strict";

const esDb = require("../config/esConfig");
var esIndex = require('../config/esIndex');
var dataSchm = require("../schema/data/account")
var joi = require('joi');
const utils = require("../util/response")
var _ = require("underscore")

let external = {}

external.addExpense = (payload, callBack)=> {
    joi.validate(payload, dataSchm.expense, {}, function (err, validDoc) {
        if (err) {
            return callBack({code: "REG001", msg:"VALIDATION ERROR"});
        } else {
            var createParam = {"index": esIndex.expense, "type": esIndex.org, "id": payload.id};

            createParam.body = validDoc;
            esDb.create(createParam, function (err, result) {
                if(err){
                    return callBack({code: "REG002", msg:"ES ERROR"});
                }else{
                    callBack(null,result)
                }
            });
        }
    });
}

external.getDefaultExpenseList = (payload,callBack) => {
    var countQuery = {
        index: esIndex.default,
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
                utils.buildFilterQuery(payload, esIndex.default, function (err, searchQuery) {
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

external.getExpenseList = (payload,callBack) => {
    var countQuery = {
        index: esIndex.expense,
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
                if(!payload.isList) {
                    payload.filters.push({
                        type: "F",
                        key: "month",
                        value: [payload.month]
                    })
                    payload.filters.push({
                        type: "F",
                        key: "year",
                        value: [payload.year]
                    })
                    payload.filters.push({
                        type: "F",
                        key: "members.id",
                        value: [payload.memberId]
                    })
                }
                payload.orgId = esIndex.org
                // console.log(payload);
                utils.buildFilterQuery(payload, esIndex.expense, function (err, searchQuery) {
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

external.addDefaultExpense = (payload, callBack)=> {
    joi.validate(payload, dataSchm.defaultExpense, {}, function (err, validDoc) {
        if (err) {
            return callBack({code: "REG001", msg:"VALIDATION ERROR"});
        } else {
            var createParam = {"index": esIndex.default, "type": esIndex.org, "id": payload.id};

            createParam.body = validDoc;
            esDb.create(createParam, function (err, result) {
                if(err){
                    return callBack({code: "REG002", msg:"ES ERROR"});
                }else{
                    callBack(null,result)
                }
            });
        }
    });
}

external.getExpenseById = (expenseId,callBack) => {
    let getParams = {
        index: esIndex.expense,
        type: esIndex.org,
        id:expenseId
    }
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

external.getDefaultExpenseById = (expenseId,callBack) => {
    let getParams = {
        index: esIndex.default,
        type: esIndex.org,
        id:expenseId
    }
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

external.deleteDefaultExpenseById = (expenseId,callBack) => {
    var params = {
        "index": esIndex.default,
        "type": esIndex.org,
        "id": expenseId
    }
    esDb.delete(params, function (err, result) {
        if(err){
            return callBack({code: "REG004", msg:"ES ERROR"});
        }else{
            callBack(null,result)
        }
    });
}

external.deleteExpenseById = (expenseId,callBack) => {
    var params = {
        "index": esIndex.expense,
        "type": esIndex.org,
        "id": expenseId
    }
    esDb.delete(params, function (err, result) {
        if(err){
            return callBack({code: "REG004", msg:"ES ERROR"});
        }else{
            callBack(null,result)
        }
    });
}

module.exports = external;

