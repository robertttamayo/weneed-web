var dbName = "WeNeedDatabase";
var dbVersion = 1;

var cacheName = 'weneedcache';

self.addEventListener('install', function(event) {
    // self.skipWaiting();
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(
                [
                    'https://use.fontawesome.com/releases/v5.7.1/css/all.css',
                    '/assets/css/main.css',
                    'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
                    '/assets/js/bundle.js',
                    '/index.php',
                ]
            );
        })
    );
    console.log('Install Complete', event);
});

self.addEventListener('activate', function(event) {
    console.log('Activation Successful', event);
});

self.addEventListener('push', function(event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    } else {
        console.log("here in the receiver");
    }
    const sendNotification = body => {
        // you could refresh a notification badge here with postMessage API
        const title = "Web Push example";

        return self.registration.showNotification(title, {
            body,
        });
    };
    console.log(event);
    if (event.data) {
        const message = event.data.text();
        event.waitUntil(sendNotification(message));
    }
});

self.addEventListener('sync', function(sync_event) {

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
        
        var userObjectStore = db.transaction("users", "readonly").objectStore("users");

        userObjectStore.getAll().onsuccess = function(event) {
            let users = event.target.result;
            let user_data = users[0];
            let user_account_id = user_data.user_account_id;

            var endpoint = "https://www.roberttamayo.com/shoplist/index.php";
            
            postData(endpoint, {
                account_id: user_account_id,
                action: 'get_items',
            })
            .then((data) => {
                console.log(data);
                // the server_items are the data
                let item_data = {items: data};
                processItems(db, item_data);
            });
        }
    };
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request);
      })
    );
  });

function postData(url = '', data = {}) {
    var form_data = new FormData();
    for ( var key in data ) {
        form_data.append(key, data[key]);
    }

    return fetch(url, {
        method: 'POST', 
        mode: 'cors', 
        body: form_data, 
    })
    .then((response) => {
        return response.json();
    }); 
}

function processItems(db, data) {
    var itemObjectStore = db.transaction("items", "readwrite").objectStore("items");
    var stored_items = itemObjectStore.getAll().onsuccess = function(event) {
        let new_items = []; // items found on server but not in local db
        let purchased_items = []; // items we had on local db but don't exist on server
        let server_item_ids = []; // item ids from server
        let db_item_ids = []; // item ids from local db

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
                itemObjectStore.delete(purchased_items[i].item_id);
            }
        }
        if (message == '') {
            console.log('Local items and server items are the same');
        } else {
            console.log(message);
            self.registration.showNotification(message);
        }
    };
}

console.log(self);
// if (!"Notification" in window) {
//     console.log("This browser does not support notifications.");
// } else {
//     console.log("notification supported");
//     Notification.requestPermission().then(function(result) {
//         console.log(result);
//         window.setTimeout(()=>{
//             var notification = new Notification("Hi there!");
//         }, 5000);
//     });
// }