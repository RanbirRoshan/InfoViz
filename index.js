var http = require('http');
var dbUtil = require('./src/db_utils')
var express = require("express")
var path = require("path")
var logger = require("morgan")
var bodyParser = require("body-parser")
var neo4j = require('neo4j-driver').v1;
var app = express();
var driver = neo4j.driver("bolt://127.0.0.1:7687");


app.set("views", path.join(__dirname, "/src/views"))
app.set("view engine", "ejs")
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, "public")))

app.get("/", function (req, res) {
    dbUtil.pingServer(req, res,driver)
})

app.get("/a", function (req, res) {
    res.render("supVsmed")
})

app.listen(8080);
console.log("server started")
module.exports = app