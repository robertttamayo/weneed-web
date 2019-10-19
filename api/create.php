<?php

if (!isset($_POST['username']) || !isset($_POST['password'])) {
    exit;
}

require_once("../config.php");

$username = '';
$password = '';
$nickname = ''; // optional

if (isset($_POST['username'])) {
    $username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
}
if (isset($_POST['password'])) {
    $password = filter_var($_POST['password'], FILTER_SANITIZE_STRING);
}
if (isset($_POST['nickname'])) {
    $nickname = filter_var($_POST['nickname'], FILTER_SANITIZE_STRING);
}

$account_name = $nickname == '' ? $username : $nickname;
$account_name .= "'s Shared List";

try {
    $conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USERNAME, DB_PASSWORD);

    $sql = "SELECT * FROM userbase WHERE userbase.user_name = :user_name";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":user_name", $username);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (sizeof($rows) > 0) {
        echo "Username " . $username . " is taken.";
        exit;
    }

    $sql = "INSERT INTO accountbase (account_name) VALUES (:account_name)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':account_name', $account_name);
    $stmt->execute();
    $account_id = $conn->lastInsertId();

    $sql = "INSERT INTO userbase (user_name, user_account_id, user_nickname, user_magicword) 
    VALUES (:user_name, $account_id, :user_nickname, :user_magicword)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':user_name', $username);
    $stmt->bindParam(':user_nickname', $nickname);
    $stmt->bindParam(':user_magicword', $password);
    $stmt->execute();
    $user_id = $conn->lastInsertId();

    $sql = "INSERT INTO user_account_base (user_id, account_id) 
    VALUES ($user_id, $account_id)";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    
    $sql = "SELECT * FROM userbase WHERE userbase.user_id = $user_id";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $working_data = [];
    $working_data[] = $rows[0];
    $working_data[0]['account_ids'] = [];
    $working_data[0]['account_ids'][] = $account_id;

    $data = json_encode($working_data);
    echo $data;exit;
} catch (PDOException $e) {
	echo "Error";
}