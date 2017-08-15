"use strict";
var debug = require('debug');
var express = require('express');
var path = require('path');
var multer = require('multer');
var port = process.argv[2] || 3000, basedir = process.argv[3] || '';
var hcc_1 = require("./hcc");
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'c:/tmp');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({ storage: storage }).single('file');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'sites')));
app.get('/', function (req, res) {
    hcc_1.hcc.getSiteList(res, basedir);
});
app.get('/config', function (req, res) {
    hcc_1.hcc.getSite(res, basedir, req.query.site + "/.hccConfig.json");
});
app.get('/entry', function (req, res) {
    hcc_1.hcc.getEntry(res, basedir, req.query.site + "/" + req.query.url);
});
app.get('/testupload', function (req, res) {
    hcc_1.hcc.getEntry(res, __dirname, '/public/test.html');
});
app.post('/upload', function (req, res) {
    console.log("post");
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
var server = app.listen(port, function () {
    debug('Express server listening on port ' + server.address().port);
});
//# sourceMappingURL=app.js.map