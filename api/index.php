<?php

require_once "../config.php";

class DB {
    public $item_table = "itembase";
    public $account_table = "accountbase";
    public $user_table = "userbase";

    public $item_date_added = "item_date_added";
    public $item_is_purchased = "item_is_purchased";
    public $item_id = "item_id";
    public $item_name = "item_name";
    public $item_account_id = "item_account_id";
    public $item_user_id = "item_user_id";

    public $account_id = "account_id";
    public $account_name = "account_name";

    public $user_id = "user_id";
    public $user_name = "user_name";
    public $user_account_id = "user_account_id";
    public $user_firebase_token = "user_firebase_token";

    function execute($sql, $param_values = []) {
        try {
            $conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USERNAME, DB_PASSWORD);
            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $stmt = $conn->prepare($sql);
            $size = sizeof($param_values);
            for ($i = 0; $i < $size; $i++) {
                $key = $param_values[$i]['key'];
                $value = $param_values[$i]['value'];
                $stmt->bindParam($param_values[$i]['key'], $param_values[$i]['value']);
            }
            $stmt->execute();
            try {
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $data = json_encode($rows);
                $params = json_encode($param_values);
            } catch (Exception $e) {
                $data = [
                	'lastinsertid' => $last_id = $conn->lastInsertId()
                ];
            }
            
        } catch (PDOException $e) {
            echo "DIDN'T WORK because Connection failed: " . $e->getMessage();
        }
        $conn = null;
        return $data;
    }
}

class Item {
    public $item_name = "";
    public $item_date_added = "";
    public $item_is_purchased = false;
    public $item_account_id = "";
    public $item_user_id = "";
}

if (isset($_POST["action"])) {
    $action = $_POST["action"];
}
if (isset($_POST["account_id"])) {
    $account = $_POST["account_id"];
}
if (isset($_POST["user_id"])) {
    $user = $_POST["user_id"];
}
if ($action == "update_user_firebase_token") {
    if (isset($_POST["user_firebase_token"])) {
        $user_firebase_token = $_POST["user_firebase_token"];
    }
    execute_update_user_firebase_token($user, $user_firebase_token);
} else if ($action == "new_item") {
    if (isset($_POST["item_name"])) {
        $item_name = $_POST["item_name"];
    }

    $item = new Item;
    $item->item_name = $item_name;
    $item->item_is_purchased = false;
    $item->item_user_id = $user;
    $item->item_account_id = $account;

    execute_create_new_item($item);

} else if ($action == "get_items") {
    execute_get_account_items($account_id);
} else if ($action == "modify_item") {
    $item_info = [];
    if (isset($_POST["item_id"])) {
        $item_id = $_POST["item_id"];
        settype($item_id, "integer");
        $item_info["item_id"] = $item_id;
    }
    if (isset($_POST["item_is_purchased"])) {
        $item_info["item_is_purchased"] = settype($_POST["item_is_purchased"], "integer");
    }
    execute_modify_item($item_info);
}
function execute_update_user_firebase_token($user, $token) {
    $db = new DB;
    $sql = "UPDATE userbase SET $db->user_firebase_token = '$token' WHERE $db->user_id = $user";
    $data = $db->execute($sql);
    $sql = "SELECT user_account_id FROM userbase WHERE userbase.user_id = $user";
    $data = $db->execute($sql);
    $data = json_decode($data, true);
    $account_id = $data[0]['user_account_id'];
    $sql = "SELECT * FROM userbase WHERE userbase.user_account_id = $account_id";
    $data = $db->execute($sql);
    echo $data;
    exit;
}
function execute_create_new_item($item) {
    $db = new DB;
    $sql = "INSERT INTO $db->item_table ($db->item_name, $db->item_user_id, $db->item_account_id, $db->item_date_added, $db->item_is_purchased)
    VALUES ('$item->item_name', $item->item_user_id, $item->item_account_id, CURDATE(), FALSE)";

    $item_data = $db->execute($sql);
    if (isset($item_data['lastinsertid'])) {
        $item_data[$db->item_id] = $item_data['lastinsertid'];
        $item_data[$db->item_name] = $item->item_name;
        $item_data[$db->item_user_id] = $item->item_user_id;
        $item_data[$db->item_account_id] = $item->item_account_id;
        $item_data[$db->item_date_added] = strtotime("now");
        $data = json_encode($item_data);
    } else {
        $data = $item_data;
    }
    echo $data;
}
function execute_get_account_items($account_id) {
    $db = new DB;
    $sql = "SELECT * FROM $db->item_table, $db->account_table
    WHERE 
    $db->item_table.$db->item_account_id = $db->account_table.$db->account_id
    AND $db->item_table.$db->item_is_purchased = 0";

    $data = $db->execute($sql);
    echo $data;
}
function execute_modify_item($item_info) {
    $db = new DB;

    $item_id = $item_info["item_id"];
    $updates = helper_get_update_string($item_info);
    $sql = "UPDATE $db->item_table SET $updates WHERE $db->item_id = $item_id";

    $db->execute($sql);
    $data = $db->execute("SELECT * FROM $db->item_table WHERE $db->item_id = $item_id");

    echo $data;
}
function helper_get_update_string($item_info) {
    $updates = "";
    $first = true;
    foreach($item_info as $key => $value) {
        if ($key == "item_id") {
            continue;
        }
        if (!$first) {
            $updates .= ", ";
        }
        $updates .= $key . " = " . $value . " ";
        $first = false;
    }
    return $updates;
}

exit;

/*
[
    'subscription' => Subscription::create([ // this is the structure for the working draft from october 2018 (https://www.w3.org/TR/2018/WD-push-api-20181026/) 
        "endpoint" => "https://example.com/other/endpoint/of/another/vendor/abcdef...",
        "keys" => [
            'p256dh' => '(stringOf88Chars)',
            'auth' => '(stringOf24Chars)'
        ],
    ]),
    'payload' => '{msg:"Hello World!"}',
],
*/
