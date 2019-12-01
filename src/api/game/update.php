<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
include_once '../database.php';
include_once '../objects/game.php';
 
$database = new Database();
$db = $database->getConnection();
$gameEntity = new Game($db);

$data = json_decode(file_get_contents("php://input"));

$gameEntity->id = $data->id;
$gameEntity->firstTeam = $data->firstTeam;
$gameEntity->secondTeam = $data->secondTeam;
$gameEntity->firstTeamGoals = $data->firstTeamGoals;
$gameEntity->secondTeamGoals = $data->secondTeamGoals;
 
if($gameEntity->update()){
    http_response_code(200);
    echo json_encode(array("message" => "Game was updated."));
} else{
    http_response_code(503);
    echo json_encode(array("message" => "Unable to update game."));
}

?>
