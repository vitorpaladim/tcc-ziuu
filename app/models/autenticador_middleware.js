const { validationResult } = require("express-validator");


function verificarUsuAutenticado(req, res, next) {
    if (req.session.autenticado) {
        var autenticado = req.session.autenticado;
    } else {
        var autenticado = { autenticado: null };
    }
    req.session.autenticado = autenticado;
    console.log(req.session.autenticado);
    next();
}

function limparSessao(req, res, next) {
    req.session.destroy();
    next()
}

function gravarUsuAutenticado(usuarioDAL, bcrypt) {
    return async (req, res, next) => {
        erros = validationResult(req)
        if (erros.isEmpty()) {
            var dadosForm = {
                email: req.body.email,
                senha: req.body.senha,
            };
            var results = await usuarioDAL.findUserEmail(dadosForm);
            var total = Object.keys(results).length;
            if (total == 1) {
                if (bcrypt.compareSync(dadosForm.senha, results[0].senha)) {
                    var autenticado = {
                        autenticado: results[0].nome,
                        id: results[0].id,
                        tipo: results[0].id_tipo_usuario,
                        img_perfil_pasta:"../public/img/profile-user.png"
                    };
                }
            } else {
                var autenticado =  null ;
            }
        } else {
            var autenticado = null ;
            //tratar os erros no campo do formulário
        }
        req.session.autenticado = autenticado;
        next();
    }
}

function verificarUsuAutorizado(tipoPermitido, destinoFalha){
    return (req, res, next) => {
        if (req.session.autenticado.autenticado != null && tipoPermitido.find(function (element) { return element == req.session.autenticado.tipo }) != undefined ) {
            next();
        } else {
            res.render(destinoFalha);
        }
    };
}

module.exports = {
    verificarUsuAutenticado,
    limparSessao,
    gravarUsuAutenticado,
    verificarUsuAutorizado
}