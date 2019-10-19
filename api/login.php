<?php

if (!isset($_POST['username']) || !isset($_POST['password'])) {
    exit;
}

require_once("../config.php");

$username = '';
$password = '';

if (isset($_POST['username'])) {
    $username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
}
if (isset($_POST['password'])) {
    $password = filter_var($_POST['password'], FILTER_SANITIZE_STRING);
}

$sql = "SELECT * FROM userbase WHERE userbase.user_name = :username AND userbase.user_magicword = :magicword LIMIT 1";

try {
    $conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USERNAME, DB_PASSWORD);

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':magicword', $password);

    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $data = json_encode($rows);
    $working_data = $rows;
    
    $user_id = $rows[0]['user_id'];
    settype($user_id, "integer");
    
    $sql = "SELECT account_id FROM userbase, user_account_base WHERE user_account_base.user_id = $user_id";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $account_ids = [];
    foreach($rows as $row) {
        $id = $row['account_id'];
        if (!in_array($id, $account_ids)) {
            $account_ids[] = $row['account_id'];
        }
    }
    $working_data[0]['account_ids'] = $account_ids;
 
    
    $data = json_encode($working_data);
    header("HTTP/1.0 200 OK");
    echo $data;exit;
} catch (PDOException $e) {
	header("HTTP/1.0 500 Internal Server Error");
	echo "Error";
}