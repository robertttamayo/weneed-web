main();

//
// Start here
//
function main() {
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying lowp vec4 vColor;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;
    void main() {
        gl_FragColor = vColor;
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);


  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  
  let positionBuffer = gl.createBuffer();
  let colorBuffer = gl.createBuffer();
  const buffers = {
      position: positionBuffer,
      color: colorBuffer,
      positions: [],
      colors: [],
  }
    var tcc = new TriColorChanger(new Color(0, 1, 1, 1), new Color(0, .5, 1, 1), new Color(0, 0, 1, 1));
    // console.log(tcc);
    var count = 12;
    var ox = 400;
    var oy = 500;
    var width = 24;
    var height = 300/count;
    var topLeft = [], topRight = [], bottomLeft = [], bottomRight = [];
    var stateTime = 0;
    init();
    update(0);
    render();

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
    var then = 0;
    function update(time){
        // console.log(delta);
        time *= 0.002;
        stateTime = time;
        var delta = stateTime - then;
        then = stateTime;

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
        updateColors(delta);
        render();
        requestAnimationFrame(update);
    }
    function updateColors(delta) {
        if (!isNaN(delta)) {
            tcc.update(delta*2);
        }
    }
    function renderTriangle(current, next, adjacentNext, isEven, isRight) {
        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix,
                            fieldOfView,
                            aspect,
                            zNear,
                            zFar);
        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix,     // destination matrix
                        modelViewMatrix,     // matrix to translate
                        [-0.0, 0.0, -4.0]); 
        if (isEven) {
            if (isRight) {
                var colors = [
                    tcc.c2.r, tcc.c2.g, tcc.c2.b, 1, 
                    tcc.c1.r, tcc.c1.g, tcc.c1.b, 1,
                    tcc.c1.r, tcc.c1.g, tcc.c1.b, 1,
                ];
            } else {
                var colors = [
                    tcc.c1.r, tcc.c1.g, tcc.c1.b, 1,
                    tcc.c2.r, tcc.c2.g, tcc.c2.b, 1,
                    tcc.c1.r, tcc.c1.g, tcc.c1.b, 1,
                    // 0.0,  0.0,  1.0,  1.0,    // 1
                    // 0.0,  1.0,  1.0,  1.0,    // 2
                    // 0.0,  0.0,  1.0,  1.0,    // 1
                ];
            }
        } else {
            if (isRight) {
                var colors = [
                    tcc.c1.r, tcc.c1.g, tcc.c1.b, 1,
                    tcc.c2.r, tcc.c2.g, tcc.c2.b, 1,
                    tcc.c2.r, tcc.c2.g, tcc.c2.b, 1,
                    // 0.0,  0.0,  1.0,  1.0,    // 1
                    // 0.0,  1.0,  1.0,  1.0,    // 2
                    // 0.0,  1.0,  1.0,  1.0,    // 2
                ];
            } else {
                var colors = [
                    tcc.c2.r, tcc.c2.g, tcc.c2.b, 1,
                    tcc.c1.r, tcc.c1.g, tcc.c1.b, 1,
                    tcc.c2.r, tcc.c2.g, tcc.c2.b, 1,
                    // 0.0,  1.0,  1.0,  1.0,    // 2
                    // 0.0,  0.0,  1.0,  1.0,    // 1
                    // 0.0,  1.0,  1.0,  1.0,    // 2
                ];
            }
        }
        // renderTriangle(current.x, current.y, next.x, next.y, adjacentNext.x, adjacentNext.y,
        //     tcc.c1, tcc.c2, tcc.c1);
        var positions = [
            current.x/gl.canvas.clientWidth - .5, current.y/gl.canvas.clientHeight - .5, 
            next.x/gl.canvas.clientWidth - .5, next.y/gl.canvas.clientHeight - .5, 
            adjacentNext.x/gl.canvas.clientWidth - .5, adjacentNext.y/gl.canvas.clientHeight - .5
        ];
        var vbuffer = gl.createBuffer();
        buffers.positions.push(vbuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
        gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW);

        var cbuffer = gl.createBuffer();
        buffers.colors.push(cbuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        
        // vertex
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            let offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }
        // color
        {
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            let offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColor);
        }
        // draw
        gl.useProgram(programInfo.program);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);
        {
            const offset = 0;
            const vertexCount = 3;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }
    
    function render(){
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

         // amount to translate
        
        var current, next, adjacentNext, isEven, isRight;
        for (var i = 0; i < count - 1; i++) {
            // console.log(i);
            current = topLeft[i];
            next = topLeft[i + 1];
            adjacentNext = topRight[i + 1];
            isEven = (i % 2 == 0);
            isRight = false;
            renderTriangle(current, next, adjacentNext, isEven, isRight);

            current = topRight[i];
            next = topRight[i + 1];
            adjacentNext = topLeft[i];
            isEven = (i % 2 == 0);
            isRight = true;
            renderTriangle(current, next, adjacentNext, isEven, isRight);

            // bottom ones are !isEven and !isRight
            current = bottomRight[i];
            next = bottomRight[i + 1];
            adjacentNext = bottomLeft[i + 1];
            isEven = (i % 2 != 0);
            isRight = false;
            renderTriangle(current, next, adjacentNext, isEven, isRight);
            
            current = bottomLeft[i];
            next = bottomLeft[i + 1];
            adjacentNext = bottomRight[i];
            isEven = (i % 2 != 0);
            isRight = true;
            renderTriangle(current, next, adjacentNext, isEven, isRight);
        }
    }
    
    
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -6.0]);  // amount to translate

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
    {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        let offset = 0;
        buffers.positions.forEach((position) =>{
            gl.bindBuffer(gl.ARRAY_BUFFER, position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        });
    }
    // console.log(programInfo);

    // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    // gl.vertexAttribPointer(
    //     programInfo.attribLocations.vertexPosition,
    //     numComponents,
    //     type,
    //     normalize,
    //     stride,
    //     offset);
    // gl.enableVertexAttribArray(
    //     programInfo.attribLocations.vertexPosition);
  
    // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    let offset = 0;
    // console.log(buffers.colors);
    buffers.colors.forEach((color) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexColor);
        });
  }
  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);
  {
    const offset = 0;
    const vertexCount = 3;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
