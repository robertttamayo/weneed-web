<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#42c07b">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
    <link rel="stylesheet" href="/assets/css/main.css">
    <link rel="manifest" href="/manifest.json">

    <link rel="icon" href="ic_laucher192.png">
    <link rel="apple-touch-icon" href="ic_laucher192.png">
</head>
<body>
    <?php include 'embeds/header.html'; ?>

    <div id="app"></div>

    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/6.3.0/firebase-app.js"></script>

    <!-- TODO: Add SDKs for Firebase products that you want to use
        https://firebase.google.com/docs/web/setup#config-web-app -->

    <script>
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyBVAm65FSYB-OzqVtgA5Wz572lSJhBZlyA",
        authDomain: "we-need.firebaseapp.com",
        databaseURL: "https://we-need.firebaseio.com",
        projectId: "we-need",
        storageBucket: "we-need.appspot.com",
        messagingSenderId: "353046147645",
        appId: "1:353046147645:web:17e065f44ef9412a"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    </script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

    <script src="/assets/js/bundle.js"></script>
    <script>

    var dbName = "WeNeedDatabase";
    var dbVersion = 1;

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceworker.js').then(function(registration){
            // console.log('successfully successed');
            var serviceWorker;
            if (registration.installing) {
                serviceWorker = registration.installing;
            } else if (registration.waiting) {
                serviceWorker = registration.waiting;
            } else if (registration.active) {
                serviceWorker = registration.active;
            }
            if (serviceWorker) {
                // console.log(serviceWorker.state);
                serviceWorker.addEventListener('statechange', function(e) {
                    console.log(e.target.state);
                });
            }
            var options = { tag : 'user_alerts' };
            registration.getNotifications(options).then((notifications)=>{
                console.log('notifications', notifications);
            });
            var subOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array("BPaFNyC6dn_WkvLyUw9-EsXTykbCrt1eMKgzmdNTiHpxa5KTQHPpdHXI8oAB7VpbiR5X6AkOpOzalfZNogJUcOo")
            }
            registration.pushManager.subscribe(subOptions).then(
                function(pushSubscription) {
                    var user_info = getCookie('weneed_user');
                    var user_id = '';
                    if (user_info != '') {
                        try {
                            var user_data = JSON.parse(user_info)[0];
                            user_id = user_data.user_id;
                            var subscription = JSON.stringify(pushSubscription);
                            $.ajax({
                                url: 'https://www.weneedapp.com/api/subscription.php',
                                method: 'POST',
                                data: {
                                    subscription: subscription,
                                    user_id: user_id
                                }
                            }).then((response)=>{
                                console.log(response);
                            });
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        console.log("user data is nothing");
                    }
                    
                    // The push subscription details needed by the application
                    // server are now available, and can be sent to it using,
                    // for example, an XMLHttpRequest.
                }, function(error) {
                    // During development it often helps to log errors to the
                    // console. In a production environment it might make sense to
                    // also report information about errors back to the
                    // application server.
                    console.log(error);
                }
            );
        }).catch(function(error) {
            // Something went wrong during registration. The serviceworker.js file
            // might be unavailable or contain a syntax error.
            console.log("Could not install", error);
        });
    }
    
    $(document).on('register_user_db', (event, data) => {
        console.log(data);
        var db;
        var request = indexedDB.open(dbName);
        request.onerror = function(event) {
            console.log("Why didn't you allow my web app to use IndexedDB?!");
        };
        request.onsuccess = function(event) {
            db = event.target.result;

            db.onerror = function(event) {
                // Generic error handler for all errors targeted at this database's
                // requests!
                console.error("Database error: " + event.target.errorCode);
            };
            let user_name = data.user_name;
            let user_id = data.user_id;
            let user_account_id = data.user_account_id;
            let user_data = {
                user_name,
                user_id,
                user_account_id,
            }
            var userObjectStore = db.transaction("users", "readwrite").objectStore("users");
            console.log(user_data);
            userObjectStore.add(user_data);

        };
    });
    $(document).on('update_items_db', async (event, data) => {
        console.log('updating items in db');
        /*
        itemData = [
            {item_id: 0, item_name: 'eggs', item_is_purchased: 0, item_added_by: 1},
            {item_id: 1, item_name: 'bananas', item_is_purchased: 0, item_added_by: 1},
        ]
        */
        var itemTransaction = db.transaction(["items"], "readwrite");

        var itemObjectStore = itemTransaction.objectStore("items");

        itemTransaction.onerror = function(event) {
            console.log('Transaction not opened due to error: ' + transaction.error);
        };

        let new_items = []; // items found on server but not in local db
        let purchased_items = []; // items we had on local db but don't exist on server
        let server_item_ids = []; // item ids from server
        let db_item_ids = []; // item ids from local db

        var stored_items = itemObjectStore.getAll().onsuccess = async function(event) {

            let server_items = data.items;
            let db_items = event.target.result;
            
            server_items.forEach((item)=>{
                server_item_ids.push(item.item_id);
            });

            db_items.forEach((item)=>{
                if (db_item_ids.indexOf(item.item_id) == -1) {
                    db_item_ids.push(item.item_id);
                }
            });
            
            server_items.forEach((item)=>{
                if (db_item_ids.indexOf(item.item_id) == -1) {
                    itemObjectStore.add(item);
                    new_items.push(item);
                }
            });

            db_items.forEach((item)=>{
                if (server_item_ids.indexOf(item.item_id) == -1) {
                    purchased_items.push(item);
                }
            });

            let message = '';
            if (new_items.length) {
                // we need to alert that there are new items
                message += 'New items added: ';
                for (let i = 0; i < new_items.length; i++) {
                    message += new_items[i].item_name;
                    if (i < new_items.length - 1) {
                        message += ', ';
                    }
                }
            }

            if (purchased_items.length) {
                // we need to alert that items have been purchased
                message += 'Items have been purchased: ';
                for (let i = 0; i < purchased_items.length; i++) {
                    message += purchased_items[i].item_name;
                    if (i < purchased_items.length - 1) {
                        message += ', ';
                    }
                    
                    await itemObjectStore.delete(purchased_items[i].db_item_id);
                }
            }
            console.log(message);
        };
        
    });

    //create indexeddb
    var db;
    var request = indexedDB.open(dbName, dbVersion);
        request.onerror = function(event) {
        console.log("Why didn't you allow my web app to use IndexedDB?!");
    };
    request.onsuccess = function(event) {
        db = event.target.result;

        db.onerror = function(event) {
            // Generic error handler for all errors targeted at this database's
            // requests!
            console.error("Database error: " + event.target.errorCode);
        };
    };

    // This event is only implemented in recent browsers   
    request.onupgradeneeded = function(event) { 

        // Save the IDBDatabase interface 
        var db = event.target.result;

        db.onerror = function(event) {
            // Generic error handler for all errors targeted at this database's
            // requests!
            console.error("Database error: " + event.target.errorCode);
        };

        // Create an objectStore for this database
        var objectStoreItems = db.createObjectStore("items", { 
            keyPath: "db_item_id",
            autoIncrement: true,
        });
        
        // create indices
        // objectStoreItems.createIndex("item_name", "item_name", { unique: false }); // item_id is unique
        objectStoreItems.createIndex("item_id", "item_id", { unique: true }); // item_id is unique
        

        objectStoreItems.transaction.oncomplete = function(event) {
            console.log('success, index db settled');
            // Store values in the newly created objectStore.
            // var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
            // customerData.forEach(function(customer) {
            //     customerObjectStore.add(customer);
            // });
        }
        
        // create user objectstore
        var objectStoreUsers = db.createObjectStore("users", { 
            keyPath: "db_user_id",
            autoIncrement: true,
        });
        objectStoreUsers.createIndex("user_name", "user_name", { unique: false });
        objectStoreUsers.createIndex("user_id", "user_id", { unique: true });

        objectStoreUsers.transaction.oncomplete = function(event) {
            console.log('success, user db settled');
        }
    };

    if (!"Notification" in window) {
        console.log("This browser does not support notifications.");
    } else {
        // console.log("notification supported");
        Notification.requestPermission().then(function(result) {
            console.log(result);
            // window.setTimeout(()=>{
            //     var notification = new Notification("Hi there!");
            // }, 5000);
        });
    }

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/')
        ;
        const rawData = window.atob(base64);
        return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
        }
        return "";   
    }
    </script>

</body>
</html>