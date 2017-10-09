import debug = require('debug');
import express = require('express');
import { Request, Response, NextFunction } from 'express';
import path = require('path');
var multer = require('multer');

import routes from './routes/index';
import users from './routes/user';

var port = process.argv[2] || 3000,
    basedir = process.argv[3] || '';

import { hcc } from "./hcc";

var fileStorage = "c:/tmp";

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, fileStorage );
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

// app.use(express.static('sites')); // path.join(__dirname, 'sites')));
// app.use('/sites', express.static('sites'));

app.use('/sites', function (req, res) {
    hcc.sendFile(res, basedir + req.url, false);
});

app.get('/', function (req, res) {
    hcc.getSiteList(res, basedir);
});

app.get('/config', function (req:Request, res:Response) {
    hcc.getSite(res, basedir, req.query.site + "/.hccConfig.json");
});
app.get('/entry', function (req: Request, res: Response) {
    hcc.getEntry(res, basedir, req.query.site + "/" + req.query.url);
});

app.get('/testupload', function (req: Request, res: Response) {
    hcc.getEntry(res, __dirname, '/public/test.html');
});

app.get('/download', function (req: Request, res: Response) {
    hcc.getEntry(res, fileStorage + "/" , req.query.url);
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
    app.use((err: any, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


var server = app.listen(+port, "192.168.30.103", function () {
    debug('Express server listening on port ' + server.address().port + ' ' + server.address().address);
});
