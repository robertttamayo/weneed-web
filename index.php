<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#42c07b">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
    <link rel="stylesheet" href="/assets/css/main.css">
    <!-- <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script> -->
    <script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
    
    <!-- <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script> -->
</head>
<body>
    <?php include 'embeds/header.html'; ?>

    <div id="app"></div>

    <script src="https://www.gstatic.com/firebasejs/5.8.3/firebase.js"></script>
    <script>
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBVAm65FSYB-OzqVtgA5Wz572lSJhBZlyA",
        authDomain: "we-need.firebaseapp.com",
        databaseURL: "https://we-need.firebaseio.com",
        projectId: "we-need",
        storageBucket: "we-need.appspot.com",
        messagingSenderId: "353046147645"
    };
    firebase.initializeApp(config);
    </script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

    <script src="/assets/js/bundle.js"></script>
</body>
</html>