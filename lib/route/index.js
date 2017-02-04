/**
 * Created by dilip on 8/1/17.
 */
"use strict";

const path = require('path');
const fs = require('fs');
const _ = require('underscore');

fs.readdirSync(__dirname).forEach((file) => {
    /* If its the current file ignore it */
    if (file === 'index.js') return;
    /* Prepare empty object to store module */
    let mod = {};
    /* Store module with its name (from filename) */
    mod[path.basename(file, '.js')] = require(path.join(__dirname, file));
    /* Extend module.exports (in this case - undescore.js, can be any other) */
    _.extend(module.exports, mod);
});
