var http = require('http');
var dbUtil = require('./src/db_utils')
var express = require("express")
var path = require("path")
var logger = require("morgan")
var bodyParser = require("body-parser")
var neo4j = require('neo4j-driver').v1;
var app = express();
var cors = require('cors');
var driver = neo4j.driver("bolt://10.136.40.127:7687");


app.set("views", path.join(__dirname, "/src/views"))
app.set("view engine", "ejs")
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.get("/", function (req, res) {
    dbUtil.pingServer(req, res, driver)
})

app.get("/KeyWords", function (req, res) {
    console.log(req.body.type);
    dbUtil.KeyWordSearch(res, req.query.type, req.query.name, 25, driver)
})

app.get("/a", function (req, res) {

    dbUtil.MedDSInteraction(["ethanols", "Retinoic Acids"], ["Met-Rx - Pure Protein Shake Vanilla Cream"], driver);
    dbUtil.MedDSInteraction(["ethanols"], ["Met-Rx - Pure Protein Shake Vanilla Cream"], driver);
    res.render("supVsmed")
})

var supp = [];
var drug = [];
app.get("/app", function (req, res) {

    res.render("supplements", { supp: supp, drug: drug });

})

app.post("/app", function (req, res) {
    // res.render("/a", { type: req.body.type, name: req.body.name });
    // console.log(req.body.name);
    if (req.body.type == "Supplement") {
        supp.push({ type: req.body.type, name: req.body.name });
    } else {
        drug.push({ type: req.body.type, name: req.body.name });
    }
    // console.log(names);
    res.render("supplements", { supp: supp, drug: drug });
})

app.get("/SupVsMed", function (req, res) {
    console.log("abcd")
    dbUtil.MedDSInteraction(req.query.drug, req.query.supp, res, driver);
})


app.listen(8080);
console.log("server started")
module.exports = app