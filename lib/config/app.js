/**
 * Created by dilip on 8/1/17.
 */
"use strict";

var Confidence = require('confidence')
var store = new Confidence.Store()
var doc = {
    "$filter" : "env",
    "dev"     : {
        server        : {
            "host": "0.0.0.0",
            "port": 5000,
            routes: {
                cors    : true,
                validate: {options: {stripUnknown: true}},
                response: {
                    modify : true,
                    options: {
                        stripUnknown: true
                    }
                }
            }
        },
        swaggerOptions: {
            'name'           : 'Colleago',
            'title'          : 'Colleago API services',
            basePath         : "http://api.colleago.tk",
            apiVersion       : 'V1.0.0',
            logourl          : 'http://api.colleago.tk/static/image/colleago.png',
            documentationPath: "/",
            username         : "colleago",
            password         : "hm1234$"
        },
        services      : {
            onelogin    : {
                scope: 'V1_D_OL',
                hosts: ["api.colleago.tk:8000"]
            }
        },
        log           : {
            "name": "V1_D_EYE"
        }
    },
    "$default": {
        server        : {
            "host": "0.0.0.0",
            "port": 10000,
            routes: {
                cors    : true,
                validate: {options: {stripUnknown: true}},
                response: {
                    modify : true,
                    options: {
                        stripUnknown: true
                    }
                }
            }
        },
        swaggerOptions: {
            'name'           : 'Room Expenses',
            'title'          : 'RoomExpense API services',
            basePath         : "http://0.0.0.0:10000",
            apiVersion       : 'V1.0.0',
            logourl          : 'https://logo.clearbit.com/www.wisebanyan.com?size=128',
            documentationPath: "/",
            username         : "Mark5",
            password         : "1234"
        },
        database        : {
            es : {
                host: '127.0.0.1:9200'
            }
        },
        services      : {
            onelogin    : {
                scope: 'V1_D_OL',
                hosts: ["127.0.0.1:8000"]
            }
        },
        log           : {
            "name": "V1_D_EYE"
        }
    }
}

store.load(doc)

var loadDocument = null
var criteria = process.env.MODE

if (criteria == "production") {
    loadDocument = store.get('/', {"env": "production"})
} else if (criteria == "stage") {
    loadDocument = store.get('/', {"env": "stage"})
} else if (criteria == "dev") {
    loadDocument = store.get('/', {"env": "dev"})
} else {
    loadDocument = store.get('/')
}

module.exports = loadDocument