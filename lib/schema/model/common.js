/**
 * Created by dilip on 8/1/17.
 */
"use strict";

const joi = require('joi');
let common = {};
common.meta = joi.object({
    id        : joi.string().required(),
    apiVer    : joi.string(),
    code      : joi.string(),
    message   : joi.string().required(),
    statusCode: joi.number().required(),
    userMsg   : joi.string().required()
}).meta({
    className: 'Meta'
});

common.name = joi.object({
    first  : joi.string().required(),
    last   : joi.string(),
    display: joi.string().allow(null).optional()
}).required().meta({
    className: 'Name'
})
common.mobileNo = joi.object({
    cc: joi.string().allow(null),
    no: joi.string().required(),
}).required().meta({
    className: 'MobileNo'
})
common.email = joi.object({
    type : joi.string().valid(['PRI', 'SEC', 'OTH']).required(),
    value: joi.string().required()
}).meta({
    className: 'Email'
})

common.range = joi.object({
    "start": joi.string(),
    "end"  : joi.string()
}).meta({
    className: "Range"
})

common.filter = joi.object({
    type  : joi.string().valid(['R', 'F']).required().description('R - Range , F = Fixed '),
    key   : joi.string().required(),
    range : common.range,
    value: joi.array()
}).meta({
    className: 'Filter'
})

common.gender = joi.string().valid(['F', 'M', 'O','f','m','o']).allow(null,"")

common.successRes = joi.object({
    meta: common.meta.required()
}).meta({
    className: 'SuccessRes'
});
common.orgName = joi.object({
    busName: joi.string().required(),
    trdName: joi.string().required(),
    disName: joi.string().optional().allow(null,""),
}).meta({
    className: 'OrgName'
});
common.country = joi.object({
    id  : joi.string().optional(),
    name: joi.string().optional()
}).meta({
    className: 'Country'
})
common.addrese = joi.object({
    address1: joi.string().allow('',null)
}).meta({
    className: 'Addrese'
})
common.items = joi.object({
    name: joi.string().optional(),
    des : joi.string().optional(),
    amt : joi.number().integer().required().optional(),
    qty : joi.number().integer().required().optional()
}).meta({
    className: 'Items'
})
module.exports = common;