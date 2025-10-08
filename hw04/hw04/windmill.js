let rotationAngle = 0;
let rotationAngle1 = 0;
let currentTransformType = null;
let isAnimating = false;
let lastTime = 0;
let elapsedTime=0;
let M1=mat4.create();
let M2=mat4.create();
let M3=mat4.create();



const canvas=document.getElementById("glCanvas");
const gl=canvas.getContext("webgl2");

canvas.width=700;
canvas.height=700;

gl.viewport(0,0,canvas.width,canvas.height);

gl.clearColor(0.1,0.3,0.5,1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const vs=`#version 300 es
layout(location = 0) in vec2 a_Pos;
uniform mat4 u_transform;
void main() {
    gl_Position = u_transform *vec4(a_Pos, 0.0, 1.0);
}`;

const fs=`#version 300 es
precision mediump float;
out vec4 FragColor;
uniform vec3 uColor;
void main() {
    FragColor = vec4(uColor,1.0);
}`;

const vertexshader=gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexshader,vs);
gl.compileShader(vertexshader);

const fragmentshader=gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentshader,fs);
gl.compileShader(fragmentshader);

const program=gl.createProgram();

gl.attachShader(program,vertexshader);
gl.attachShader(program,fragmentshader);

gl.linkProgram(program);

const vao=gl.createVertexArray();
gl.bindVertexArray(vao);

const vertices=new Float32Array([
    -0.1,-1.0,
    -0.1,0.1,
    0.1,0.1,
    0.1,-1.0
]);

const vertices2=new Float32Array([
    -0.5,-0.1,
    -0.5,0.1,
    0.5,0.1,
    0.5,-0.1
]);

const vertices3=new Float32Array([
    -0.6,-0.05,
    -0.6,0.05,
    -0.4,0.05,
    -0.4,-0.05
]);

const vertices4=new Float32Array([
    0.6,-0.05,
    0.6,0.05,
    0.4,0.05,
    0.4,-0.05
]);

gl.useProgram(program);
const uColorLoc = gl.getUniformLocation(program, 'uColor');

const u_transform = mat4.create();
const uTransformLoc = gl.getUniformLocation(program, 'u_transform');
gl.uniformMatrix4fv(uTransformLoc, false, u_transform);

const vbo=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const vbo1=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo1);
    gl.bufferData(gl.ARRAY_BUFFER, vertices2, gl.STATIC_DRAW);

const vbo2=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo2);
    gl.bufferData(gl.ARRAY_BUFFER, vertices3, gl.STATIC_DRAW);


const vbo3=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,vbo3);
gl.bufferData(gl.ARRAY_BUFFER, vertices4, gl.STATIC_DRAW);

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    const I = mat4.create(); // identity
    gl.uniformMatrix4fv(uTransformLoc, false, I);
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(0);
    gl.uniform3f(uColorLoc,1.0,0.5,0.2);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


    mat4.identity(M1);
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo1);
    gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(0);
    gl.uniform3f(uColorLoc,0.0,0.5,0.0);
    mat4.rotate(M1, M1, rotationAngle, [0, 0, 1]);
    gl.uniformMatrix4fv(uTransformLoc, false, M1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


    mat4.identity(M2);
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo2);
    gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(0);
    gl.uniform3f(uColorLoc,1.0,1.0,1.0);
    
    
    
    mat4.rotate(M2, M2, rotationAngle, [0, 0, 1]);
    mat4.translate(M2, M2, [-0.5, 0, 0]);
    mat4.rotate(M2, M2, rotationAngle1, [0, 0, 1]);
    mat4.translate(M2, M2, [0.5, 0, 0]);

    gl.uniformMatrix4fv(uTransformLoc, false, M2);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


    mat4.identity(M3);
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo3);
    gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(0);
    gl.uniform3f(uColorLoc,1.0,1.0,1.0);
    
    mat4.rotate(M3, M3, rotationAngle, [0, 0, 1]);
    mat4.translate(M3, M3, [0.5, 0, 0]);
    mat4.rotate(M3, M3, rotationAngle1, [0, 0, 1]);
    mat4.translate(M3, M3, [-0.5, 0, 0]);
    //행렬 곱하는 순서 주의....

    gl.uniformMatrix4fv(uTransformLoc, false, M3);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}



function animate(currentTime) {

    if (!lastTime) lastTime = currentTime;
    const deltaTime = (currentTime - lastTime) / 1000; // seconds
    lastTime = currentTime;
    elapsedTime += deltaTime;

    rotationAngle  = Math.sin(elapsedTime) * Math.PI * 2.0;
    rotationAngle1 = Math.sin(elapsedTime) * Math.PI * -10.0
    
    render();

    requestAnimationFrame(animate);
} requestAnimationFrame(animate);




