var mysql = require("mysql2")

// module.exports = function(){
//     return mysql.createConnection({
//         host:   "viaduct.proxy.rlwy.net",
//         user:   "root",
//         password:   "526-1G5EbHaAf23ehFcDA-HGGfBcg1cF",
//         database:   "railway",
//         port:   "32820"
//     });

// };

module.exports = function(){
    return mysql.createConnection({
        host:   "127.0.0.1",
        user:   "root",
        password:   "@ITB123456",
        database:   "ziuu",
        port:   "3306"
    });

};


// module.exports = function(){

//     var connection = mysql.createConnection({
//       host     : 'viaduct.proxy.rlwy.net',
//       user     : 'root',
//       password : '526-1G5EbHaAf23ehFcDA-HGGfBcg1cF',
//       database : 'Tables',
//       port: 32820
//     });

//     connection.connect();
//     return connection
//     }

