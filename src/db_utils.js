
exports.KeyWordSearch = function (res, type, SearchPrifix, WordCount, driver) {
    var session = driver.session();
    console.log(type)
    console.log(SearchPrifix)
    console.log(WordCount)
    // 1 stands for Suppliment
    if (type == 1) {
        var ret = session.run('MATCH (n:DSP) where n.name =~ \"(?i)' + SearchPrifix + '.*\" RETURN n LIMIT $OutLimit', { OutLimit: WordCount })
    } else if (type == 2) {
        var ret = session.run('MATCH (n:PD) where n.name =~ \"(?i)' + SearchPrifix + '.*\" RETURN n LIMIT $OutLimit', { OutLimit: WordCount })
    } else if (type == 3) {
        var ret = session.run('MATCH (n:SDSI) where n.name =~ \"(?i)' + SearchPrifix + '.*\" RETURN n LIMIT $OutLimit', { OutLimit: WordCount })
    } else {
        var ret = session.run('MATCH (n) where n.name =~ \"(?i)' + SearchPrifix + '.*\" RETURN n LIMIT $OutLimit', { OutLimit: WordCount })
    }
    ret.then(function (result) {
        var list = []
        result.records.forEach(function (item) {
            list.push(item._fields[0].properties.name)
        })
        res.send(list)
        session.close();
    }).catch(function (err) {
        console.log(err.toString())
    })
}


//var session = driver.session();
exports.MedDSInteraction = function (medList, DSList, response, driver) {
    medList = medList.split(",")
    DSList = DSList.split(",")

    console.log("DSList: ", DSList)
    console.log("MedList: ", medList)
    list = []
    if (medList.length == 0 || DSList.length == 0) {
        response.send(list)
        return
    }

    if (medList.length != 1 && DSList.length != 1) {
        response.send(list)
        return
    }

    var session = driver.session();

    if (medList.length == 1) {
        var primary = medList[0]

        var ret = session.run('MATCH (a:DSP)-[:has_ingredient]->(b)-[:interacts_with]->(c:PD{name:$PDName}) ' +
            'where a.name in $SupList  RETURN a', { SupList: DSList, PDName: medList[0] })
    } else {
        var primary = DSList[0]

        var ret = session.run('MATCH (a:DSP{name:$SupName})-[:has_ingredient]->(b)' +
            '-[:interacts_with]->(c) where c.name in $MedList  RETURN c', { MedList: medList, SupName: DSList[0] })
    }
    ret.then(function (result) {
        result.records.forEach(function (data) {
            list.push(data._fields[0].properties.name)
        })
        console.log("Varun", [primary, Array.from(new Set(list))])
        response.send([primary, Array.from(new Set(list))])
        session.close();
    }
    )
        .catch(function (err) {
            console.log(err.toString())
        }
        )
}

exports.pingServer = function (req, res, driver) {

    var list = []
    var session = driver.session();

    //var ret = session.run('MATCH (p:SDSI)<-[:has_ingredient]-(n) where p.name="Lysine" or p.name="Iron" RETURN n')
    var ret = session.run('MATCH p=()-[r:interacts_with]->() RETURN p LIMIT 10')
    // console.log("hi")
    //wait till ret has returned
    ret.then(function (result) {
        //  result.records.forEach(function (data) {
        //      list.push(data._fields[0].properties.name)
        //      //console.log(data._fields[0].properties.name);
        // })
        // list.forEach(function(item)
        // {
        //    // res.write(item)
        // })
        // res.send(list)
        res.send()
        session.close();
    }
    )
        .catch(function (err) {
            console.log(err.toString())
        }
        )

    // console.log("end")
    // list.forEach(function (item) {
    //     console.log(item)
    // })

    return "Server Ping Called Jay";
}

exports.DSPIngredients = function (res, DSPName, driver) {
    var session = driver.session();
    console.log(DSPName)
    var ret = session.run('MATCH (a:DSP{name:$Name})-[r:has_ingredient]-(b) RETURN b', { Name: DSPName })//interacts_with(SDSI, PD)
    var drugList = []
    ret.then(function (result) {
        result.records.forEach(function (item) {
            drugList.push(item._fields[0].properties.name)
        })
        res.send(drugList)
    }).catch(function (err) {
        console.log(err.toString())
    })
}

exports.GetItemDetails = function (res, type, name, driver) {
    var session = driver.session();
    console.log(type)
    console.log(name)
    // 1 stands for suppliment
    if (type == 1) {
        var ret = session.run('MATCH (a:DSP{name:$SearchName}) return a', { SearchName: name })
        // 2 is for medicine
    } else if (type == 2) {
        var ret = session.run('MATCH (a:PD{name:$SearchName}) return a', { SearchName: name })
        // 3 is for ingredients
    } else if (type == 3) {
        var ret = session.run('MATCH (a:SDSI{name:$SearchName}) return a', { SearchName: name })
        // 4 is for SS
    } else if (type == 4) {
        var ret = session.run('MATCH (a:SS{name:$SearchName}) return a', { SearchName: name })
        // 5 is for diseases
    } else if (type == 5) {
        var ret = session.run('MATCH (a:DIS{name:$SearchName}) return a', { SearchName: name })
        // 6 is for therapeutic class
    } else if (type == 6) {
        var ret = session.run('MATCH (a:TC{name:$SearchName}) return a', { SearchName: name })
        // 7 is for SOC
    } else if (type == 7) {
        var ret = session.run('MATCH (a:SOC{name:$SearchName}) return a', { SearchName: name })
    }
    ret.then(function (result) {
        console.log(result);
        sendData = true
        result.records.forEach(function (item) {
            if (sendData)
                res.send(item._fields[0].properties)
            sendData = false;
        })
        if (sendData)
            res.send("")
        session.close();
    }).catch(function (err) {
        console.log(err.toString())
    })
}

exports.GetIngredientEffectiveFor = function (res, name, driver) {
    var session = driver.session();
    console.log(name)
    var ret = session.run('MATCH (a:SDSI{name:$Name})-[:is_effective_for]->(b) RETURN b', { Name: name })
    var diseaseList = []
    ret.then(function (result) {
        result.records.forEach(function (item) {
            diseaseList.push(item._fields[0].properties.name)
        })
        session.close();
        res.send(diseaseList)
    }).catch(function (err) {
        console.log(err.toString())
    })
}

exports.GetIngredientComponentOf = function (res, name, driver) {
    var session = driver.session();
    console.log(name)
    var ret = session.run('MATCH (a:SDSI{name:$Name})<-[r:has_ingredient]-(b) RETURN b', { Name: name })
    var diseaseList = []
    ret.then(function (result) {
        result.records.forEach(function (item) {
            diseaseList.push(item._fields[0].properties.name)
        })
        session.close();
        res.send(diseaseList)
    }).catch(function (err) {
        console.log(err.toString())
    })

}

exports.GetIngredientInteractsWithDrug = function (res, ingredientName, driver) {
    var session = driver.session();
    console.log(ingredientName)
    var ret = session.run('MATCH (a:SDSI{name:$Name})-[r:interacts_with]->(b) RETURN b', { Name: ingredientName })//interacts_with(SDSI, PD)
    var drugList = []
    ret.then(function (result) {
        result.records.forEach(function (item) {
            drugList.push(item._fields[0].properties.name)
        })
        res.send(drugList)
    }).catch(function (err) {
        console.log(err.toString())
    })
}


exports.IngredientHasAdverseReaction = function (res, ingredientName, driver) {
    var session = driver.session();
    // console.log("jab")
    // console.log(ingredientName, session, driver, "abcd")
    var ret = session.run('MATCH (a:SDSI{name:$Name})-[r:has_adverse_reaction]-(b) RETURN b', { Name: ingredientName })
    var symptomList = []

    ret.then(function (result) {
        // console.log(result)
        // console.log("Inside ret")
        result.records.forEach(function (item) {
            symptomList.push(item._fields[0].properties.name)
        })
        res.send(symptomList)
    }).catch(function (err) {
        console.log(err.toString())
    })
}

exports.DrugInteractWithIngredient = function (res, drugName, driver) {
    var session = driver.session();
    console.log(drugName, session)
    var ret = session.run('MATCH (a:PD{name:$Name})<-[r:interacts_with]-(b) RETURN b', { Name: drugName })//interacts_with(SDSI, PD)
    var drugList = []
    ret.then(function (result) {
        result.records.forEach(function (item) {
            drugList.push(item._fields[0].properties.name)
        })
        res.send(drugList)
    }).catch(function (err) {
        console.log(err.toString())
    })
}

exports.DrugInteractWithSuppliment = function (res, drugName, driver) {
    var session = driver.session();
    console.log(drugName)
    var ret = session.run('Match (a:PD{name:$Name})<-[r:interacts_with]-(b)-[k:has_ingredient]-(c) RETURN c', { Name: drugName })//interacts_with(SDSI, PD)
    var drugList = []
    ret.then(function (result) {
        result.records.forEach(function (item) {
            drugList.push(item._fields[0].properties.name)
        })
        res.send(drugList)
    }).catch(function (err) {
        console.log(err.toString())
    })
}

exports.DSPInteractWithDrug = function (res, DSPName, driver) {
    var session = driver.session();
    //DSPName = "Xpn Mag-4 Plus"
    console.log(DSPName)
    var ret = session.run('Match (a:DSP{name:$Name})-[r:has_ingredient]-(b)-[k:interacts_with]->(c) RETURN c', { Name: DSPName })//interacts_with(SDSI, PD)
    var drugList = []
    ret.then(function (result) {
        result.records.forEach(function (item) {
            drugList.push(item._fields[0].properties.name)
        })
        res.send(drugList)
    }).catch(function (err) {
        console.log(err.toString())
    })
}

exports.DSPAdverseReaction = function (res, DSPName, driver) {
    var session = driver.session();
    //DSPName = "Male Supplement Post-Meal + Testo Boost"
    console.log(DSPName)
    var ret = session.run('Match (a:DSP{name:$Name})-[r:has_ingredient]-(b)-[k:has_adverse_reaction]->(c) RETURN c', { Name: DSPName })//interacts_with(SDSI, PD)
    var drugList = []
    ret.then(function (result) {
        result.records.forEach(function (item) {
            drugList.push(item._fields[0].properties.name)
        })
        res.send(drugList)
    }).catch(function (err) {
        console.log(err.toString())
    })
}