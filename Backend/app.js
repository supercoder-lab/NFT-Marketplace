const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const assert = require("assert");
const {
    routes
} = require('./routes/routes');

const app = express();

///////////////////// SSL CODE ADDED
// var fs = require('fs');
// var http = require('http');
// var https = require('https');
// var privateKey = fs.readFileSync('ssl/privkey.pem', 'utf8');
// var certificate = fs.readFileSync('ssl/fullchain.pem', 'utf8');

// var credentials = {key: privateKey, cert: certificate};
 
// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

//////////////////////////////////////

 
// Load config
const stage = process.env.NODE_ENV || 'production';
const env = dotenv.config({
    path: `${stage}.env`
});
assert.equal(null, env.error);
app.set('env', stage);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

 
app.use(cors());

app.get("/", function (req, res) {
    res.send("node is running")
})

 app.use('/api/', routes)

if (module === require.main) {
   //var server = app.listen(process.env.PORT || 9000, function () {
   var server = app.listen(process.env.PORT || 8000, function () {
        var port = server.address().port;
        console.log("App listening on port %s", port);
    });
}

