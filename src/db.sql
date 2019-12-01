create database goalscorer_db;

create table game (
    id int(6) unsigned auto_increment primary key,
    team1 varchar(30) not null,
    team2 varchar(30) not null,
    goals1 int(6) not null,
    goals2 int(6) not null
)