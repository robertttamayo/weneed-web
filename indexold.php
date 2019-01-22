<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="/css/main.css">
    <!-- <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script> -->
    <script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
    <!-- <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script> -->
</head>
<body>
    <!-- <?php include 'embeds/header.html'; ?>

    <div id="login-modal"></div>
    <div id="shopping-list-container">
        <div class="loader">...</div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="/js/cookies.js"></script>
    <script src="/js/header.js"></script>
    <script src="/js/loginForm.js"></script>
    <script src="/js/shoppingList.js"></script>
    <script src="/js/main.js"></script> -->

    <canvas id="canvas"width="800" height="1200" style="border:1px solid #000000;"></canvas>

<script src="/gl/vertex.js"></script>
<script src="/gl/fragment.js"></script>
<script src="/gl/init.js"></script>
<script src="/gl/buffer.js"></script>
<script src="/gl/render.js"></script>
    <script>

    var canvas = document.getElementById('canvas');
    // ctx = canvas.getContext('2d');
    // Initialize the GL context
    var gl = canvas.getContext("webgl");

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    var triangles = [];
    var tcc = {
        c1: {r: 0, g: 0, b: 255},
        c2: {r: 0, g: 128, b: 255},
        c3: {r: 0, g: 255, b: 255}
    }

    // triangle(100, 100, 200, 200, 100, 200);
    function renderTriangle(ax, ay, bx, by, cx, cy, color1, color2, color3) {
        ctx.beginPath();
        // ctx.setFill
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.lineTo(cx, cy);
        ctx.closePath();
        ctx.fill();
    }
    var Triangle = function(ax, ay, bx, by, cx, cy) {
        this.ax = ax;
        this.ay = ay;
        this.bx = bx;
        this.by = by;
        this.cx = cx;
        this.cy = cy;
    }
    
    var count = 12;
    var ox = 400;
    var oy = 500;
    var width = 24;
    var height = 300/count;
    var topLeft = [], topRight = [], bottomLeft = [], bottomRight = [];
    var stateTime = 0;

    init();
    var loop = window.setInterval(main, 30); // ~ 30 fps
    function init() {
        for (var i = 0; i < count; i++) {
            var x = ox;
            var y = oy;
            topLeft.push({x: x, y: y});
            topRight.push({x: x, y: y});
            bottomLeft.push({x: x, y: y});
            bottomRight.push({x: x, y: y});
        }
    }
    function main(){
        var delta = 1/30;
        stateTime += delta;
        clear();
        update();
        render();
    }
    function update(){
        for (var i = 0; i < count; i++) {
            // top left
            x = ox - width - 4*i - 24 * Math.sin(stateTime - Math.PI/6*i);
            y = oy + height*i;
            topLeft[i].x = x;
            topLeft[i].y = y;

            // top right
            x = ox + width + 4*i - 24 * Math.sin(stateTime - Math.PI/6*i);
            y = oy + height*i;
            topRight[i].x = x;
            topRight[i].y = y;

            // bottom left
            x = ox - width - 4*i - 24 * Math.sin(stateTime + Math.PI/6*i);
            y = oy - height*i;
            bottomLeft[i].x = x;
            bottomLeft[i].y = y;

            // bottom right
            x = ox + width + 4*i - 24 * Math.sin(stateTime + Math.PI/6*i);
            y = oy - height*i;
            bottomRight[i].x = x;
            bottomRight[i].y = y;
        }
    }
    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    function renderTriangle(current, next, adjacentNext, isEven) {
        if (isEven) {
                // renderTriangle(current.x, current.y, next.x, next.y, adjacentNext.x, adjacentNext.y,
                //     tcc.c1, tcc.c2, tcc.c1);
                var positions = [
                    current.x/gl.canvas.clientWidth, current.y/gl.canvas.clientHeight, 
                    next.x/gl.canvas.clientWidth, next.y/gl.canvas.clientHeight, 
                    adjacentNext.x/gl.canvas.clientWidth, adjacentNext.y/gl.canvas.clientHeight
                ];
                gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW);
            } else {
                // renderTriangle(current.x, current.y, next.x, next.y, adjacentNext.x, adjacentNext.y,
                //     tcc.c2, tcc.c1, tcc.c2););
                var positions = [
                    current.x/gl.canvas.clientWidth, current.y/gl.canvas.clientHeight, 
                    next.x/gl.canvas.clientWidth, next.y/gl.canvas.clientHeight, 
                    adjacentNext.x/gl.canvas.clientWidth, adjacentNext.y/gl.canvas.clientHeight
                ];
                gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW);
            }
    }
    function render(){
        var current, next, adjacentNext, isEven;
        for (var i = 0; i < count - 1; i++) {
            current = topLeft[i];
            next = topLeft[i + 1];
            adjacentNext = topRight[i + 1];
            isEven = (i % 2 == 0);
            renderTriangle(curent, next, adjacentNext, isEven);

            current = topRight[i];
            next = topRight[i + 1];
            adjacentNext = topLeft[i];
            isEven = (i % 2 == 0);
            renderTriangle(curent, next, adjacentNext, isEven);

            current = bottomRight[i];
            next = bottomRight[i + 1];
            adjacentNext = bottomLeft[i + 1];
            isEven = (i % 2 == 0);
            renderTriangle(curent, next, adjacentNext, isEven);
            
            current = bottomLeft[i];
            next = bottomLeft[i + 1];
            adjacentNext = bottomRight[i];
            isEven = (i % 2 == 0);
            renderTriangle(curent, next, adjacentNext, isEven);
        }
    }
    function renderDebug(){
        for (i = 0; i < count - 1; i++) {
            ax = ox;
            ay = ar[i].y;
            bx = ar[i].x;
            ctx.beginPath();
            ctx.moveTo(ar[i].x, ar[i].y);
            ctx.lineTo(ar[i+1].x, ar[i+1].y);
            ctx.closePath();
            ctx.stroke();
        }
        for (i = 0; i < count - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(br[i].x, br[i].y);
            ctx.lineTo(br[i+1].x, br[i+1].y);
            ctx.closePath();
            ctx.stroke();
        }
        for (i = 0; i < count - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(cr[i].x, cr[i].y);
            ctx.lineTo(cr[i+1].x, cr[i+1].y);
            ctx.closePath();
            ctx.stroke();
        }
        for (i = 0; i < count - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(dr[i].x, dr[i].y);
            ctx.lineTo(dr[i+1].x, dr[i+1].y);
            ctx.closePath();
            ctx.stroke();
        }
    }
    </script>


</body>
</html>