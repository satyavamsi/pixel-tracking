const express = require("express");
const favicon = require('express-favicon');
const path = require('path');
const app = express(); // create express app


var imgdata = [
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
    0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x04, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b
]
var imgbuf = new Buffer(imgdata);

app.use(favicon(__dirname + '/build/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/', express.static(`${__dirname}/build`));

app.get('/sample.gif', function (req, res, next) {
    console.log(req.query);
    res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': imgdata.length,
    })
    res.end(imgbuf)
})



// start express server on port 5000
app.listen(3002, () => {
    console.log("server started on port 3002");
});