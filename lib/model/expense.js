/**
 * Created by dilip on 4/2/17.
 */
"use strict";

var async = require("async")
var moment = require("moment")
var shortId = require("shortid")
var expSrv = require("../service/expense")
var _ = require("underscore")
var externals = {}

externals.getExpenseReport = (req,callBack) => {
    var payload = req.payload;
    payload.sortingKey = "crDt"
    payload.sortBy = "crDt"
    let tasks = []
    var memberId = payload.memberId
    var finalArr = [],finalRes = {
        memberId : payload.memberId
    }
    tasks.push(function (callback) {
        expSrv.getDefaultExpenseList(payload,function (err,resp) {
            if(err){

            }else{
                if (resp && resp.hits && resp.hits.hits) {
                    var totalCount = resp.hits.total;
                    var defaultExpArr = _.pluck(resp.hits.hits, '_source');
                    _.each(defaultExpArr,function (defaultExp) {
                        finalArr.push({
                            id : defaultExp.id,
                            name : defaultExp.name,
                            amount : 0
                        })
                    })
                    return callback(null,true)
                }
                else {
                    return callback({code:"DEX002",msg:"NO DEFAULT EXPENSE FOUND"});
                }
            }
        })
    })
    tasks.push(function (expNext,callback) {
        expSrv.getExpenseList(payload, function (err, response) {
            if(err){
                return callback({code: "CUS001", msg: "INTERNAL ERROR", data: {}})
            }else{
                return callback(null,response)
            }
        })
    })
    tasks.push(function (response, callback) {
        if (response && response.hits && response.hits.hits) {
            var totalCount = response.hits.total;
            var expenseArr = _.pluck(response.hits.hits, '_source');
            // console.log(expenseArr);
            _.each(expenseArr,function (exp) {
                var findExp = _.find(finalArr,function (final) {
                    return final.id == exp.expense.id;
                })
                if(findExp){
                    var findMem = _.find(exp.members,function (expMem) {
                        return expMem.id == memberId
                    })
                    if(findMem){
                        findExp.amount = Math.round(findMem.amount);
                    }
                }
            })
            return callback(null,true)
        }
        else {
            return callback(null, finalArr);
        }
    })
    async.waterfall(tasks, function (err,res) {
        if(err){
            return callBack(err)
        }else{
            req.meta.statusCode = 200;
            req.meta.message = "Success";
            req.meta.userMsg = "Success";
            let grandTotal = 0
            _.each(finalArr,function (fin) {
                grandTotal += fin.amount;
            })
            var response = {
                memberId:memberId,
                expenses:finalArr,
                totalExpense:grandTotal
            }
            return callBack(null, {meta: req.meta,expense:response})
        }
    });
}

externals.defaultExpenseList = (req,callBack) => {
    var payload = {}
    expSrv.getDefaultExpenseList(payload,function (err,resp) {
        if(!err){
            if (resp && resp.hits && resp.hits.hits) {
                var totalCount = resp.hits.total;
                var defaultArr = _.pluck(resp.hits.hits, '_source');
                req.meta.statusCode = 200;
                req.meta.message = "Success";
                req.meta.userMsg = "Success";
                return callBack(null, {meta:req.meta,defExps:defaultArr})
            }
            else {
                return callBack({code:"DEX002",msg:"NO DEFAULT EXPENSE FOUND"});
            }
        }else{
            return callBack(err)
        }
    })
}

externals.expenseList = (req,callBack) => {
    var payload = {}
    payload.isList = true;
    expSrv.getExpenseList(payload,function (err,resp) {
        if(!err){
            if (resp && resp.hits && resp.hits.hits) {
                var totalCount = resp.hits.total;
                var defaultArr = _.pluck(resp.hits.hits, '_source');
                req.meta.statusCode = 200;
                req.meta.message = "Success";
                req.meta.userMsg = "Success";
                return callBack(null, {meta:req.meta,expenses:defaultArr})
            }
            else {
                return callBack({code:"DEX002",msg:"NO DEFAULT EXPENSE FOUND"});
            }
        }else{
            return callBack(err)
        }
    })
}

externals.addDefaultExpense = (req,callBack) => {
    var payload = req.payload;
    payload.id = shortId.generate();
    payload.crDt = moment().format()
    expSrv.addDefaultExpense(payload,function (err,res) {
        if(err){
            return callBack(err)
        }else{
            req.meta.statusCode = 200;
            req.meta.message = "Success";
            req.meta.userMsg = "Success";
            return callBack(null, {meta: req.meta})
        }
    })
}

externals.delteDefaultExpense = (req,callBack) => {
    var params = req.params;
    var expenseId = params.id;
    let tasks = []
    tasks.push(function (callback) {
        expSrv.getDefaultExpenseById(expenseId,function (err,expense) {
            if(err){
                return callback(err)
            }else{
                return callback(null,expense)
            }
        })
    })
    tasks.push(function (expense,callback) {
        if(expense.isExist){
            expSrv.deleteDefaultExpenseById(expenseId,function (err,res) {
                if(err){
                    return callback(err)
                }else{
                    return callback(null,true)
                }
            })
        }else{
            return callback({code:"DEX001",msg:"NO EXPENSE FOUND"});
        }
    })
    async.waterfall(tasks,function (err,res) {
        if(err){
            return callBack(err)
        }else{
            req.meta.statusCode = 200;
            req.meta.message = "Success";
            req.meta.userMsg = "Success";
            return callBack(null, {meta: req.meta})
        }
    })
}

externals.delteExpense = (req,callBack) => {
    var params = req.params;
    var expenseId = params.id;

    let tasks = []
    tasks.push(function (callback) {
        expSrv.getExpenseById(expenseId,function (err,expense) {
            if(err){
                return callback(err)
            }else{
                return callback(null,expense)
            }
        })
    })
    tasks.push(function (expense,callback) {
        if(expense.isExist){
            expSrv.deleteExpenseById(expenseId,function (err,res) {
                if(err){
                    return callback(err)
                }else{
                    return callback(null,true)
                }
            })
        }else{
            return callback({code:"DEX001",msg:"NO EXPENSE FOUND"});
        }
    })
    async.waterfall(tasks,function (err,res) {
        if(err){
            return callBack(err)
        }else{
            req.meta.statusCode = 200;
            req.meta.message = "Success";
            req.meta.userMsg = "Success";
            return callBack(null, {meta: req.meta})
        }
    })
}

externals.addExpense = (req,callBack) => {
    var payload = req.payload;
    let tasks = [];
    payload.id = shortId.generate();
    payload.crDt = moment().format();
    let expAmt = payload.expenseAmt;
    let members = payload.members;
    let membersCount = members.length;
    let eachAmount = expAmt / membersCount;
    _.each(payload.members,function (member) {
        member.amount = eachAmount;
    })
    expSrv.addExpense(payload,function (err,res) {
        if(err){
            return callBack(err)
        }else{
            req.meta.statusCode = 200;
            req.meta.message = "Success";
            req.meta.userMsg = "Success";
            return callBack(null, {meta: req.meta})
        }
    })
}

module.exports = externals