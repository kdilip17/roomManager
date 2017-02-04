/**
 * Created by dilip on 8/1/17.
 */


"use strict";

const joi = require('joi');


let external = {};

external.defaultExpense = joi.object({
    id : joi.string().required(),
    name: joi.string().required(),
    crDt: joi.date()
})

external.expense = joi.object({
    id : joi.string().required(),
    expense:joi.object({
        id : joi.string(),
        name : joi.string()
    }),
    crDt: joi.date(),
    expenseAmt  : joi.number(),
    month       : joi.number(),
    year        : joi.number(),
    members     : joi.array().items(joi.object({
        id      : joi.string(),
        displayName : joi.string(),
        amount  : joi.number()
    }))
})

external.register = joi.object({
    id: joi.string().required(),
    emailId: joi.string().email().required(),
    password: joi.string().required(),
    mobileNo: joi.string().required(),
    displayName: joi.string().required(),
    orgId: joi.string().required(),
    crDt: joi.date(),
    role : joi.string().required(),
    isActive: joi.boolean().required()
})

module.exports = external