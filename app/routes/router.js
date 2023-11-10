var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const uuid = require("uuid");
const mysql = require("mysql2");

// Importa a fábrica de conexões e cria uma conexão ao banco de dados.
/*var fabricaDeConexao = require("../../config/connection-factory");
var conexao = fabricaDeConexao;*/

/*
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "@ITB123456",
    database: "ziuu",
    port: 3306
}); */

// Conecta ao banco de dados.
/*db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Conectado ao MySQL');
});*/

// Importa o módulo de acesso a dados do usuário.
var UsuarioDAL = require("../models/UsuarioDAL");
var usuarioDAL = new UsuarioDAL(null);

// Importa middlewares de autenticação e validação de entrada.
var { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");

const { body, validationResult } = require("express-validator");

// Rota para fazer logout.
router.get("/sair", limparSessao, function (req, res) {
    res.redirect("/");
});

// Rota principal - exibe a página inicial.
router.get("/", async function(req, res){
    console.log("auth --> ")
    console.log(req.session.autenticado)
    res.render("pages/home",{autenticado:req.session.autenticado, login: req.res.autenticado} );
});

// Rota para a página inicial (talvez duplicada por engano).
router.get("/home", async function(req, res){
    console.log("auth --> ")
    console.log(req.session.autenticado)
    res.render("pages/home",{autenticado:req.session.autenticado, login: req.res.autenticado} );
});

// Rota para a página de login.
router.get("/login", async function(req, res){
    res.render("pages/login")
});

// Rota para criar um novo usuário.
router.post("/cadastrar", 
    body("email")
    .isEmail({min:5, max:50})
    .withMessage("O email deve ser válido"),
    body("senha")
    .isStrongPassword()
    .withMessage("A senha deve ser válida"),

    async function(req, res){
    
    // Coleta os dados do formulário.
    const dadosForm = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha
    }

    if (!dadosForm.email || !dadosForm.senha) {
        return res.status(400).send('Por favor, preencha todos os campos.');
    }

    const id = uuid.v4();

    // Query para inserir um novo usuário no banco de dados.
    const query = 'INSERT INTO usuarios (id, nome, email, senha) VALUES (?, ?, ?, ?)';
    const values = [id, dadosForm.nome, dadosForm.email, dadosForm.senha];

    /*
    db.query(query, values, (err, result) => {
        if (err) {
          console.error('Erro ao inserir dados no banco de dados:', err);
        } else {
          console.log('Dados inseridos com sucesso!');
        }
    }); */

    // Redireciona para a página de login após um atraso.
    setTimeout(function () {
        res.render("pages/login", { email: dadosForm.email });
    }, 1000); 

    console.log(dadosForm)    
});

// Rota para realizar o login de um usuário.
router.post(
    "/login",
    body("email")
      .isLength({ min: 4, max: 45 })
      .withMessage("O nome de usuário/e-mail deve ter de 8 a 45 caracteres"),
    body("senha")
      .isStrongPassword()
      .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"),
  
    // Middleware para gravar informações de autenticação na sessão.
    gravarUsuAutenticado(usuarioDAL),
    
    function (req, res) {
      const erros = validationResult(req);
      if (!erros.isEmpty()) {
        
        return res.render("pages/login", { listaErros: erros, dadosNotificacao: null, autenticado: null })
      }
      if (req.session.autenticado != null) {
        // Redireciona para a página principal quando o usuário está autenticado.
        res.redirect("/");
      } else {
        // Exibe mensagens de erro quando a autenticação falha.
        res.render("pages/login", { listaErros: erros, autenticado: req.session.autenticado, dadosNotificacao: { titulo: "Erro ao logar!", mensagem: "E-mail e/ou senha inválidos!", tipo: "error" } })
      }
});

module.exports = router;