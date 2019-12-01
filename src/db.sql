create database goalscorer_db;

create table game (
    id int(6) unsigned auto_increment primary key,
    firstTeam int(6) not null,
    secondTeam int(6) not null,
    firstTeamGoals int(6) not null,
    secondTeamGoals int(6) not null
)