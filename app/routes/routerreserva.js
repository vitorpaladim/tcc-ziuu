var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const uuid = require("uuid");
const mysql = require("mysql2")


var fabricaDeConexao = require("../../config/connection-factory")
var conexao = fabricaDeConexao

const db = mysql.createConnection({
  host:   "viaduct.proxy.rlwy.net",
  user:   "root",
  password:   "526-1G5EbHaAf23ehFcDA-HGGfBcg1cF",
  database:   "railway",
    port: 3300
});

db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Conectado ao MySQL');
  });

  var UsuarioDAL = require("../models/UsuarioDAL");
  var usuarioDAL = new UsuarioDAL(db);

    function myMiddleware(req, res, next) {
      // Your middleware logic here
      next(); // Call next to continue to the next middleware or route handler
    }
  
    router.use(myMiddleware);
  

var { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");

const { body, validationResult } = require("express-validator");

router.get("/sair", limparSessao, function (req, res) {
    res.redirect("/");
  });

router.get("/", async function(req, res){
    console.log("auth --> ")
    console.log(req.session.autenticado)
    res.render("pages/home",{autenticado:req.session.autenticado, login: req.res.autenticado} );
      
});

router.get("/home", async function(req, res){
    console.log("auth --> ")
    console.log(req.session.autenticado)
    res.render("pages/home",{autenticado:req.session.autenticado, login: req.res.autenticado} );
      
});

router.get("/login", verificarUsuAutenticado, function(req, res){
    res.render("pages/login", {listaErros:null, retorno: null, erros: null,  valores: {"senha":"","email":""}})}
);

router.get("/sessao", verificarUsuAutenticado, function(req, res){
    res.render("pages/iniciosessao", {listaErros:null, retorno: null, erros: null,  valores: {"senha":"","email":""}})}
);

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

    const query = 'INSERT INTO usuarios (id, nome, email, senha) VALUES (?, ?, ?, ?)';
    const values = [id, dadosForm.nome, dadosForm.email, dadosForm.senha];

    db.query(query, values, (err, result) => {
        if (err) {
          console.error('Erro ao inserir dados no banco de dados:', err);
        } else {
          console.log('Dados inseridos com sucesso!');
        }
      });

      

      setTimeout(function () {
        res.render("pages/login", { email: dadosForm.email });
      }, 1000); 

      console.log(dadosForm)    
})

router.post(
  "/logar",
  body("email")
    .isLength({ min: 4, max: 80 })
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



module.exports = router
