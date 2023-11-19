var express = require("express");
const { body } = require("express-validator");
var router = express.Router();
var mysql = require("mysql2");
const uuid = require('uuid');
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
require('dotenv').config()

const multer = require('multer');
const path = require('path');
// ****************** Versão com armazenamento em diretório
// Definindo o diretório de armazenamento das imagens
var storagePasta = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, './app/public/img/posts/') // diretório de destino  
  },
  filename: (req, file, callBack) => {
    callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    //renomeando o arquivo para evitar duplicidade de nomes
  }
})



//const port = process.emv.PORT || '3300';

var upload = multer({ storage: storagePasta });



// const db = mysql.createConnection({
//   host:   "viaduct.proxy.rlwy.net",
//   user:   "root",
//   password:   "526-1G5EbHaAf23ehFcDA-HGGfBcg1cF",
//   database:   "railway",
//     port: 3300
//   });


  const db = mysql.createConnection({
    host:   "127.0.0.1",
        user:   "root",
        password:   "@ITB123456",
        database:   "ziuu",
        port:   "3306"
    });

  db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Conectado ao MySQL');
  });

  var { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");
  
var fabricaDeConexao = require("../../config/connection-factory");
var conexao = fabricaDeConexao();

var UsuarioDAL = require("../models/UsuarioDAL");
var usuarioDAL = new UsuarioDAL(conexao);

var PostDAL = require("../models/PostDAL");
var postDAL = new PostDAL(conexao);

var ComunidadeDAL = require("../models/ComunidadeDAL");
var comunidadeDAL = new ComunidadeDAL(conexao);


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

  // router.get("/usuario", verificarUsuAutenticado, function (req, res) {
  //   if (req.session.autenticado.autenticado == null) {
  //     res.redirect("/login")
  // } else {
  //     res.render("pages/perfil",{autenticado: req.session.autenticado, retorno: null, erros: null})}
      
    
  // });
  

  // router.get("/usuario", verificarUsuAutenticado, function (req, res) {
  //   if (req.session.autenticado == null) {
  //     res.redirect("/login");
  //   } else {
  //     const idUsuario = req.session.autenticado.id;
  
  //     try {
  //       // Buscar postagens do usuário com base no ID
  //       const sql = 'SELECT * FROM postagem WHERE id_usuario = ?';
  //       db.query(sql, [idUsuario], (err, result) => {
  //         if (err) {
  //           res.status(500).json({ error: 'Erro ao buscar postagens' });
  //         } else {
  //           res.status(200).json({ postagens: result });
  //         }
  //       });
  //     } catch (error) {
  //       res.status(500).json({ error: 'Erro ao buscar postagens' });
  //     }
  //   }
  // });

  router.get("/usuario", verificarUsuAutenticado, function (req, res) {
    if (req.session.autenticado == null) {
      res.redirect("/login");
    } else {
      const idUsuario = req.session.autenticado.id;
  
      try {
        // Buscar postagens do usuário com base no ID
        const sql = 'SELECT * FROM divulgacao WHERE id_usuario = ?';
        db.query(sql, [idUsuario], (err, result) => {
          if (err) {
            res.status(500).json({ error: 'Erro ao buscar postagens' });
          } else {
            // Verifica se não há erro e se o resultado está vazio
            if (!err && result.length === 0) {
              res.redirect("/login")
            } else {
              res.render('pages/perfil', { divulgacao: result, autenticado: req.session.autenticado});
            }
          }
        });
      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar postagens' });
      }
    }
  });

  router.get("/editarpublicacao/:id_divulgacao", async function (req, res) {
    try {
      result = await postDAL.findID(req.params.id_divulgacao)
      console.log(result)
      res.render("pages/editarpublicacao", { divulgacao: result, autenticado: req.session.autenticado, login: req.res.autenticado })
  
    } catch {
      res.redirect("/usuario")
    }
  })

  router.get("/deletarpublicacao/:id_divulgacao", function (req, res) {
    var query = db.query(
      "DELETE FROM divulgacao WHERE ?",
      { id_divulgacao: req.params.id_divulgacao },
      function (error, results, fields) {
        if (error) throw error;
      }
    );  
    res.redirect("/");
  });
  
  
  
  

  

router.get("/cadastro", function(req, res){
    res.render("pages/cadastro", { listaErros: null, dadosNotificacao: null, valores: req.body})}
);


router.get("/login", function(req, res){
    res.render("pages/login", { listaErros: null, dadosNotificacao: null, valores: req.body})}
);

router.get("/perfil", function(req, res){
  res.render("pages/perfil", {retorno: null, erros: null})}
);


router.get("/sessao", function(req, res){
    res.render("pages/iniciosessao", {retorno: null, erros: null})}
);

router.get("/update", function(req, res){
  res.render("pages/update", {retorno: null, erros: null, autenticado: req.session.autenticado})}
);

router.get("/terms", function(req, res){
  res.render("pages/terms", {retorno: null, erros: null})}
);

router.get("/privacy", function(req, res){
  res.render("pages/privacy", {retorno: null, erros: null})}
);

router.get("/comunidades", function(req, res){
  res.render("pages/comunidades", {retorno: null, erros: null})}
);


router.get("/comunidades_artesvisuais", async function(req, res){
  try {

      let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
        
      inicio = parseInt(pagina - 1) * 10
      results = await comunidadeDAL.FindPage(inicio, 10);
      totReg = await comunidadeDAL.TotalReg();
      console.log(results)
  
      totPaginas = Math.ceil(totReg[0].total / 10);
  
      var paginador = totReg[0].total <= 10 ? null : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas }
  
      console.log("auth --> ")
      console.log(req.session.autenticado)
      res.render("pages/comunidades_artesvisuais",{ mensagens: results, paginador: paginador, autenticado:req.session.autenticado, listaErros: null, dadosNotificacao: null} );
    } catch (e) {
      console.log(e); // console log the error so we can see it in the console
      res.json({ erro: "Falha ao acessar dados" });
    }
  } );

router.post(
  "/enviarmsarte",
  upload.single("img_divulgacao"),
  verificarUsuAutenticado,
  verificarUsuAutorizado([1, 2, 3], "/login"),
  async function (req, res) {
    var dadosMs = {
      mensagem: req.body.mensagem,
      id_usuario: req.session.autenticado.id,
      usuario: req.session.autenticado.usuario,
    };

    if (req.file) {
      caminhoArquivo = "img/posts/" + req.file.filename;
      dadosMs.img_divulgacao = caminhoArquivo;
    }

    try {
      let insert = await comunidadeDAL.create(dadosMs);
      console.log(insert);
      res.redirect("/comunidades_artesvisuais");
    } catch (e) {
      res.redirect("/comunidades_artesvisuais");
    }
  }
);


// router.post("/enviarmsarte", 
// upload.single('img_divulgacao'),
// verificarUsuAutenticado, 
// verificarUsuAutorizado([1, 2, 3], "/login"),
//  async function(req,res){
//   var dadosMs = {
//     mensagem: req.body.mensagem,
//     img_divulgacao: req.body.img_divulgacao,
//     id_usuario: req.session.autenticado.id,
//     usuario: req.session.autenticado.usuario
//   }
//   console.log(dadosMs)
//   if (!req.file) {
//     console.log("Falha no carregamento");
//   } else {
//     caminhoArquivo = "img/posts/" + req.file.filename;
//     dadosMs.img_divulgacao = caminhoArquivo
//   }
//   try {
//     let insert = await comunidadeDAL.create(dadosMs);
//     console.log(insert);
//     res.redirect("/comunidades_artesvisuais")
//   } catch (e) {
//     res.redirect("/comunidades_artesvisuais")
//   }

// }
// );

router.get("/comunidades_musicas", function(req, res){
  res.render("pages/comunidades_musicas", {retorno: null, erros: null})}
);

router.get("/comunidades_artedigital", function(req, res){
  res.render("pages/comunidades_artedigital", {retorno: null, erros: null})}
);

router.get("/comunidades_artesanato", function(req, res){
  res.render("pages/comunidades_artesanato", {retorno: null, erros: null})}
);

router.get("/comunidades_audiovisual", function(req, res){
  res.render("pages/comunidades_audiovisual", {retorno: null, erros: null})}
);


router.get("/paineladministrativo", verificarUsuAutorizado([2, 3], ("pages/restrito")), function (req, res){
  req.session.autenticado.login = req.query.login;
  res.render("pages/paineladministrativo", req.session.autenticado)
}
)

router.post("/postar",
  upload.single('img_divulgacao'),
  async function(req, res){
    const formDivulgacao = {
        img_divulgacao: req.body.img_divulgacao,
        usuario_divulgacao: req.body.usuario_divulgacao,
        titulo_divulgacao: req.body.titulo_divulgacao,
        id_usuario: req.session.autenticado.id
    }
    if (!req.file) {
      console.log("Falha no carregamento");
    } else {
      caminhoArquivo = "img/posts/" + req.file.filename;
      formDivulgacao.img_divulgacao = caminhoArquivo
      console.log(req.file)
    }
    try {
      let insert = await postDAL.create(formDivulgacao);
      console.log(insert);
      // res.render("pages/divulgacao", {
      //   listaErros: null, dadosNotificacao: {
      //     titulo: "Post publicado!", mensagem: "publicado com o id " + insert.insertId + "!", tipo: "success"
      //   }, valores: req.body
      // })
      res.redirect("/divulgacao")
    } catch (e) {
      // res.render("pages/divulgacao", {
      //   listaErros: erros, dadosNotificacao: {
      //     titulo: "Erro ao publicar!", mensagem: "Verifique os valores digitados!", tipo: "error"
      //   }, valores: req.body
      // })
      res.redirect("/divulgacao")
    }
  }
  
  )

router.get("/divulgacao", async function(req, res){
  try {

      let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
        
      inicio = parseInt(pagina - 1) * 5
      results = await postDAL.FindPage(inicio, 5);
      totReg = await postDAL.TotalReg();
      console.log(results)
  
      totPaginas = Math.ceil(totReg[0].total / 5);
  
      var paginador = totReg[0].total <= 5 ? null : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas }
  
      console.log("auth --> ")
      console.log(req.session.autenticado)
      res.render("pages/divulgacao",{ post: results, paginador: paginador, autenticado:req.session.autenticado, listaErros: null, dadosNotificacao: null} );
    } catch (e) {
      console.log(e); // console log the error so we can see it in the console
      res.json({ erro: "Falha ao acessar dados" });
    }
  } );


router.get("/adm", verificarUsuAutorizado([3], "pages/home"), async function(req, res){
  try {

      let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
        
      inicio = parseInt(pagina - 1) * 5
      results = await usuarioDAL.FindPage(inicio, 5);
      totReg = await usuarioDAL.TotalReg();
      console.log(results)
  
      totPaginas = Math.ceil(totReg[0].total / 5);
  
      var paginador = totReg[0].total <= 5 ? null : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas }
  
      console.log("auth --> ")
      console.log(req.session.autenticado)
      res.render("pages/adm",{ usuarios: results, paginador: paginador, autenticado:req.session.autenticado} );
    } catch (e) {
      console.log(e); // console log the error so we can see it in the console
      res.json({ erro: "Falha ao acessar dados" });
    }
  } );

router.get("/excluir/:id", function (req, res) {
  var query = db.query(
    "DELETE FROM usuarios WHERE ?",
    { id: req.params.id },
    function (error, results, fields) {
      if (error) throw error;
    }
  );  
  res.redirect("/");
});



// router.post("/cadastrar", 
//     body("email")
//     .isEmail({min:5, max:50})
//     .withMessage("O email deve ser válido"),
//     body("senha")
//     .isStrongPassword()
//     .withMessage("A senha deve ser válida"),

//     async function(req, res){
    
//     const dadosForm = {
//         nome: req.body.nome,
//         email: req.body.email,
//         senha: bcrypt.hashSync(req.body.senha, salt)
//     }
//     if (!dadosForm.email || !dadosForm.senha) {
//         return res.status(400).send('Por favor, preencha todos os campos.');
//     }
//     const id = uuid.v4();

//     const query = 'INSERT INTO usuarios (id, nome, email, senha) VALUES (?, ?, ?, ?)';
//     const values = [id, dadosForm.nome, dadosForm.email, dadosForm.senha];

//     db.query(query, values, (err, result) => {
//         if (err) {
//           console.error('Erro ao inserir dados no banco de dados:', err);
//         } else {
//           console.log('Dados inseridos com sucesso!');
//         }
//       });

      

//       setTimeout(function () {
//         res.render("pages/login", { email: dadosForm.email });
//       }, 1000); 

//       console.log(dadosForm)    
// })

router.post("/cadastrar",
  body("nome")
    .isLength({ min: 3, max: 50 }).withMessage("Mínimo de 3 letras e máximo de 50!"),
  body("email")
    .isEmail().withMessage("Digite um e-mail válido!"),
  body("senha")
    .isStrongPassword()
    .withMessage("A senha deve ter no mínimo 8 caracteres, 1 letra maiúscula, 1 caractere especial e 1 número"),
  async function (req, res) {
    var dadosForm = {
      nome: req.body.nome,
      email: req.body.email,
      senha: bcrypt.hashSync(req.body.senha, salt),
    };
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.render("pages/cadastro", { listaErros: erros, dadosNotificacao: null, valores: req.body })
    }
    try {
      let insert = await usuarioDAL.create(dadosForm);
      console.log(insert);
      res.render("pages/cadastro", {
        listaErros: null, dadosNotificacao: {
          titulo: "Cadastro realizado!", mensagem: "Usuário criado com o id " + insert.insertId + "!", tipo: "success"
        }, valores: req.body
      })
    } catch (e) {
      res.render("pages/cadastro", {
        listaErros: erros, dadosNotificacao: {
          titulo: "Erro ao cadastrar!", mensagem: "Verifique os valores digitados!", tipo: "error"
        }, valores: req.body
      })
    }
  });


  router.post(
    "/logar",
    body("email")
      .isLength({ min: 4, max: 45 })
      .withMessage("O nome de usuário/e-mail esta incorreto!"),
    body("senha")
      .isStrongPassword()
      .withMessage("Verifique novamente a senha digitada!"),
  
    gravarUsuAutenticado(usuarioDAL, bcrypt),
    function (req, res) {
      const erros = validationResult(req);
      if (!erros.isEmpty()) {
        return res.render("pages/login", { listaErros: erros, dadosNotificacao: null })
      }
      if (req.session.autenticado != null) {
        //mudar para página de perfil quando existir
        res.render("pages/login", {
          listaErros: null, dadosNotificacao: {
            titulo: "Login realizado!", mensagem: "Usuário logado com sucesso", tipo: "success"
          }, valores: req.body
        })
      } else {
        res.render("pages/login", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao logar!", mensagem: "Usuário e/ou senha inválidos!", tipo: "error" } })
      }
    });


    router.get("/sair", limparSessao, function (req, res) {
      res.redirect("/");
    });


    router.post("/editarpost/:id_divulgacao",
    async function(req, res){
      var dadosPost = {
        titulo_divulgacao: req.body.titulo_divulgacao
      }
      var id_divulgacao = req.params.id_divulgacao
      console.log(dadosPost)
      let resultUpdate = await postDAL.update(dadosPost, id_divulgacao);
      
      if (!resultUpdate.isEmpty) {
        if (resultUpdate.changedRows == 1) {
          var result = await postDAL.findID(id_divulgacao);
          var campos = {
            titulo_divulgacao: result[0].titulo_divulgacao
          }
          res.redirect("/usuario")
        }
      }

    })


    router.post("/perfil", upload.single('img_usuario'),
  // body("nome")
  //   .isLength({ min: 3, max: 50 }).withMessage("Mínimo de 3 letras e máximo de 50!"),
  // body("cpf")
  //   .isLength({ min: 8, max: 30 }).withMessage("8 a 30 caracteres!"),
  // body("email")
  //   .isEmail().withMessage("Digite um e-mail válido!"),
  // body("telefone")
  //   .isLength({ min: 12, max: 13 }).withMessage("Digite um telefone válido!"),
  // verificarUsuAutorizado([1, 2, 3], "pages/login"),
  async function (req, res) {
    const erros = validationResult(req);
    console.log(erros)
    if (!erros.isEmpty()) {
      return res.render("pages/perfil", { listaErros: erros, dadosNotificacao: null, valores: req.body, autenticado: req.body.autenticado})
    }
    try {
      var dadosForm = {
        nome: req.body.nome,
        usuario: req.body.usuario,
        email: req.body.email,
        img_usuario: req.body.img_usuario,
        id_tipo_usuario: 1
      };
      console.log("senha: " + req.body.senha)
      if (req.body.senha != "") {
        dadosForm.senha = bcrypt.hashSync(req.body.senha, salt);
      }
      if (!req.file) {
        console.log("Falha no carregamento");
      } else {
        caminhoArquivo = "img/posts/" + req.file.filename;
        dadosForm.img_usuario = caminhoArquivo
      }
      console.log(dadosForm);

      let resultUpdate = await usuarioDAL.update(dadosForm, req.session.autenticado.id);
      if (!resultUpdate.isEmpty) {
        if (resultUpdate.changedRows == 1) {
          var result = await usuarioDAL.findID(req.session.autenticado.id);
          var autenticado = {
            nome: result[0].nome,
            id: result[0].id,
            email: result[0].email,
            usuario: result[0].usuario,
            img_usuario: result[0].img_usuario,
            id_tipo_usuario: result[0].id_tipo_usuario
            
          };
          req.session.autenticado = autenticado;
          var campos = {
            autenticado: result[0].nome, nome: result[0].nome, id: result[0].id, email: result[0].email,
            img_usuario: result[0].img_usuario,
            usuario: result[0].usuario, id_tipo_usuario: result[0].id_tipo_usuario, senha: ""
          }
          res.render("pages/home", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "", tipo: "success" }, autenticado: campos });
        }
      }
    } catch (e) {
      console.log(e)
      res.render("pages/update", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, autenticado: req.body })
    }

  });

  

module.exports = router;