
exports.KeyWordSearch = function (res, type, SearchPrifix, WordCount, driver) {
    var session = driver.session();
    console.log(type)
    console.log(SearchPrifix)
    console.log(WordCount)
    // 1 stands for Suppliment
    if (type == 1) {
        var ret = session.run('MATCH (n:DSP) where n.name =~ \"(?i)' + SearchPrifix + '.*\" RETURN n LIMIT $OutLimit', { OutLimit: WordCount })
    } else if (type == 2) {
        var ret = session.run('MATCH (n:SPD) where n.name =~ \"(?i)' + SearchPrifix + '.*\" RETURN n LIMIT $OutLimit', { OutLimit: WordCount })
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
    }
    )
        .catch(function (err) {
            console.log(err.toString())
        }
        )
}


//var session = driver.session();
exports.MedDSInteraction = function (medList, DSList, driver) {
    if (medList.length == 0 || DSList.length == 0)
        return []

    if (medList.length != 1 && DSList.length != 1)
        return []

    var session = driver.session();

    if (medList.length == 1) {
        var ret = session.run('MATCH (a:DSP)-[:has_ingredient]->(b)-[:interacts_with]->(c:SPD{name:$SPDName}) ' +
            'where a.name in $SupList  RETURN a', { SupList: DSList, SPDName: medList[0] })
    } else {
        var ret = session.run('MATCH (a:DSP{name:$SupName})-[:has_ingredient]->(b)' +
            '-[:interacts_with]->(c) where c.name in $MedList  RETURN c', { MedList: medList, SupName: DSList[0] })
    }
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
        console.log(result)
        res.send()
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