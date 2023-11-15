module.exports = class PostDAL {

    constructor(conexao){
        this.conexao = conexao;
    }
    
    FindAll(){
        return new Promise(function(resolve, reject){
            this.conexao.query('SELECT * FROM divulgacao ',  function(error, elements){
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    // findUserEmail(camposForm) {
    //     return new Promise((resolve, reject) => {
    //         this.athenashop.query("SELECT * FROM produtos WHERE email = ?",
    //         [camposForm.email],
    //             function (error, elements) {
    //                 if (error) {
    //                     return reject(error);
    //                 }

    //                 return resolve(elements);
    //             });
    //     });
    // };

    findID(id) {
        return new Promise((resolve, reject) => {
            this.conexao.query("SELECT * FROM divulgacao WHERE id_divulgacao = ?", [id], function (error, elements) {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(elements);
                });
        });
    };

    FindPage(pagina, total){
        return new Promise((resolve, reject)=>{
            this.conexao.query('SELECT * FROM divulgacao limit '+ pagina + ', '+ total,  function(error, elements){
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    TotalReg(){
        return new Promise((resolve, reject)=>{
            this.conexao.query('SELECT count(*) total FROM divulgacao ',  function(error, elements){
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    create(camposJson) {
        return new Promise((resolve, reject) => {
            this.conexao.query("insert into divulgacao set ?",
                camposJson,
                function (error, elements) {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(elements);
                });
        });
    }
    update(camposJson, id) {
        return new Promise((resolve, reject) => {
            this.conexao.query("UPDATE divulgacao SET ? WHERE id = ?",
            [camposJson, id],
            function (error, results, fields) {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    // delete(id) {
    //     return new Promise((resolve, reject) => {
    //         this.athenashop.query("UPDATE produtos SET id_tipo_usuario = 0 WHERE id = ?", [id], function (error, results) {
    //             if (error) {
    //                 return reject(error);
    //             }
    //             return resolve(results[0]);
    //         });
    //     });
    // }
}