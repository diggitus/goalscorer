<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../database.php';
include_once '../objects/game.php';

$database = new Database();
$db = $database->getConnection();
$gameEntity = new Game($db);
$stmt = $gameEntity->list();
$num = $stmt->rowCount();
 
if($num > 0){
 
    $games["games"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
 
        $game=array(
            "id" => $id,
            "firstTeam" => $firstTeam,
            "secondTeam" => $secondTeam,
            "firstTeamGoals" => $firstTeamGoals,
            "secondTeamGoals" => $secondTeamGoals
        );
        array_push($games["games"], $game);
    }
    http_response_code(200);
    echo json_encode($games);
} else {
    http_response_code(404);
    echo json_encode(
        array("message" => "No games found.")
    );
}

?>