/**
 * Created by dilip on 8/1/17.
 */
"use strict";


const joi = require('joi')
const middlewareCtrl = require('../handler/middleware')
var accCtrl = require('../handler/account')
var expCtrl = require('../handler/expense')
var schema = require('../schema/account')


module.exports = function () {
    return [
        {
            method: 'POST',
            path  : '/account/register',
            config: {
                app        : {
                    methodId: "ACC_REGISTER"
                },
                handler    : accCtrl.register,
                description: 'Register',
                tags       : ['api'],
                pre        : [
                    {method: middlewareCtrl.prepareReq, assign: "data"}
                ],
                notes      : [
                    'Register'
                ],
                validate   : {
                    query  : {
                        role: joi.string().allow("ADMIN", "USER").default("ADMIN").required()
                    },
                    payload: schema.registerReq
                },
                response   : {
                    schema: schema.registerRes
                }


            }
        },
        {
            method: 'POST',
            path  : '/user/add',
            config: {
                app        : {
                    methodId: "ADD_USER"
                },
                handler    : accCtrl.register,
                description: 'Add User',
                tags       : ['api'],
                pre        : [
                    {method: middlewareCtrl.prepareReq, assign: "data"}
                ],
                notes      : [
                    'Register'
                ],
                validate   : {
                    query  : {
                        role: joi.string().allow("ADMIN", "USER").default("USER").required()
                    },
                    payload: schema.registerReq
                },
                response   : {
                    schema: schema.registerRes
                }


            }
        },
        {
            method: 'PUT',
            path  : '/user/edit',
            config: {
                app        : {
                    methodId: "EDIT_USER"
                },
                handler    : accCtrl.editUser,
                description: 'Edit User',
                tags       : ['api'],
                pre        : [
                    {method: middlewareCtrl.prepareReq, assign: "data"}
                ],
                notes      : [
                    'Register'
                ],
                validate   : {
                    query  : {
                        role: joi.string().allow("ADMIN", "USER").default("USER").required()
                    },
                    payload: schema.editUser
                },
                response   : {
                    schema: schema.registerRes
                }


            }
        },
        {
            method: 'GET',
            path  : '/user/{email}',
            config: {
                app        : {
                    methodId: "GET_USER"
                },
                handler    : accCtrl.getUserById,
                description: 'Get User',
                tags       : ['api'],
                pre        : [
                    {method: middlewareCtrl.prepareReq, assign: "data"}
                ],
                notes      : [
                    'Register'
                ],
                validate   : {
                    params  : {
                        email:joi.string().required()
                    }
                },
                response   : {
                    schema: schema.getUserRes
                }


            }
        },
        {
            method: 'GET',
            path  : '/user/list',
            config: {
                app        : {
                    methodId: "GET_USER"
                },
                handler    : accCtrl.getUserList,
                description: 'Get User List',
                tags       : ['api'],
                pre        : [
                    {method: middlewareCtrl.prepareReq, assign: "data"}
                ],
                notes      : [
                    'Register'
                ],
                response   : {
                    schema: schema.getUserList
                }


            }
        },
        {
            method: 'DELETE',
            path  : '/user/delete',
            config: {
                app        : {
                    methodId: "DELETE_USER"
                },
                handler    : accCtrl.deleteUser,
                description: 'Delete User',
                tags       : ['api'],
                pre        : [
                    {method: middlewareCtrl.prepareReq, assign: "data"}
                ],
                notes      : [
                    'Register'
                ],
                validate   : {
                    query  : {
                        email:joi.string().required()
                    }
                },
                response   : {
                    schema: schema.registerRes
                }


            }
        },
        {
            method: 'POST',
            path  : '/defaultExpense/add',
            config: {
                app        : {
                    methodId: "ADD_DEFAULT_EXPENSE"
                },
                handler    : expCtrl.addDefaultExpense,
                description: 'Add Expense',
                tags       : ['api'],
                pre        : [
                    {method: middlewareCtrl.prepareReq, assign: "data"}
                ],
                notes      : [
                    'Add Expense'
                ],
                validate   : {
                    payload : schema.addDefaultExpense
                },
                response   : {
                    schema: schema.registerRes
                }


            }
        },
        {
            method: 'POST',
            path  : '/defaultExpense/list',
            config: {
                app        : {
                    methodId: "DEFAULT_EXPENSE"
                },
                handler    : expCtrl.defaultExpenseList,
                description: 'Expense',
                tags       : ['api'],
                pre        : [
                    {method: middlewareCtrl.prepareReq, assign: "data"}
                ],
                notes      : [
                    'Expense'
                ],
                response   : {
                    schema: schema.defExpList
                }
            }
        },
        {
            method: 'DELETE',
            path  : '/defaultExpense/delete/{id}',
            config: {
                app        : {
                    methodId: "ADD_DEFAULT_EXPENSE"
                },
                handler    : expCtrl.delteDefaultExpense,
                description: 'Add Expense',
                tags       : ['api'],
                pre        : [
                    {method: middlewareCtrl.prepareReq, assign: "data"}
                ],
                notes      : [
                    'Add Expense'
                ],
                validate   : {
                    params : {
                        id : joi.string().required()
                    }
                },
                response   : {
                    schema: schema.registerRes
                }


            }
        },
        {
            method: 'POST',
            path  : '/expense/add',
            config: {
                app        : {
                    methodId: "ADD_EXPENSE"
                },
                handler    : expCtrl.addExpense,
                description: 'Add Expense',
                tags       : ['api'],
                pre        : [
                    {method: middlewareCtrl.prepareReq, assign: "data"}
                ],
                notes      : [
                    'Add Expense'
                ],
                validate   : {
                    payload : schema.addExpense
                },
                response   : {
                    schema: schema.registerRes
                }


            }
        },
        {
            method: 'POST',
            path  : '/expense/list',
            config: {
                app        : {
                    methodId: "EXPENSE_LIST"
                },
                handler    : expCtrl.expenseList,
                description: 'Monthly Expense List',
                tags       : ['api'],
                pre        : [
                    {method: middlewareCtrl.prepareReq, assign: "data"}
                ],
                notes      : [
                    'Add Expense'
                ],
                response   : {
                    schema: schema.expensesRes
                }


            }
        },
        {
            method: 'DELETE',
            path  : '/expense/delete/{id}',
            config: {
                app        : {
                    methodId: "DELETE_EXPENSE"
                },
                handler    : expCtrl.delteExpense,
                description: 'Delete Expense',
                tags       : ['api'],
                pre        : [
                    {method: middlewareCtrl.prepareReq, assign: "data"}
                ],
                notes      : [
                    'Delete Expense'
                ],
                validate   : {
                    params : {
                        id : joi.string().required()
                    }
                },
                response   : {
                    schema: schema.registerRes
                }


            }
        },
        {
            method: 'POST',
            path  : '/generate/report',
            config: {
                app        : {
                    methodId: "EXPENSE_REPORT"
                },
                handler    : expCtrl.getExpenseReport,
                description: 'Expense Report',
                tags       : ['api'],
                pre        : [
                    {method: middlewareCtrl.prepareReq, assign: "data"}
                ],
                notes      : [
                    'Expense Report'
                ],
                validate   : {
                    payload : schema.expReportReq
                },
                response   : {
                    schema: schema.expReportRes
                }
            }
        }
    ]
}();
