var http = require('http');
var dbUtil = require('./src/db_utils')
var express = require("express")
var path = require("path")
var logger = require("morgan")
var bodyParser = require("body-parser")
var neo4j = require('neo4j-driver').v1;
var app = express();
var driver = neo4j.driver("bolt://192.168.0.50:7687");


app.set("views", path.join(__dirname, "/src/views"))
app.set("view engine", "ejs")
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, "public")))

app.get("/", function (req, res) {
    dbUtil.pingServer(req, res,driver)
})

app.get("/KeyWords", function (req, res) {
    dbUtil.KeyWordSearch(res, 1, "A", 25, driver)
})

app.get("/a", function (req, res) {

    dbUtil.MedDSInteraction(["ethanols","Retinoic Acids"], ["Met-Rx - Pure Protein Shake Vanilla Cream"], driver);
    dbUtil.MedDSInteraction(["ethanols"], ["Met-Rx - Pure Protein Shake Vanilla Cream"], driver);
    res.render("supVsmed")
})


app.listen(8080);
console.log("server started")
module.exports = app