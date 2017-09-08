/**
 * Created by dilip on 8/1/17.
 */
"use strict";
var async = require("async")
var moment = require("moment")
var accServ = require("../service/account")
var shortId = require("shortid")
var crypto = require("./crypto")
var _ = require("underscore")

var externals = {}

externals.getUserList = (req,callBack) => {
    var payload = {}
    accServ.getUserList(payload,function (err,resp) {
        if(!err){
            if (resp && resp.hits && resp.hits.hits) {
                var totalCount = resp.hits.total;
                var defaultArr = _.pluck(resp.hits.hits, '_source');
                req.meta.statusCode = 200;
                req.meta.message = "Success";
                req.meta.userMsg = "Success";
                return callBack(null, {meta:req.meta,users:defaultArr})
            }
            else {
                return callBack({code:"DEX002",msg:"NO DEFAULT EXPENSE FOUND"});
            }
        }else{
            return callBack(err)
        }
    })
}

externals.getUserById = (req,callBack) => {
    var params = req.params;
    var emailId = params.email;
    var tasks = []
    accServ.getUserByEmail(emailId,function (err,res) {
        if(err){
            return callBack(err)
        }else{
            if(res.isExist) {
                req.meta.statusCode = 200;
                req.meta.message = "Success";
                req.meta.userMsg = "Success";
                return callBack(null, {meta:req.meta,user:res.data._source})
            }else{
                return callBack({code:"USR001",msg:"USER NOT EXIST"})
            }
        }
    })
}

externals.deleteUser = (req,callBack) => {
    var query = req.query;
    var emailId = query.email;
    var tasks = []
    tasks.push(function (callback) {
        accServ.getUserByEmail(emailId,function (err,res) {
            if(err){
                return callback(err)
            }else{
                return callback(null,res)
            }
        })
    })
    tasks.push(function (res,callback) {
        if(res.isExist){
            let userData = res.data._source;
            if(userData.role == "ADMIN"){
                return callback({code:"USR001",msg:"ADMIN CANNOT BE DELETED"})
            }
            accServ.deleteUserSrv(emailId,function (err,res) {
                if(err){
                    return callback(err)
                }else{
                    return callback(null,true)
                }
            })
        }else{
            return callback({code:"USR001",msg:"USER NOT EXIST"})
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

externals.editUser = (req,callBack) => {
    var payload = req.payload;
    var meta = req.meta;
    var tasks = []
    tasks.push(function (callback) {
        let emailId = payload.emailId;
        accServ.getUserByEmail(emailId,function (err,res) {
            if(err){
                return callback(err)
            }else{
                return callback(null,res)
            }
        })
    })
    tasks.push(function (res,callback) {
        if(res.isExist){
            let userData = res.data._source;
            userData.displayName = payload.displayName;
            userData.mobileNo = payload.mobileNo;
            accServ.editUser(userData,function (err,res) {
                if(err){
                    return callback(err)
                }else{
                    return callback(null,true)
                }
            })
        }else{
            return callback({code:"USR001",msg:"USER NOT EXIST"})
        }
    })
    async.waterfall(tasks,function (err,res) {
        if(err){
            return callBack(err)
        }else{
            meta.statusCode = 200;
            meta.message = "Success";
            meta.userMsg = "Success";
            return callBack(null, {meta: meta})
        }
    })
}

externals.login = (req,callBack) => {
    var payload = req.payload;
    var query = req.query;
    var meta = req.meta;
    var resObj;
    var tasks = []
    tasks.push(function (callback) {
        let emailId = payload.emailId;
        accServ.getUserByEmail(emailId,function (err,res) {
            if(err){
                return callback(err)
            }else{
                resObj = res.data;
                return callback(null,res.isExist)
            }
        })
    })
    tasks.push(function (prevRes,callback) {
        if(prevRes){
            let role = query.role;
            let password = payload.password;
            let encPwd = crypto.encrypt(password)
            let usData = resObj._source
            if(encPwd == usData.password && usData.role==role && usData.isActive){
                return callback(null,true)
            }else if(encPwd != usData.password){
                return callback({code:"USR011",msg:"INVALID PASSWORD"})
            }else if(role!="ADMIN"){
                return callback({code:"USR012",msg:"LOGIN ALLOWED FOR ADMIN ONLY"})
            }else if(!usData.isActive){
                return callback({code:"USR013",msg:"INACTIVE USER"})
            }
        }else{
            return callback({code:"USR014",msg:"USER NOT EXIST"})
        }
    })
    async.waterfall(tasks,function (err,res) {
        if(err){
            return callBack(err)
        }else{
            meta.statusCode = 200;
            meta.message = "Success";
            meta.userMsg = "Success";
            return callBack(null, {meta: meta})
        }
    })
}

externals.register = (req,callBack) => {
    var payload = req.payload;
    var meta = req.meta;
    var tasks = []
    tasks.push(function (callback) {
        let emailId = payload.emailId;
        accServ.getUserByEmail(emailId,function (err,res) {
            if(err){
                return callback(err)
            }else{
                return callback(null,res.isExist)
            }
        })
    })
    tasks.push(function (prevRes,callback) {
        if(prevRes){
            return callback({code:"USR001",msg:"USER ALREADY EXIST"})
        }else{
            payload.id = shortId.generate()
            payload.crDt = moment().format()
            payload.orgId = "MARK5"
            payload.isActive = true;
            payload.role = req.query.role;
            payload.password = crypto.encrypt(payload.password)
            accServ.register(payload,function (err,res) {
                if(err){
                    return callback(err)
                }else{
                    return callback(null,true)
                }
            })
        }
    })
    async.waterfall(tasks,function (err,res) {
        if(err){
            return callBack(err)
        }else{
            meta.statusCode = 200;
            meta.message = "Success";
            meta.userMsg = "Success";
            return callBack(null, {meta: meta})
        }
    })
}

module.exports = externals