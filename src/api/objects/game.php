<?php
class Game {

    private $conn;
    private $tableName = "game";

    public $id;
    public $team1;
    public $team2;
    public $goals1;
    public $goals2;

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

        $this->team1 = $row['team1'];
        $this->team2 = $row['team2'];
        $this->goals1 = $row['goals1'];
        $this->goals2 = $row['goals2'];
    }

    public function create(){
        $query = "INSERT INTO " . $this->tableName . " SET team1=:team1, team2=:team2, goals1=:goals1, goals2=:goals2";
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->team1=htmlspecialchars(strip_tags($this->team1));
        $this->team2=htmlspecialchars(strip_tags($this->team2));
        $this->goals1=htmlspecialchars(strip_tags($this->goals1));
        $this->goals2=htmlspecialchars(strip_tags($this->goals2));
     
        // bind values
        $stmt->bindParam(":team1", $this->team1);
        $stmt->bindParam(":team2", $this->team2);
        $stmt->bindParam(":goals1", $this->goals1);
        $stmt->bindParam(":goals2", $this->goals2);
     
        if($stmt->execute()){
            return true;
        }     
        return false;
    }

}

?>