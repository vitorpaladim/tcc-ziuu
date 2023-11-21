CREATE DATABASE `ziuu`;
USE `ziuu`;

CREATE TABLE usuarios (
  id int not null auto_increment primary key,
  nome varchar(255) NOT NULL,
  email varchar(60) NOT NULL,
  senha longtext NOT NULL,
  usuario varchar(55),
  img_usuario varchar(255) default '/img/fotodeperfil3.png',
  id_tipo_usuario int not null default '1'
);


CREATE TABLE divulgacao (
  id_divulgacao int not null auto_increment primary key, 
  img_divulgacao varchar(255),
  usuario_divulgacao varchar(60) NOT NULL,
  titulo_divulgacao varchar(255) NOT NULL,
  id_usuario int,
  foreign key (id_usuario) references usuarios(id)
);



CREATE TABLE comunidadeartes (
  id_comunidade int not null auto_increment primary key,
  id_usuario int,
  usuario varchar(55),
  mensagem varchar(1000),
  img_divulgacao varchar (255)
);


create table `tipo_usuario` (
	id_tipo_usuario int not null auto_increment,
	tipo_usuario varchar (25) default null,
    inscricao_usuario varchar (155) default null,
    status_tipo_usuario int default '1',
    primary key (`id_tipo_usuario`)
    
);	



