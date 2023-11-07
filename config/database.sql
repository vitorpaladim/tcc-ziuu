CREATE DATABASE `ziuu`;
USE `ziuu`;

DROP TABLE IF EXISTS `usuarios`;
use `ziuu`;
CREATE TABLE usuarios (
  id varchar(200) primary key,
  nome varchar(255) NOT NULL,
  email varchar(60) NOT NULL,
  senha longtext NOT NULL,
  id_tipo_usuario int not null default '1'
);

CREATE TABLE divulgacao (
  id_divulgacao varchar(200) primary key,
  img_divulgacao varchar (255),
  usuario_divulgacao varchar(60) NOT NULL,
  titulo_divulgacao varchar(255) NOT NULL  
);

