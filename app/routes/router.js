var express = require("express");
const { body } = require("express-validator");
var router = express.Router();
var mysql = require("mysql2");
const uuid = require('uuid');
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);



const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "@ITB123456",
    database: "ziuu",
    port: 3306
  });

  db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Conectado ao MySQL');
  });


  var { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");
  var UsuarioDAL = require("../models/UsuarioDAL");
    var usuarioDAL = new UsuarioDAL(db);


  const {validationResult } = require("express-validator");

function myMiddleware(req, res, next) {
    // Your middleware logic here
    next(); // Call next to continue to the next middleware or route handler
  }

  router.use(myMiddleware);


  router.get("/sair", limparSessao, function (req, res) {
    res.redirect("/");
  });
  
  router.get("/", verificarUsuAutenticado, async function (req, res) {
    req.session.autenticado.login = req.query.login;
    res.render("pages/home", req.session.autenticado);
  });

  router.get("/home", verificarUsuAutenticado, function (req, res) {
    req.session.autenticado.login = req.query.login;
    res.render("pages/home", req.session.autenticado);
  });

  router.get("/usuario", verificarUsuAutenticado, function (req, res) {
    if (req.session.autenticado.autenticado == null) {
      res.render("pages/login")
  } else {
      res.render("pages/usuario",{autenticado: req.session.autenticado, retorno: null, erros: null})}
  
  });

  

router.get("/cadastro", function(req, res){
    res.render("pages/cadastro", {retorno: null, erros: null})}
);




router.get("/login", function(req, res){
    res.render("pages/login", {retorno: null, erros: null})}
);

router.get("/sessao", function(req, res){
    res.render("pages/iniciosessao", {retorno: null, erros: null})}
);



router.get("/paineladministrativo", verificarUsuAutorizado([2, 3], ("pages/restrito")), function (req, res){
  req.session.autenticado.login = req.query.login;
  res.render("pages/paineladministrativo", req.session.autenticado)
}
)

router.post("/cadastrar", 
    body("email")
    .isEmail({min:5, max:50})
    .withMessage("O email deve ser válido"),
    body("senha")
    .isStrongPassword()
    .withMessage("A senha deve ser válida"),

    async function(req, res){
    
    const dadosForm = {
        nome: req.body.nome,
        email: req.body.email,
        senha: bcrypt.hashSync(req.body.senha, salt)
    }
    if (!dadosForm.email || !dadosForm.senha) {
        return res.status(400).send('Por favor, preencha todos os campos.');
    }
    const id = uuid.v4();

    const query = 'INSERT INTO usuarios (id, nome, email, senha) VALUES (?, ?, ?, ?, ?)';
    const values = [id, dadosForm.nome, dadosForm.email, dadosForm.senha];

    db.query(query, values, (err, result) => {
        if (err) {
          console.error('Erro ao inserir dados no banco de dados:', err);
        } else {
          console.log('Dados inseridos com sucesso!');
        }
      });

      

      setTimeout(function () {
        res.render("pages/formenviado", { email: dadosForm.email });
      }, 1000); 

      console.log(dadosForm)    
})


router.post(
    "/login",
    body("email")
      .isLength({ min: 4, max: 45 })
      .withMessage("O nome de usuário/e-mail deve ter de 8 a 45 caracteres"),
    body("senha")
      .isStrongPassword()
      .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"),
  
    gravarUsuAutenticado(usuarioDAL, bcrypt),
    
    function (req, res) {
      const erros = validationResult(req);
      if (!erros.isEmpty()) {
        
        return res.render("pages/login", { listaErros: erros, dadosNotificacao: null, autenticado: null })
      }
      if (req.session.autenticado != null) {
        //mudar para página de perfil quando existir
        res.redirect("/?login=logado");
      } else {
        res.render("pages/login", { listaErros: erros, autenticado: req.session.autenticado, dadosNotificacao: { titulo: "Erro ao logar!", mensagem: "E-mail e/ou senha inválidos!", tipo: "error" } })
      }
});
  

//   router.post(
//     "/login",
//     body("email")
//         .isEmail({min:5, max:50})
//         .withMessage("O email deve ser válido"),
//     body("senha")
//         .isStrongPassword()
//         .withMessage("A senha deve ser válida"),



//     // gravarUsuAutenticado(usuarioDAL, bcrypt),
//     function(req, res){

//         const dadosForm = {
//             email: req.body.email,
//             senha: req.body.senha
//         }
//         if (!dadosForm.email || !dadosForm.senha) {
//             return res.status(400).send('Por favor, preencha todos os campos.');
//         }
//          const errors = validationResult(req)
//          if(!errors.isEmpty()){
//              console.log(errors);    
//              return res.render("pages/login", {retorno: null, listaErros: errors, valores: req.body});
//          }
//         // if(req.session.autenticado != null) {
//         //    res.redirect("/");
//         // } else {
//         //      res.render("pages/login", { listaErros: null, retorno: null, valores: req.body})
//         //  }

//         setTimeout(function () {
//              res.render("pages/home", { email: dadosForm.email });
//            }, 1000); 
//     });



module.exports = router;