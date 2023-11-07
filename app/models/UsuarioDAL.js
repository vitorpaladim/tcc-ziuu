module.exports = class UsuarioDAL {

    constructor(conexao){
        this.conexao = conexao;
    }
    
    findAll(){
        return new Promise((resolve, reject) => {
            this.conexao.query("SELECT id, nome, email", function (error, elements){
                if (error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    FindPage(pagina, total){
        return new Promise((resolve, reject)=>{
            this.conexao.query('SELECT * FROM usuarios limit '+ pagina + ', '+ total,  function(error, elements){
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    TotalReg(){
        return new Promise((resolve, reject)=>{
            this.conexao.query('SELECT count(*) total FROM usuarios ',  function(error, elements){
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    findUserEmail(camposForm) {
        return new Promise((resolve, reject) => {
            this.conexao.query("SELECT * FROM usuarios WHERE nome = ? or email = ?", [camposForm.nome, camposForm.email], function (error, elements) {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    findID(id) {
        return new Promise((resolve, reject) => {
            this.conexao.query("SELECT id, nome, senha, email, FROM usuarios", [id], function(error, elements){
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    create(camposJson) {
        return new Promise((resolve, reject) => {
            this.conexao.query("insert into usuarios set ?", camposJson, function(error, elements){
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    update(camposJson) {
        return new Promise((resolve, reject) => {
            this.conexao.query("UPDATE usuarios SET nome = ?, " + "email = ?, " + "WHERE id = ?", [camposJson.id, camposJson.nome, camposJson.email, camposJson.senha], function (error, results, fields){
                if (error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            this.conexao.query("UPDATE usuarios SET status_usu = 0 WHERE id = ?", [id], function(error, results) {
                if (error) {
                    return reject(error);
                }
                return resolve(results[0]);
            });
        });
    }

}