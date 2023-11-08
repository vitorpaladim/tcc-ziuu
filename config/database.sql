CREATE DATABASE `ziuu`;
USE `ziuu`;


DROP TABLE IF EXISTS `usuarios`;
use `ziuu`;
CREATE TABLE usuarios (
  id int not null auto_increment,
  nome varchar(255) NOT NULL,
  email varchar(60) NOT NULL,
  senha longtext NOT NULL,
  id_tipo_usuario int not null default '1',
  primary key (`id`)
);



CREATE TABLE divulgacao (
  id_divulgacao int not null auto_increment,
  img_divulgacao varchar (255),
  usuario_divulgacao varchar(60) NOT NULL,
  titulo_divulgacao varchar(255) NOT NULL,
  primary key(`id_divulgacao`)
);

create table `tipo_usuario` (
	id_tipo_usuario int not null auto_increment,
	tipo_usuario varchar (25) default null,
    inscricao_usuario varchar (155) default null,
    status_tipo_usuario int default '1',
    primary key (`id_tipo_usuario`)
    
);	


