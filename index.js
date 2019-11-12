var http = require('http');
var dbUtil = require('./src/db_utils')
var express = require("express")
var path = require("path")
var logger = require("morgan")
var bodyParser = require("body-parser")
var neo4j = require('neo4j-driver').v1;
var app = express();
var cors = require('cors');
var expressLayouts = require('express-ejs-layouts');

var driver = neo4j.driver("bolt://192.168.0.50:7687");
app.use(expressLayouts);
app.set("views", path.join(__dirname, "/src/views"))
app.set("view engine", "ejs")
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.get("/", function (req, res) {
    dbUtil.pingServer(req, res, driver)
    // res.render('details');
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
    dbUtil.MedDSInteraction(req.query.drug, req.query.supp, res, driver);
})


app.get("/IngredientEffectiveFor", function (req, res) {
    console.log("IngredientEffectiveFor api called")
    dbUtil.GetIngredientEffectiveFor(res, req.query.name, driver)
})

app.get("/IngredientInteractsWithDrug", function (req, res) { //Tested with localhost:8080/IngredientInteractsWithDrug?name=Garlic parameter
    console.log("IngredientInteractsWithDrug API called")
    dbUtil.GetIngredientInteractsWithDrug(res, req.query.name, driver)
})


app.get("/IngredientComponentOf", function (req, res) {
    console.log("IngredientComponentof api called")
    dbUtil.GetIngredientComponentOf(res, req.query.name, driver)
})

app.get("/detail", function (req, res) {
    console.log("Detail api called")
    dbUtil.GetItemDetails(res, req.query.type, req.query.name, driver)
})
app.get('/dsp', function (req, res) {
    res.render('dsp-ingredients');
})


app.get('/details', function (req, res) {
    res.render('details');
})

app.get("/DrugInteractWithIngredient", function (req, res) {
    console.log("DrugInteractWithIngredient api called")
    dbUtil.DrugInteractWithIngredient(res, req.query.name, driver)
})


app.get("/DrugInteractWithSuppliment", function (req, res) {
    console.log("DrugInteractWithSuppliment api called")
    dbUtil.DrugInteractWithSuppliment(res, req.query.name, driver)
})

app.get('/drugs', function (req, res) {
    res.render('drugs');
})

app.get("/DSPInteractWithDrug", function (req, res) {
    console.log("DSPInteractWithDrug api called")
    dbUtil.DSPInteractWithDrug(res, req.query.name, driver)
})

app.get("/DSPIngredients", function (req, res) {
    console.log("DSPIngredients api called")
    dbUtil.DSPIngredients(res, req.query.name, driver)
});

app.get("/DSPAdverseReaction", function (req, res) {
    console.log("DSPAdverseReaction api called")
    dbUtil.DSPAdverseReaction(res, req.query.name, driver)
})

app.listen(8080);
console.log("server started")
module.exports = app