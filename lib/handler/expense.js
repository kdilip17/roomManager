/**
 * Created by dilip on 4/2/17.
 */
"use strict";

const expenseMdl = require("../model/expense")

var expense = {}

expense.getExpenseReport = (req, reply) => {
    expenseMdl.getExpenseReport(req.pre.data, (err, result) => {
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

expense.addExpense = (req, reply) => {
    expenseMdl.addExpense(req.pre.data, (err, result) => {
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

expense.expenseList = (req, reply) => {
    expenseMdl.expenseList(req.pre.data, (err, result) => {
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

expense.delteExpense = (req, reply) => {
    expenseMdl.delteExpense(req.pre.data, (err, result) => {
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

expense.addDefaultExpense = (req, reply) => {
    expenseMdl.addDefaultExpense(req.pre.data, (err, result) => {
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

expense.defaultExpenseList = (req, reply) => {
    expenseMdl.defaultExpenseList(req.pre.data, (err, result) => {
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

expense.delteDefaultExpense = (req, reply) => {
    expenseMdl.delteDefaultExpense(req.pre.data, (err, result) => {
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

module.exports = expense