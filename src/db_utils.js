
//var session = driver.session();
exports.pingServer = function (req, res, driver) {

    var list = []
    var session  = driver.session();

    //var ret = session.run('MATCH (p:SDSI)<-[:has_ingredient]-(n) where p.name="Lysine" or p.name="Iron" RETURN n')
    var ret = session.run('MATCH p=()-[r:interacts_with]->() RETURN p LIMIT 10')
    console.log("hi")
    //wait till ret has returned
    ret.then(function(result) {
            //  result.records.forEach(function (data) {
            //      list.push(data._fields[0].properties.name)
            //      //console.log(data._fields[0].properties.name);
            // })
            // list.forEach(function(item)
            // {
            //    // res.write(item)
            // })
            // res.send(list)
        console.log(result.records[0]._fields[0].segments[0].relationship)
            res.send()
            session.close();
        }
        )
    .catch (function(err){
        console.log(err.toString())}
        )

    console.log("end")
    list.forEach(function(item)
    {
        console.log(item)
    })

    return "Server Ping Called";
}