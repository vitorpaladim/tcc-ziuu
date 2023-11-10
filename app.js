const express = require("express");
const app = express();

app.use(express.static("app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

var session = require("express-session");

app.use(express.urlencoded({ extended: true }));

var session = require("express-session");
const port = process.env.PORT || '3000';

// Configura a sessão
app.use(session({
    secret: 'ziuutcc',
    resave: true,
    saveUninitialized: true
  }));

var rotas   = require("./app/routes/router");
app.use("/", rotas);

app.listen(port, () =>{
    console.log(`Site on na porta 3000`)
});

