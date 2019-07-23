<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#42c07b">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
    <link rel="stylesheet" href="/assets/css/main.css">

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
        navigator.serviceWorker.register('serviceworker.js', {scope: './'}).then(function(registration){
            console.log('successfully successed');
            var serviceWorker;
            if (registration.installing) {
                serviceWorker = registration.installing;
            } else if (registration.waiting) {
                serviceWorker = registration.waiting;
            } else if (registration.active) {
                serviceWorker = registration.active;
            }
            if (serviceWorker) {
                console.log(serviceWorker.state);
                serviceWorker.addEventListener('statechange', function(e) {
                    console.log(e.target.state);
                });
            }
            var options = { tag : 'user_alerts' };
            registration.getNotifications(options).then((notifications)=>{
                console.log(notifications);
            });
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
            let user_data = {
                user_name,
                user_id
            }
            var userObjectStore = db.transaction("users", "readwrite").objectStore("users");
            console.log(user_data);
            userObjectStore.add(user_data);

        };
    });
    $(document).on('update_items_db', (event, data) => {
        /*
            itemData = [
                {item_id: 0, item_name: 'eggs', item_is_purchased: 0, item_added_by: 1},
                {item_id: 1, item_name: 'bananas', item_is_purchased: 0, item_added_by: 1},
            ]
            */
        var customerObjectStore = db.transaction("items", "readwrite").objectStore("items");
        let items = data.items;

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
        objectStoreItems.createIndex("item_name", "item_name", { unique: false }); // item_id is unique
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


    </script>

</body>
</html>