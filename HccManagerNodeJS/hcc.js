"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var glob = require("glob");
var path = require("path");
var hcc;
(function (hcc) {
    // Colors for CLI output
    var WHT = '\x1B[39m';
    var RED = '\x1B[91m';
    var GRN = '\x1B[32m';
    function getList(response, basedir, url) {
        var read = function (dir) {
            return fs.readdirSync(dir)
                .reduce(function (files, file) {
                return fs.statSync(path.join(dir, file)).isDirectory() ?
                    files.concat(read(path.join(dir, file))) :
                    files.concat(path.join(dir, file));
            }, []);
        };
        glob(basedir + "**/*.*", function (er, files) {
            // files is an array of filenames.
            // If the `nonull` option is set, and nothing
            // was found, then files is ["**/*.js"]
            // er is an error object or null.
            var list = [];
            files.forEach(function (value) {
                var fn = value.substr(basedir.length);
                var e = new entry();
                e.fname = fn;
                e.url = url + '/' + fn;
                list.push(e);
            });
            response.end(JSON.stringify(list));
            // response.end("get list for " + url + " in " + basedir);
        });
    }
    hcc.getList = getList;
    function getEntry(response, basedir, url) {
        // response.end("get entry for " + url);
        sendFile(response, basedir + url, false);
    }
    hcc.getEntry = getEntry;
    function sendFile(response, filename, fileNotFound) {
        // Setting up MIME-Type (YOU MAY NEED TO ADD MORE HERE) <--------
        var contentTypesByExtension = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'text/json',
            '.svg': 'image/svg+xml'
        };
        var fileNotFound = false;
        // Assuming the file exists, read it
        fs.readFile(filename, 'binary', function (err, file) {
            // Output a green line to console explaining the file that will be loaded in the browser
            console.log(GRN + 'FILE: ' + WHT + filename);
            // If there was an error trying to read the file
            if (err) {
                // Put the error in the browser
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.write(err + '\n');
                response.end();
                return;
            }
            if (fileNotFound) {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.write('Not found ' + filename + '\n');
                response.end();
                return;
            }
            // Otherwise, declar a headers object and a var for the MIME-Type
            var headers = {};
            var contentType = contentTypesByExtension[path.extname(filename)];
            // If the requested file has a matching MIME-Type
            if (contentType) {
                // Set it in the headers
                headers['Content-Type'] = contentType;
            }
            // Output the read file to the browser for it to load
            response.writeHead(200, headers);
            response.write(file, 'binary');
            response.end();
        });
    }
    hcc.sendFile = sendFile;
    function getSiteList(response, basedir) {
        var dirs = [];
        fs.readdir(basedir, function (err, files) {
            files.forEach(function (file) {
                if (file.indexOf('.') < 0) {
                    dirs.push(file);
                }
            });
            response.end(JSON.stringify(dirs));
        });
    }
    hcc.getSiteList = getSiteList;
    function getSite(response, basedir, url) {
        // Setting up MIME-Type (YOU MAY NEED TO ADD MORE HERE) <--------
        var contentTypesByExtension = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'text/json',
            '.svg': 'image/svg+xml'
        };
        var filename = basedir + url;
        var requestedFilename = basedir + url;
        if (url.indexOf(".") < 0) {
            filename = basedir;
        }
        var fileNotFound = false;
        // Check if the requested file exists
        fs.exists(filename, function (exists) {
            // If it doesn't
            if (!exists) {
                // Output a red error pointing to failed request
                console.log(RED + 'FAIL: ' + filename);
                // Redirect the browser to the 404 page
                filename = path.join(basedir, '404.html');
                fileNotFound = true;
                // If the requested URL is a folder, like http://localhost:8000/catpics
            }
            else if (fs.statSync(filename).isDirectory()) {
                // Output a green line to the console explaining what folder was requested
                console.log(GRN + 'FLDR: ' + WHT + filename);
                // redirect the user to the index.html in the requested folder
                filename = basedir + 'index.html';
            }
            // Assuming the file exists, read it
            fs.readFile(filename, 'binary', function (err, file) {
                // Output a green line to console explaining the file that will be loaded in the browser
                console.log(GRN + 'FILE: ' + WHT + filename);
                // If there was an error trying to read the file
                if (err) {
                    // Put the error in the browser
                    response.writeHead(500, { 'Content-Type': 'text/plain' });
                    response.write(err + '\n');
                    response.end();
                    return;
                }
                if (fileNotFound === true) {
                    response.writeHead(404, { 'Content-Type': 'text/plain' });
                    response.write('Not found ' + requestedFilename + '\n');
                    response.end();
                    return;
                }
                // Otherwise, declar a headers object and a var for the MIME-Type
                var headers = {};
                var contentType = contentTypesByExtension[path.extname(filename)];
                // If the requested file has a matching MIME-Type
                if (contentType) {
                    // Set it in the headers
                    headers['Content-Type'] = contentType;
                }
                // Output the read file to the browser for it to load
                response.writeHead(200, headers);
                response.write(file, 'binary');
                response.end();
            });
        });
    }
    hcc.getSite = getSite;
    function getExternal(response) {
        var sList = "abc";
        var zStart = 13;
        var zCnt = 3;
        var xStart = 4281;
        var xCnt = 4;
        var yStart = 2705;
        var yCnt = 4;
        // 13/51.9639/8.2343
        // https://b.tile.openstreetmap.org/13/4282/2706.png
        var urlPattern = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        var list = [];
        for (var z = zStart; z < zStart + zCnt; z++) {
            for (var y = yStart; y < yStart + yCnt; y++) {
                for (var x = xStart; x < xStart + xCnt; x++) {
                    var url = urlPattern.replace("{s}", sList[0])
                        .replace("{z}", z.toString())
                        .replace("{y}", y.toString())
                        .replace("{x}", x.toString());
                    console.log("get: " + url);
                    var e = new entry();
                    e.url = url;
                    e.needReplace = false;
                    e.canBeZipped = false;
                    list.push(e);
                    for (var i = 1; i < sList.length; i++) {
                        var aliasUrl = urlPattern.replace("{s}", sList[i])
                            .replace("{z}", z.toString())
                            .replace("{y}", y.toString())
                            .replace("{x}", x.toString());
                        console.log("alias: " + url + " -> " + aliasUrl);
                        var e = new entry();
                        e.url = url;
                        e.aliasUrl = aliasUrl;
                        e.needReplace = false;
                        e.canBeZipped = false;
                        list.push(e);
                    }
                }
            }
            yStart *= 2;
            xStart *= 2;
            yCnt *= 2;
            xCnt *= 2;
        }
        response.end(JSON.stringify(list));
    }
    hcc.getExternal = getExternal;
    var entry = (function () {
        function entry() {
            this.canBeZipped = true;
            this.needReplace = true;
        }
        return entry;
    }());
})(hcc = exports.hcc || (exports.hcc = {}));
//# sourceMappingURL=hcc.js.map