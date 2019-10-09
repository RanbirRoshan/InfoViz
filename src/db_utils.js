
//var session = driver.session();
exports.pingServer = function () {
    var neo4j = require('neo4j-driver').v1;
    var driver = neo4j.driver("bolt://127.0.0.1:7687");
    var session  = driver.session();

    var ret = session.run('MATCH p=()-[r:has_ingredient]->() RETURN p LIMIT 25')
        .then(function(result) {
                result.records.forEach(function (data) {
                    console.log(data);
                })
                session.close();
                driver.close()
            }
            )
        .catch (function(err){
            console.log(err.toString())}
            )

    return "Server Ping Called";
}