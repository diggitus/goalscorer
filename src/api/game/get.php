<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
include_once '../database.php';
include_once '../objects/game.php';
 
$database = new Database();
$db = $database->getConnection();
$gameEntity = new Game($db);
$gameEntity->id = isset($_GET['id']) ? $_GET['id'] : die();
$gameEntity->get();
 
if($gameEntity->firstTeam != null){
    $gameEntities = array(
        "id" =>  $gameEntity->id,
        "firstTeam" =>  $gameEntity->firstTeam,
        "secondTeam" =>  $gameEntity->secondTeam,
        "firstTeamGoals" =>  $gameEntity->firstTeamGoals,
        "secondTeamGoals" =>  $gameEntity->secondTeamGoals,
    );
    http_response_code(200);
    echo json_encode($gameEntities);
} else{
    http_response_code(404);
    echo json_encode(array("message" => "Game does not exist."));
}  

?>