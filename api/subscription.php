<?php

require_once('../config.php');

if (isset($_POST['subscription'])) {
    $post = html_entity_decode(filter_var($_POST['subscription'], FILTER_SANITIZE_STRING));
    $user_id = filter_var($_POST['user_id'], FILTER_VALIDATE_INT);

    // extract subscription data
    $subdata = json_decode($post, true);
    // echo "response: ";
    // echo json_encode($subdata);die;
    $endpoint = $subdata['endpoint'];
    $expirationTime = $subdata['expirationTime'];
    $keys = $subdata['keys'];
    $p256dh = $keys['p256dh'];
    $auth = $keys['auth'];

    $sql = "SELECT p256dh, auth FROM sub_base 
    WHERE user_id = $user_id
    AND p256dh = '$p256dh'
    AND auth = '$auth'
    AND endpoint = '$endpoint'";

    try {
        $conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USERNAME, DB_PASSWORD);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (sizeof($result) == 0) {
            // this is a new subscription
            $sql = "INSERT INTO sub_base 
            (user_id, is_active, p256dh, auth, endpoint)
            VALUES 
            ($user_id, 1, '$p256dh', '$auth', '$endpoint')";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $data = [
                'lastinsertid' => $last_id = $conn->lastInsertId()
            ];
            echo json_encode($data);
        }
   
        
    } catch (PDOException $e) {
        echo "DIDN'T WORK because Connection failed: " . $e->getMessage();
    }
    $conn = null;
    echo $data;

    // echo $post;
} else {
    echo "post sub is not set";
}

exit;

/*
     try {
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $data = json_encode($rows);
            $params = json_encode($param_values);
        } catch (Exception $e) {
            $data = [
                'lastinsertid' => $last_id = $conn->lastInsertId()
            ];
        }
*/