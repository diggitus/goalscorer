create database goalscorer_db;

create table game (
    id int(6) unsigned auto_increment primary key,
    firstTeam int(6) unsigned not null,
    secondTeam int(6) unsigned not null,
    firstTeamGoals int(6) unsigned not null,
    secondTeamGoals int(6) unsigned not null,
    gameState text
)