<?php
class Game {

    private $conn;
    private $tableName = "game";

    public $id;
    public $firstTeam;
    public $secondTeam;
    public $firstTeamGoals;
    public $secondTeamGoals;
    public $gameState;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function list(){
        $query = "SELECT * FROM " . $this->tableName;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function get() {        
        $query = "SELECT * FROM " . $this->tableName . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare( $query );
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->firstTeam = $row['firstTeam'];
        $this->secondTeam = $row['secondTeam'];
        $this->firstTeamGoals = $row['firstTeamGoals'];
        $this->secondTeamGoals = $row['secondTeamGoals'];
        $this->gameState = $row['gameState'];
    }

    public function create(){
        $query = "INSERT INTO " . $this->tableName . " SET firstTeam=:firstTeam, secondTeam=:secondTeam, firstTeamGoals=:firstTeamGoals, secondTeamGoals=:secondTeamGoals, gameState=:gameState";
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->firstTeam=htmlspecialchars(strip_tags($this->firstTeam));
        $this->secondTeam=htmlspecialchars(strip_tags($this->secondTeam));
        $this->firstTeamGoals=htmlspecialchars(strip_tags($this->firstTeamGoals));
        $this->secondTeamGoals=htmlspecialchars(strip_tags($this->secondTeamGoals));
        $this->gameState=htmlspecialchars(strip_tags($this->gameState));
     
        // bind values
        $stmt->bindParam(":firstTeam", $this->firstTeam);
        $stmt->bindParam(":secondTeam", $this->secondTeam);
        $stmt->bindParam(":firstTeamGoals", $this->firstTeamGoals);
        $stmt->bindParam(":secondTeamGoals", $this->secondTeamGoals);
        $stmt->bindParam(":gameState", $this->gameState);
     
        if($stmt->execute()){
            return true;
        }     
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->tableName . " SET firstTeam=:firstTeam, secondTeam=:secondTeam, firstTeamGoals=:firstTeamGoals, secondTeamGoals=:secondTeamGoals, gameState=:gameState WHERE id=:id";
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->firstTeam=htmlspecialchars(strip_tags($this->firstTeam));
        $this->secondTeam=htmlspecialchars(strip_tags($this->secondTeam));
        $this->firstTeamGoals=htmlspecialchars(strip_tags($this->firstTeamGoals));
        $this->secondTeamGoals=htmlspecialchars(strip_tags($this->secondTeamGoals));
        $this->gameState=$this->gameState;
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind new values
        $stmt->bindParam(':firstTeam', $this->firstTeam);
        $stmt->bindParam(':secondTeam', $this->secondTeam);
        $stmt->bindParam(':firstTeamGoals', $this->firstTeamGoals);
        $stmt->bindParam(':secondTeamGoals', $this->secondTeamGoals);
        $stmt->bindParam(':gameState', $this->gameState);
        $stmt->bindParam(':id', $this->id);

        // execute the query
        if($stmt->execute()){
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->tableName . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        $this->id=htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);
        
        if($stmt->execute()){
            return true;
        }
        return false;
    }

}

?>