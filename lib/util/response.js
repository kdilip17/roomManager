/**
 * Created by dilip on 8/1/17.
 */
"use strict";


const joi = require('joi')
const _ = require('underscore')
const Boom = require('boom')
const Utilities = {}

Utilities.buildFilterQuery = function (payload, indexName, callback) {

    var filterPart = [], mustNotFilterPart = [];

    var filtersRequest = payload.filters;

    for (var index in filtersRequest) {
        if (filtersRequest[index].type == 'R') {
            if (filtersRequest[index] && filtersRequest[index].range && filtersRequest[index].range.start && filtersRequest[index].range.end) {
                var rangeData = {};
                rangeData[filtersRequest[index].key] = {
                    "gte": filtersRequest[index].range.start,
                    "lte": filtersRequest[index].range.end
                }

                var range = {"range": rangeData};
                if(filtersRequest[index].isMustNot){
                    mustNotFilterPart.push(range);
                }else {
                    filterPart.push(range);
                }
            }
            else if (filtersRequest[index] && filtersRequest[index].range && filtersRequest[index].range.start) {
                var rangeData = {};
                rangeData[filtersRequest[index].key] = {
                    "gte": filtersRequest[index].range.start
                };

                var range = {"range": rangeData};
                if(filtersRequest[index].isMustNot){
                    mustNotFilterPart.push(range);
                }else {
                    filterPart.push(range);
                }
            } else if (filtersRequest[index] && filtersRequest[index].range && filtersRequest[index].range.end) {
                var rangeData = {};
                rangeData[filtersRequest[index].key] = {
                    "lte": filtersRequest[index].range.end
                };
                var range = {"range": rangeData};
                if(filtersRequest[index].isMustNot){
                    mustNotFilterPart.push(range);
                }else {
                    filterPart.push(range);
                }
            }
        } else {
            var arrayValue = filtersRequest[index].value;
            var shouldFilters = [];
            if (!_.isEmpty(arrayValue)) {
                for (var valuedIndex in arrayValue) {
                    var matchData = {};
                    matchData[filtersRequest[index].key] = arrayValue[valuedIndex];
                    var match = {"match": matchData};
                    shouldFilters.push(match);
                }
            }
            var boolQuery = {
                "bool": {
                    "should": shouldFilters
                }
            };
            if(filtersRequest[index].isMustNot){
                mustNotFilterPart.push(boolQuery);
            }else {
                filterPart.push(boolQuery);
            }
        }
    }

    /*var sortQuery = {};
    sortQuery[payload.sortingKey] = {
        "order": payload.sortBy
    }*/
    if (filterPart && filterPart.length > 0 || mustNotFilterPart && mustNotFilterPart.length > 0) {
        var query = {
            "from": payload.index,
            "size": payload.limit,
            "query": {
                "bool": {
                    "must": filterPart,
                    "must_not":mustNotFilterPart
                }
            }
        }
    }
    else {
        var query = {
            "from": payload.index,
            "size": payload.limit,
            "query": {
                "match_all": {}
            }
        }
    }

    var params = {
        index: indexName,
        type: payload.orgId,
        body: query
    };

    return callback(null, params);
};


const dataMerger = (template, data) => {
    function getValueByNestedKey(key, obj) {
        const spl = key.split('.')
        let s = 0
        while (s != spl.length) {
            obj = obj[spl[s]]
            s++
        }
        if (obj)
            return obj;
        return ""
    }

    return template.replace(/{[^{}]+}/g, (key) => {
        return getValueByNestedKey(key.replace(/[{}]+/g, ""), data)
    });
}

/** Get Dynamic Success Changes **/
Utilities.getDynamicMsgSuccess = function (meta, resData) {
    let successCode = 200, mode = meta.mode
    let msg = null
    resData.meta = resData.meta ? resData.meta : meta;
    const code = resData.meta.code;
    if (_RES_MSG[code]) {
        successCode = _RES_MSG[code]['httpCode']
        if (_RES_MSG[code][mode]) {
            msg = _RES_MSG[code][mode]
        } else
            msg = _RES_MSG[code]['$']
        msg = dataMerger(msg, resData)
    } else
        msg = "Request Success"
    if (!successCode || successCode >= 400) {
        successCode = 200
    }
    resData.meta.code = resData.meta.code ? '' + resData.meta.code : '' + successCode
    resData.meta.message = resData.meta.msg ? resData.meta.msg : msg
    resData.meta.statusCode = successCode
    resData.meta.userMsg = msg
    return resData;
}


/** Get Dynamic Failed Changes **/
Utilities.getDynamicMsgFailed = function (meta, err) {
    let msg = null, errorCode = 400
    const mode = meta.mode;
    let code = err['code'], data = err['data']
    if (_RES_MSG[code]) {
        errorCode = _RES_MSG[code]['httpCode']
        if (_RES_MSG[code][mode]) {
            msg = _RES_MSG[code][mode]
        } else
            msg = _RES_MSG[code]['$']
        msg = dataMerger(msg, data)
    } else
        msg = "Request Failed"


    if (!errorCode || errorCode < 400) {
        errorCode = 400
    }
    let error = Boom.create(errorCode)
    error.reformat();
    error.output.payload = {
        id     : meta.id,
        code   : err.code,
        message: err.msg,
        statusCode: errorCode,
        userMsg: meta.userMsg ? meta.userMsg : msg
    };
    return error
}


module.exports = Utilities;