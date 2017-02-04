/**
 * Created by dilip on 8/1/17.
 */
"use strict";

const accountModel = require('../model/account')


let account = {};

account.register = (req, reply) => {
    accountModel.register(req.pre.data, (err, result) => {
        if (err) {
            err.isError = true
            return reply(err)
        }
        else {
            result.isError = false
            result.meta.code = 'ACC200'
            return reply(result)
        }
    })
}

account.editUser = (req, reply) => {
    accountModel.editUser(req.pre.data, (err, result) => {
        if (err) {
            err.isError = true
            return reply(err)
        }
        else {
            result.isError = false
            result.meta.code = 'ACC200'
            return reply(result)
        }
    })
}


account.deleteUser = (req, reply) => {
    accountModel.deleteUser(req.pre.data, (err, result) => {
        if (err) {
            err.isError = true
            return reply(err)
        }
        else {
            result.isError = false
            result.meta.code = 'ACC200'
            return reply(result)
        }
    })
}

account.getUserById = (req, reply) => {
    accountModel.getUserById(req.pre.data, (err, result) => {
        if (err) {
            err.isError = true
            return reply(err)
        }
        else {
            result.isError = false
            result.meta.code = 'ACC200'
            return reply(result)
        }
    })
}

account.getUserList = (req, reply) => {
    accountModel.getUserList(req.pre.data, (err, result) => {
        if (err) {
            err.isError = true
            return reply(err)
        }
        else {
            result.isError = false
            result.meta.code = 'ACC200'
            return reply(result)
        }
    })
}


module.exports = account;