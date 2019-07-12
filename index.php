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
        }).catch(function(error) {
            // Something went wrong during registration. The service-worker.js file
            // might be unavailable or contain a syntax error.
            console.log("Could not install", error);
        });
    }
    </script>

</body>
</html>