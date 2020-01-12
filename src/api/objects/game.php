<?php
class Game {

    private $conn;
    private $tableName = "game";

    public $id;
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

        $this->gameState = $row['gameState'];
    }

    public function create(){
        $query = "INSERT INTO " . $this->tableName . " SET gameState=:gameState";
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->gameState=$this->gameState;
     
        // bind values
        $stmt->bindParam(":gameState", $this->gameState);
     
        if($stmt->execute()){
            return true;
        }     
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->tableName . " SET gameState=:gameState WHERE id=:id";
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->gameState=$this->gameState;
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind new values
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