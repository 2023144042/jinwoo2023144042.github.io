/*-------------------------------------------------------------------------
07_LineSegments.js

left mouse button을 click하면 선분을 그리기 시작하고, 
button up을 하지 않은 상태로 마우스를 움직이면 임시 선분을 그리고, 
button up을 하면 최종 선분을 저장하고 임시 선분을 삭제함.

임시 선분의 color는 회색이고, 최종 선분의 color는 빨간색임.

이 과정을 반복하여 여러 개의 선분 (line segment)을 그릴 수 있음. 
---------------------------------------------------------------------------*/
import { resizeAspectRatio, setupText, updateText, Axes } from '../util/util.js';
import { Shader, readShaderFile } from '../util/shader.js';
//Axes 꼭 알아둘것


// Global variables
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');
let isInitialized = false;  // main이 실행되는 순간 true로 change 
let shader;
let vao;
let positionBuffer; // 2D position을 위한 VBO (Vertex Buffer Object)
let circlesBuffer;
let intersectBuffer;
let isDrawing = false; // mouse button을 누르고 있는 동안 true로 change
let startPoint = null;  // mouse button을 누른 위치
let tempEndPoint = null; // mouse를 움직이는 동안의 위치
let lines = []; // 그려진 선분들을 저장하는 array
let circlescenter=[];
let textOverlay; // 1st line segment 정보 표시
let textOverlay2; // 2nd line segment 정보 표시
let textOverlay3; // 2nd line segment 정보 표시
let axes = new Axes(gl, 0.85); // x, y axes 그려주는 object (see util.js)
let circlesvertex=[];
let num = 0;
let r=0;
let t1;
let t2;
let A=0;
let B=0;
let C=0;
let D;

let a;
let b;
let c;
let d;
let e;
let f;

let num2;
let intersectvertex=[];

// DOMContentLoaded event
// 1) 모든 HTML 문서가 완전히 load되고 parsing된 후 발생
// 2) 모든 resource (images, css, js 등) 가 완전히 load된 후 발생
// 3) 모든 DOM 요소가 생성된 후 발생
// DOM: Document Object Model로 HTML의 tree 구조로 표현되는 object model 
// 모든 code를 이 listener 안에 넣는 것은 mouse click event를 원활하게 처리하기 위해서임
// mouse input을 사용할 때 이와 같이 main을 call 한다. 

document.addEventListener('DOMContentLoaded', () => {
    if (isInitialized) { // true인 경우는 main이 이미 실행되었다는 뜻이므로 다시 실행하지 않음
        console.log("Already initialized");
        return;
    }
    //중복 방지 코드

    main().then(success => { // call main function
        if (!success) {
            console.log('프로그램을 종료합니다.');
            return;
        }
        isInitialized = true;
    }).catch(error => {
        console.error('프로그램 실행 중 오류 발생:', error);
    });
});

function initWebGL() {
    if (!gl) {
        console.error('WebGL 2 is not supported by your browser.');
        return false;
    }

    canvas.width = 700;
    canvas.height = 700;

    resizeAspectRatio(gl, canvas);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.1, 0.2, 0.3, 1.0);

    return true;
}

function setupBuffers() {
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    positionBuffer = gl.createBuffer();
    circlesBuffer = gl.createBuffer();
    intersectBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, circlesBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, intersectBuffer);

    shader.setAttribPointer('a_position', 2, gl.FLOAT, false, 0, 0); // x, y 2D 좌표
    //2는 x,y 2d좌표라 2개만 쓸려고

    gl.bindVertexArray(null);
}

// 좌표 변환 함수: 캔버스 좌표를 WebGL 좌표로 변환
//canvas좌표계랑 webgl좌표계는 완전 다름
// 캔버스 좌표: 캔버스 좌측 상단이 (0, 0), 우측 하단이 (canvas.width, canvas.height)
// WebGL 좌표 (NDC): 캔버스 좌측 하단이 (-1, -1), 우측 상단이 (1, 1)
function convertToWebGLCoordinates(x, y) {
    return [
        (x / canvas.width) * 2 - 1,  // x/canvas.width 는 0 ~ 1 사이의 값, 이것을 * 2 - 1 하면 -1 ~ 1 사이의 값
        -((y / canvas.height) * 2 - 1) // y canvas 좌표는 상하를 뒤집어 주어야 하므로 -1을 곱함
    ];
}

/* 
    browser window
    +----------------------------------------+
    | toolbar, address bar, etc.             |
    +----------------------------------------+
    | browser viewport (컨텐츠 표시 영역)       | 
    | +------------------------------------+ |
    | |                                    | |
    | |    canvas                          | |
    | |    +----------------+              | |
    | |    |                |              | |
    | |    |      *         |              | |
    | |    |                |              | |
    | |    +----------------+              | |
    | |                                    | |
    | +------------------------------------+ |
    +----------------------------------------+

    *: mouse click position

    event.clientX = browser viewport 왼쪽 경계에서 마우스 클릭 위치까지의 거리
    event.clientY = browser viewport 상단 경계에서 마우스 클릭 위치까지의 거리
    rect.left = browser viewport 왼쪽 경계에서 canvas 왼쪽 경계까지의 거리
    rect.top = browser viewport 상단 경계에서 canvas 상단 경계까지의 거리

    x = event.clientX - rect.left  // canvas 내에서의 클릭 x 좌표
    y = event.clientY - rect.top   // canvas 내에서의 클릭 y 좌표
*/

function calculator(A,B,C){
    if(Math.abs(A)<0.00001 && D==0){
        if(Math.abs(B)<0.00001){
            num2=0;
        }

        else{
            t1=-C/B;
        }
    }

    else if(D==0){
        t1=-B/(2*A);
    }

    else{
        t1=(-B-Math.sqrt(D))/(2*A);
        t2=(-B+Math.sqrt(D))/(2*A);
    }
}

function between0and1(n){
    if(n<0 || n>1){
        return false;
    }

    else{
        return true;
    }
}

function intersectpoint(circlescenter,r,lines){
    a=lines[0][2]-lines[0][0];
    b=lines[0][0];
    c=lines[0][3]-lines[0][1];
    d=lines[0][1];
    e=circlescenter[0];
    f=circlescenter[1];

    A=a*a+c*c;
    B=2*(a*b-a*e+c*d-c*f);
    C=b*b+d*d+e*e+f*f-r*r-2*(b*e+d*f);

    D=B*B-4*A*C;

    if(D>0){
        calculator(A,B,C);
        if(between0and1(t1)&&between0and1(t2)){
            intersectvertex=[(a*t1+b).toFixed(2),(c*t1+d).toFixed(2),(a*t2+b).toFixed(2),(c*t2+d).toFixed(2)];

            return "Intersection Points: "+"2" +" Point 1: "+ "("+(a*t1+b).toFixed(2)+","+(c*t1+d).toFixed(2)+")"+" Point 2: "+"("+(a*t2+b).toFixed(2)+","+(c*t2+d).toFixed(2)+")";
        }

        else if(between0and1(t1)&&!between0and1(t2)){
            intersectvertex=[(a*t1+b).toFixed(2),(c*t1+d).toFixed(2)];

            return "Intersection Points: "+"1" +" Point 1: "+ "("+(a*t1+b).toFixed(2)+","+(c*t1+d).toFixed(2)+")";
        }

        else if(!between0and1(t1)&&between0and1(t2)){

            intersectvertex=[(a*t2+b).toFixed(2),(c*t2+d).toFixed(2)];

            return "Intersection Points: "+"1" +" Point 1: "+"("+(a*t2+b).toFixed(2)+","+(c*t2+d).toFixed(2)+")";
        }

        else{
            return "No intersection"
        }
        

    }

    else if(D=0){
        calculator(A,B,C);
        if(num2==0){
            return "No intersection";
        }

        else{

            intersectvertex=[(a*t1+b).toFixed(2),(c*t1+d).toFixed(2)];

            return "Intersection Points: "+"1" +" Point 1: "+"("+(a*t1+b).toFixed(2)+","+(c*t1+d).toFixed(2)+")";
        }

    }

    else{
        return "No intersection";
    }
}


function setupMouseEvents() {
    function handleMouseDown(event) {
        event.preventDefault(); // 이미 존재할 수 있는 기본 동작을 방지
        event.stopPropagation(); // event가 상위 요소 (div, body, html 등)으로 전파되지 않도록 방지

        const rect = canvas.getBoundingClientRect(); // canvas를 나타내는 rect 객체를 반환
        const x = event.clientX - rect.left;  // canvas 내 x 좌표
        const y = event.clientY - rect.top;   // canvas 내 y 좌표
        
        if (!isDrawing && lines.length < 1) { 
            // 1번 또는 2번 선분을 그리고 있는 도중이 아닌 경우 (즉, mouse down 상태가 아닌 경우)
            // 캔버스 좌표를 WebGL 좌표로 변환하여 선분의 시작점을 설정
            let [glX, glY] = convertToWebGLCoordinates(x, y);
            startPoint = [glX, glY];
            isDrawing = true; // 이제 mouse button을 놓을 때까지 계속 true로 둠. 즉, mouse down 상태가 됨
            if(num==0){
                circlescenter=startPoint;
            }
        }
    }

    function handleMouseMove(event) {
        if(isDrawing&&num==0){
            circlesvertex=[];
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            let [glX, glY] = convertToWebGLCoordinates(x, y);

            const deltax=glX-startPoint[0];
            const deltay=glY-startPoint[1];

            r=Math.sqrt(deltax*deltax+deltay*deltay);

            const n=1000;

            for (let i = 0; i < n; i++) {
                let theta = (2 * Math.PI * i) / n;
                let x = startPoint[0]+r * Math.cos(theta);
                let y = startPoint[1]+r * Math.sin(theta);
                circlesvertex.push(x, y);
            }

            

            render();
            
        }

        if (isDrawing&&num==1) { // 1번 또는 2번 선분을 그리고 있는 도중인 경우
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            let [glX, glY] = convertToWebGLCoordinates(x, y);
            tempEndPoint = [glX, glY]; // 임시 선분의 끝 point
            render();
        }
    }

    function handleMouseUp() {

        if(isDrawing && num==0){
            num++;
            isDrawing=false;

            updateText(textOverlay, "Circle: center (" + startPoint[0].toFixed(2) + ", " + startPoint[1].toFixed(2) + 
                    ") radius=" +r.toFixed(2) );
        }

        if (isDrawing && tempEndPoint&&num==1) {

            

            // lines.push([...startPoint, ...tempEndPoint])
            //   : startPoint와 tempEndPoint를 펼쳐서 하나의 array로 합친 후 lines에 추가
            // ex) lines = [] 이고 startPoint = [1, 2], tempEndPoint = [3, 4] 이면,
            //     lines = [[1, 2, 3, 4]] 이 됨
            // ex) lines = [[1, 2, 3, 4]] 이고 startPoint = [5, 6], tempEndPoint = [7, 8] 이면,
            //     lines = [[1, 2, 3, 4], [5, 6, 7, 8]] 이 됨

            lines.push([...startPoint, ...tempEndPoint]); 

            if (lines.length == 1) {
                updateText(textOverlay2, "line segment: (" + lines[0][0].toFixed(2) + ", " + lines[0][1].toFixed(2) + 
                    ") ~ (" + lines[0][2].toFixed(2) + ", " + lines[0][3].toFixed(2) + ")");
                
                updateText(textOverlay3, intersectpoint(circlescenter,r,lines));
            }
            

            isDrawing = false;
            startPoint = null;
            tempEndPoint = null;
            render();
        }
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    shader.use();
    shader.setFloat("uPointSize", 2.0);
    
    // 저장된 선들 그리기
    

    

        

        
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, circlesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(circlesvertex),gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        shader.setVec4("u_color", [1.0, 0.5, 0.2, 1.0]);
        gl.drawArrays(gl.POINTS,0,circlesvertex.length/2);

        

        for (let line of lines) {
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            
            
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line), gl.STATIC_DRAW);

            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

            shader.setVec4("u_color", [1.0, 0.0, 1.0, 1.0]);

            gl.drawArrays(gl.LINES, 0, 2);
            num++;
        }

        // 임시 선 그리기
        if (isDrawing && startPoint && tempEndPoint) {
            gl.bindVertexArray(vao);

            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            
            
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...startPoint, ...tempEndPoint]), 
                        gl.STATIC_DRAW);

            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

            shader.setVec4("u_color", [0.5, 0.5, 0.5, 1.0]); // 임시 선분의 color는 회색
            gl.drawArrays(gl.LINES, 0, 2);
        }

        if(intersectvertex.length>0){
            //intersectpoint 렌더링

            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(intersectvertex), gl.STATIC_DRAW);

            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

            shader.setVec4("u_color", [1.0, 1.0, 0.0, 1.0]);
            shader.setFloat("uPointSize", 10.0);

            gl.drawArrays(gl.POINTS, 0, intersectvertex.length/2);
        }

        

    

    
    // axes 그리기
    axes.draw(mat4.create(), mat4.create()); // 두 개의 identity matrix를 parameter로 전달
}

async function initShader() {
    const vertexShaderSource = await readShaderFile('shVert.glsl');
    const fragmentShaderSource = await readShaderFile('shFrag.glsl');
    shader = new Shader(gl, vertexShaderSource, fragmentShaderSource);
}

async function main() {
    try {
        if (!initWebGL()) {
            throw new Error('WebGL 초기화 실패');
            return false; 
        }

        // 셰이더 초기화
        await initShader();
        
        // 나머지 초기화
        setupBuffers();
        shader.use();

        // 텍스트 초기화
        textOverlay = setupText(canvas, "", 1);
        textOverlay2 = setupText(canvas, "", 2);
        textOverlay3 = setupText(canvas, "", 3);
        
        // 마우스 이벤트 설정
        setupMouseEvents();
        
        // 초기 렌더링
        render();

        return true;
        
    } catch (error) {
        console.error('Failed to initialize program:', error);
        alert('프로그램 초기화에 실패했습니다.');
        return false;
    }
}
