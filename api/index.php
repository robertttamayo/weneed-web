<?php

require_once "../config.php";

use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

// require_once "../service/push.php";

class DB {
    public $item_table = "itembase";
    public $lists_table = "listbase";
    public $account_table = "accountbase";
    public $user_table = "userbase";

    public $item_date_added = "item_date_added";
    public $item_is_purchased = "item_is_purchased";
    public $item_id = "item_id";
    public $item_name = "item_name";
    public $item_account_id = "item_account_id";
    public $item_user_id = "item_user_id";
    public $item_list_id = "item_list_id";

    public $list_id = "list_id";
    public $list_name = "list_name";
    public $list_account_it = "list_account_id";

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

class ReportingDB extends DB {
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
                $data = $rows;
            } catch (Exception $e) {
                echo "ERROR occurred when reading from database: " . $e->getMessage();
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
    public $item_list_id = "";
}

if (isset($_POST["action"])) {
    $action = $_POST["action"];
}
if (isset($_POST["account_id"])) {
    $account = $_POST["account_id"];
    $account_id = $_POST["account_id"];
}
if (isset($_POST["user_id"])) {
    $user = $_POST["user_id"];
}
if (isset($_POST["list_id"])) {
    $list_id = $_POST["list_id"];
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
} else if ($action == "get_lists") {
    execute_get_account_lists($account_id);
} else if ($action == "modify_item") {
    $item_info = [];
    if (isset($_POST["item_id"])) {
        $item_id = $_POST["item_id"];
        settype($item_id, "integer");
        $item_info["item_id"] = $item_id;
    }
    if (isset($_POST["item_is_purchased"])) {
        $item_is_purchased = $_POST["item_is_purchased"];
        settype($item_is_purchased, "integer");
        $item_info["item_is_purchased"] = $item_is_purchased;
    }
    if (isset($_POST['item_purchased_by'])) {
        $item_purchased_by = $_POST["item_purchased_by"];
        settype($item_purchased_by, "integer");
        $item_info["item_purchased_by"] = $item_purchased_by;
    }
    echo json_encode($item_info);
    execute_modify_item($item_info);
} else if ($action == 'get_history') {
    execute_get_account_history($account_id);
} else if ($action == 'reporting') {
    if (isset($_POST['to_date']) && isset($_POST['from_date']) ) {
        $from_date = $_POST['from_date'];
        $to_date = $_POST['to_date'];
        execute_bundle_reporting_data($account_id, $from_date, $to_date);
    } else {
        echo "Error: no from date or to date set";
    }
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
    handle_push_add($item_data);
}
function execute_get_account_items($account_id) {
    $db = new DB;
    $sql = "SELECT * FROM $db->item_table, $db->account_table
    WHERE 
    $db->item_table.$db->item_account_id = $account_id
    AND $db->item_table.$db->item_is_purchased = 0
    AND $db->account_table.account_id = $account_id";

    $data = $db->execute($sql);
    echo $data;
}
function execute_get_account_lists($account_id) {
    $db = new DB;
    $sql = "SELECT * FROM $db->lists_table
    WHERE 
    $db->lists_table.list_account_id = $account_id";

    $data = $db->execute($sql);
    echo $data;
}
function execute_get_account_history($account_id) {
    $db = new DB;
    $sql = "SELECT item_name, item_is_purchased, item_date_added as item_date, \"green\" as item_status 
        from itembase 
        where item_is_purchased = 0
        and item_account_id = $account_id
    union
        select item_name, item_is_purchased, item_date_purchased as item_date, \"blue\" as item_status 
        from itembase 
        where item_is_purchased = 1
        and item_account_id = $account_id
    union
        select item_name, item_is_purchased, item_date_added as item_date, \"green\" as item_status 
        from itembase 
        where item_is_purchased = 1
        and item_account_id = $account_id
    order by item_date desc
    ";

    $data = $db->execute($sql);
    echo $data;
}
function execute_delete_item($item_info) {
    $db = new DB;

    $item_id = $item_info["item_id"];
    $sql = "DELETE FROM itembase WHERE $db->item_id = $item_id";

    $db->execute($sql);
    $data = $db->execute("SELECT * FROM $db->item_table WHERE $db->item_id = $item_id");

    echo $data;
    if ($item_info['item_is_purchased'] == 1) {
        handle_push_delete(json_decode($data, true)[0]);
    } else {
        echo "it is not 1";
    }
}
function execute_modify_item($item_info) {
    $db = new DB;

    $item_id = $item_info["item_id"];
    $updates = helper_get_update_string($item_info);

    $sql = "UPDATE $db->item_table SET ";
    if ($item_info['item_is_purchased'] == 1) {
        $sql .= " item_date_purchased = CURDATE(), ";
    }
    $sql .= " $updates WHERE $db->item_id = $item_id";
    $db->execute($sql);
    $data = $db->execute("SELECT * FROM $db->item_table WHERE $db->item_id = $item_id");

    echo $data;
    if ($item_info['item_is_purchased'] == 1) {
        handle_push_delete(json_decode($data, true)[0]);
    } else {
        echo "it is not 1";
    }
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

/**
 * REPORTING functions do not echo data, they bundle the data and send it in one chunk
 */
function execute_bundle_reporting_data($account_id, $from_date = '', $to_date = ''){
    try {
    $data = [];
    $data['distinct_item_count'] = reporting_execute_get_distinct_item_count($account_id, $from_date, $to_date);
    $items_dates = reporting_execute_get_items_dates($account_id, $from_date, $to_date);
    $data['user_transactions'] = reporting_execute_get_user_transaction_counts($account_id, $from_date, $to_date);
    $data['items_dates'] = reporting_collapse_item_dates($items_dates);
    if ($from_date != '') {
        $data['earliest_date'] = $from_date;
    } else {
        $data['earliest_date'] = reporting_execute_get_earliest_date($account_id)[0]['earliest_date'];
    }
    echo json_encode($data);
    } catch (Exception $e) {
        echo $e->getMessage();
    }
}
function reporting_execute_get_distinct_item_count($account_id, $from_date = '', $to_date = '') {
    $date_range_query = '';
    if ($to_date != '' && $from_date != '') {
        $date_range_query = " AND item_date_added BETWEEN '$from_date' AND '$to_date' ";
    }
    $db = new ReportingDB;
    $sql = "SELECT item_name, count(item_name) as item_count 
    from itembase 
    where item_account_id = $account_id $date_range_query
    group by item_name
    order by item_count desc
    ";
    $data = $db->execute($sql);
    return $data;
}
function reporting_execute_get_user_transaction_counts($account_id, $from_date = '', $to_date = '') {
    $date_range_query = '';
    if ($to_date != '' && $from_date != '') {
        $date_range_query = " AND i.item_date_added BETWEEN '$from_date' AND '$to_date' ";
    }
    $db = new ReportingDB;
    $sql = "SELECT  i.item_purchased_by as transaction_user_id, 
                    \"purchased\" as user_transaction, 
                    count(i.item_purchased_by) as user_transaction_count, 
                    (select u.user_name 
                        from userbase u 
                        where u.user_id = i.item_purchased_by) as user_name 
                    from itembase i 
                    where i.item_account_id = $account_id $date_range_query 
                    group by user_name
            union
                select i.item_user_id as transaction_user_id,  
                    \"added\" as user_transaction, 
                    count(i.item_user_id) as user_transaction_count, 
                    (select u.user_name 
                        from userbase u 
                        where u.user_id = i.item_user_id) as user_name 
                    from itembase i 
                    where i.item_account_id = $account_id $date_range_query 
            group by i.item_user_id
    ";
    $data = $db->execute($sql);
    return $data;
}
function reporting_execute_get_items_dates($account_id, $from_date = '', $to_date = '') {
    $date_range_query = '';
    if ($to_date != '' && $from_date != '') {
        $date_range_query = " AND item_date_added BETWEEN '$from_date' AND '$to_date' ";
    }
    $db = new ReportingDB;
    $sql = "SELECT i.item_name, i.item_date_added, i.item_date_purchased, i.item_user_id, 
    (select u.user_name from userbase u where u.user_id = i.item_user_id) as item_user_name
    FROM itembase i
    WHERE i.item_account_id = $account_id $date_range_query 
    ORDER BY i.item_name
    ";
    $data = $db->execute($sql);
    return $data;
}
function reporting_execute_get_earliest_date($account_id) {
    $db = new ReportingDB;
    $sql = "SELECT min(item_date_added) as earliest_date from itembase where item_account_id = $account_id";
    $data = $db->execute($sql);
    return $data;
}
function reporting_collapse_item_dates($items) {
    $data = [];
    $current_name = '';
    foreach($items as $item) {
        if (strtolower($item['item_name']) != $current_name) {
            $current_name = strtolower($item['item_name']);
            $data[$current_name] = [];
        }
        $data[$current_name][] = [
            'date_added' => $item['item_date_added'],
            'date_purchased' => $item['item_date_purchased'],
            'item_user_id' => $item['item_user_id'],
            'item_user_name' => $item['item_user_name'],
        ];
    }
    return $data;
}

function handle_push_add($item_data){
    // get all users in account_id except the current user_id
    $item_name = $item_data['item_name'];
    $account_id =  $item_data['item_account_id'];
    $user_id = $item_data['item_user_id'];

    $user_name = '';
    $user_name_sql = "SELECT u.user_name FROM userbase u WHERE u.user_id = $user_id";

    $sql = "SELECT user_id FROM userbase
    WHERE userbase.user_account_id = $account_id
    AND userbase.user_id != $user_id
    ";
    try {
        $conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USERNAME, DB_PASSWORD);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // get username of user who purchased item
        $stmt = $conn->prepare($user_name_sql);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach($rows as $row => $val) {
            $user_name = $val['user_name'];
        }

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $user_ids = [];
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $user_ids_csv = "";
        foreach($rows as $row => $val) {
            $user_ids[] = $val['user_id'];
        }
        $size = sizeof($user_ids);
        for($i = 0; $i < $size; $i++) {
            $user_ids_csv .= $user_ids[$i];
            if ($i != ($size - 1)) {
                $user_ids_csv .= ",";
            }
        }
        // next, get all notification data for all user_ids
        $sql = "SELECT * FROM sub_base WHERE sub_base.user_id IN ($user_ids_csv)";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $notifications = [];
        $pay_data = [
            "msg" => "We need $item_name. Added by $user_name",
            "status" => "add"
        ];
        $payload = json_encode($pay_data);
        foreach($rows as $key => $val) {
            $notifications[] = [
                'subscription' => Subscription::create([ // this is the structure for the working draft from october 2018 (https://www.w3.org/TR/2018/WD-push-api-20181026/) 
                    "endpoint" => $val['endpoint'],
                    "keys" => [
                        'p256dh' => $val['p256dh'],
                        'auth' => $val['auth']
                    ],
                ]),
                'payload' => $payload,
            ];
        }
        $auth = [
            'VAPID' => [
                'subject' => 'https://www.weneedapp.com/',
                'publicKey' => PUBLIC_KEY, // don't forget that your public key also lives in app.js
                'privateKey' => PRIVATE_KEY, // in the real world, this would be in a secret file
            ],
        ];
        $webPush = new WebPush($auth);
        // echo "created webpush";die;
        // send multiple notifications with payload
        foreach ($notifications as $notification) {
            $webPush->sendNotification(
                $notification['subscription'],
                $notification['payload'] // optional (defaults null)
            );
        }
        /**
         * Check sent results
         * 
         */
        foreach ($webPush->flush() as $report) {
            $endpoint = $report->getRequest()->getUri()->__toString();

            if ($report->isSuccess()) {
                // echo "[v] Message sent successfully for subscription {$endpoint}.";
            } else {
                // echo "[x] Message failed to sent for subscription {$endpoint}: {$report->getReason()}";
            }
        }

        /**
         * send one notification and flush directly
         */
        // $sent = $webPush->sendNotification(
        //     $notifications[0]['subscription'],
        //     $notifications[0]['payload'], // optional (defaults null)
        //     true // optional (defaults false)
        // );


    } catch (PDOException $e) {
        echo "DIDN'T WORK because Connection failed: " . $e->getMessage();
    }
    $conn = null;
    // return $data;
}

function handle_push_delete($item_data){
    // get all users in account_id except the current user_id
    $item_name = $item_data['item_name'];
    $account_id =  $item_data['item_account_id'];
    $user_id = $item_data['item_purchased_by'];
    $user_name = '';
    $user_name_sql = "SELECT u.user_name FROM userbase u WHERE u.user_id = $user_id";

    $sql = "SELECT user_id FROM userbase
    WHERE userbase.user_account_id = $account_id
    AND userbase.user_id != $user_id
    ";
    try {
        $conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USERNAME, DB_PASSWORD);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // get username of user who purchased item
        $stmt = $conn->prepare($user_name_sql);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach($rows as $row => $val) {
            $user_name = $val['user_name'];
        }

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $user_ids = [];
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $user_ids_csv = "";
        foreach($rows as $row => $val) {
            $user_ids[] = $val['user_id'];
        }
        $size = sizeof($user_ids);
        for($i = 0; $i < $size; $i++) {
            $user_ids_csv .= $user_ids[$i];
            if ($i != ($size - 1)) {
                $user_ids_csv .= ",";
            }
        }
        // next, get all notification data for all user_ids
        $sql = "SELECT s.*, u.user_name 
        FROM sub_base s, userbase u 
        WHERE s.user_id IN ($user_ids_csv) 
        AND s.user_id = u.user_id";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $notifications = [];
        $pay_data = [
            "msg" => "$user_name just purchased $item_name",
            "status" => "delete"
        ];
        $payload = json_encode($pay_data);
        foreach($rows as $key => $val) {
            $notifications[] = [
                'subscription' => Subscription::create([ // this is the structure for the working draft from october 2018 (https://www.w3.org/TR/2018/WD-push-api-20181026/) 
                    "endpoint" => $val['endpoint'],
                    "keys" => [
                        'p256dh' => $val['p256dh'],
                        'auth' => $val['auth']
                    ],
                ]),
                'payload' => $payload
            ];
        }
        $auth = [
            'VAPID' => [
                'subject' => 'https://www.weneedapp.com/',
                'publicKey' => PUBLIC_KEY, // don't forget that your public key also lives in app.js
                'privateKey' => PRIVATE_KEY, // in the real world, this would be in a secret file
            ],
        ];
        $webPush = new WebPush($auth);
        // echo "created webpush";die;
        // send multiple notifications with payload
        foreach ($notifications as $notification) {
            $webPush->sendNotification(
                $notification['subscription'],
                $notification['payload'] // optional (defaults null)
            );
        }
        /**
         * Check sent results
         * 
         */
        foreach ($webPush->flush() as $report) {
            $endpoint = $report->getRequest()->getUri()->__toString();

            if ($report->isSuccess()) {
                // echo "[v] Message sent successfully for subscription {$endpoint}.";
            } else {
                // echo "[x] Message failed to sent for subscription {$endpoint}: {$report->getReason()}";
            }
        }

        /**
         * send one notification and flush directly
         */
        // $sent = $webPush->sendNotification(
        //     $notifications[0]['subscription'],
        //     $notifications[0]['payload'], // optional (defaults null)
        //     true // optional (defaults false)
        // );


    } catch (PDOException $e) {
        echo "DIDN'T WORK because Connection failed: " . $e->getMessage();
    }
    $conn = null;
    // return $data;
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
