"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var HttpStatus_js_1 = require("./constants/HttpStatus.js");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3000;
app.get('/health', function (req, res) {
    res.status(HttpStatus_js_1.HttpStatus.OK).json({
        success: true,
        message: 'Health Checked',
    });
});
app.listen(PORT, function () { return console.log("Server running on PORT ".concat(PORT)); });
