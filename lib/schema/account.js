/**
 * Created by dilip on 8/1/17.
 */
"use strict";

const joi = require('joi');
const comSchema = require('./model/common');

let account = {};

/**  LOGIN **/
// Login Request/
account.loginReq = joi.object({
    emailId : joi.string().required().description("This is Unique Email or Mobile number with country code for Ex: 919843076661 like that"),
    password: joi.string().required(),
    role        : joi.string().valid(['ADMIN','USER']).required()
}).meta({
    className: 'LoginReq'
});

// Login Response **/
account.loginRes = joi.object({
    meta        : comSchema.meta.required(),
    authToken   : joi.string().required(),
    user        : joi.any().required(),
    organization: joi.any(),
    employees   : joi.array().items(joi.any()),
    force       : joi.object({
        payment: joi.boolean(),
        setup  : joi.boolean(),
        payId  : joi.string().allow('').optional(),
        planId : joi.string()
    })
}).meta({
    className: 'LoginRes'
});

account.editUser = joi.object({
    emailId : joi.string().email().required(),
    mobileNo: joi.string().required(),
    displayName:joi.string().required()
}).meta({
    className: 'RegisterReq'
});

account.expReportReq = joi.object({
    month       : joi.number().required(),
    year        : joi.number().required(),
    memberId    : joi.string().required()
})

account.addExpense = joi.object({
    month       : joi.number(),
    year        : joi.number(),
    expense     : joi.object({
        id      : joi.string(),
        name    : joi.string()
    }),
    expenseAmt  : joi.number(),
    members     : joi.array().items(joi.object({
        displayName : joi.string(),
        id          : joi.string()
    }))
})

account.registerReq = joi.object({
    emailId : joi.string().email().required(),
    password: joi.string().required(),
    mobileNo: joi.string().required(),
    displayName:joi.string().required()
}).meta({
    className: 'RegisterReq'
});

account.addDefaultExpense = joi.object({
    name : joi.string().required()
})

account.registerRes = joi.object({
    meta: comSchema.meta.required(),
}).meta({
    className: 'RegisterRes'
});

account.expenseList = joi.object({
    meta: comSchema.meta.required(),
    expenses : joi.array().items(joi.object({

    }))
}).meta({
    className: 'RegisterRes'
});

account.defExpList = joi.object({
    meta: comSchema.meta.required(),
    defExps : joi.array().items(joi.object({
        id  : joi.string(),
        name: joi.string()
    }))
}).meta({
    className: 'defExpList'
});

account.expReportRes = joi.object({
    meta: comSchema.meta.required(),
    expense : {
        memberId : joi.string().required(),
        totalExpense : joi.number(),
        expenses : joi.array().items(joi.object({
            id      : joi.string(),
            name    : joi.string(),
            amount  : joi.number()
        }))
    }
}).meta({
    className: 'expReportRes'
});

account.expensesRes = joi.object({
    meta: comSchema.meta.required(),
    expenses : joi.array().items(joi.object({
        id      : joi.string(),
        month   : joi.number(),
        year    : joi.number(),
        expense : joi.object({
            id      : joi.string(),
            name    : joi.string(),
        }),
        expenseAmt : joi.number(),
        members   : joi.array().items(joi.object({
            id          : joi.string(),
            displayName : joi.string(),
            amount      : joi.number()
        }))
    }))
}).meta({
    className: 'expReportRes'
});

account.getUserRes = joi.object({
    meta: comSchema.meta.required(),
    user : {
        emailId     : joi.string().required(),
        mobileNo    : joi.string().required(),
        displayName : joi.string().required(),
        id          : joi.string().required(),
        role        : joi.string().required()
    }
}).meta({
    className: 'getUserRes'
});

account.getUserList = joi.object({
    meta: comSchema.meta.required(),
    users : joi.array().items(joi.object({
        emailId     : joi.string().required(),
        mobileNo    : joi.string().required(),
        displayName : joi.string().required(),
        id          : joi.string().required(),
        role        : joi.string().required()
    }))
}).meta({
    className: 'getUserList'
});


account.setupReq = joi.object({

    orgLogo  : joi.string(),
    noOfEmp  : joi.number().integer(),
    regNo    : joi.string(),
    industry : joi.object({
        id  : joi.string().required(),
        name: joi.string()
    }).required(),
    countryId: joi.string(),
    mobileNo : comSchema.mobileNo,
    orgName  : comSchema.orgName,
    priAdmin : joi.object({
        name    : comSchema.name.required(),
        emails  : joi.array().items(comSchema.email),
        mobileNo: comSchema.mobileNo,
    }),
    emails   : joi.array().items(comSchema.email),
    addreses : joi.array().items(comSchema.addrese).required(),
    plan     : joi.object({
        id  : joi.string().required(),
        name: joi.string()
    }).required(),

}).meta({
    className: 'SetupReq'
});
account.setupRes = joi.object({
    meta: comSchema.meta.required(),

    user        : joi.any(),
    organization: joi.any(),
    employees   : joi.array().items(joi.any()),
    force       : joi.object({
        payment : joi.boolean(),
        setup   : joi.boolean(),
        payId   : joi.string().allow('').optional(),
        password: joi.boolean(),
        planId  : joi.string()
    }),
    authToken   : joi.string(),
}).meta({
    className: 'setupRes'
});

account.oneTimeRes = joi.object({
    meta        : comSchema.meta.required(),
    force       : joi.object({
        payment : joi.boolean(),
        setup   : joi.boolean(),
        payId   : joi.string().allow('').optional(),
        password: joi.boolean()
    }),
    user        : joi.object(),
    organization: joi.object(),
    authToken   : joi.string()
}).meta({
    className: 'oneTimeRes'
});
account.successRes = comSchema.successRes

module.exports = account