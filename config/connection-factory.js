var mysql = require("mysql2")

module.exports = function(){
    return mysql.createConnection({
        host: "viaduct.proxy.rlwy.net",
        user: "root",
        database: "railway",
        password: "526-1G5EbHaAf23ehFcDA-HGGfBcg1cF",
        port: 32820
    });

};


