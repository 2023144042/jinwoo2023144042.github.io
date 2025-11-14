import * as THREE from 'three';  
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { initRenderer, initCamera, initStats, initOrbitControls, 
         initDefaultLighting, addLargeGroundPlane,addGeometryWithMaterial } from './util.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



const scene = new THREE.Scene();
const renderer = initRenderer();

// Camera를 perspective와 orthographic 두 가지로 switching 해야 해서 const가 아닌 let으로 선언
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 120;
camera.position.y = 60;
camera.position.z = 180;
camera.lookAt(scene.position);
scene.add(camera);

let orbitControls = initOrbitControls(camera, renderer);
const stats = initStats();

const sunLight = new THREE.PointLight(0xffffff, 1000, 500);

scene.add(sunLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 20, 10);
scene.add(directionalLight);

const textureLoader = new THREE.TextureLoader();

let mercuryAngle = 0;
let venusAngle   = 0;
let earthAngle   = 0;
let marsAngle    = 0;


const mercuryRadius = 20;
const venusRadius   = 35;
const earthRadius   = 50;
const marsRadius    = 65;

function addGeometry(scene, geom, texture, color) {
    var mat = new THREE.MeshStandardMaterial(
      {
        map: texture,
        color: color,
        metalness: 0.2,
        roughness: 0.7
    });
    var mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;
    
    scene.add(mesh);
  
    return mesh;
};

const Earth = new THREE.SphereGeometry(3.5, 20, 20)
const EarthMesh = addGeometry(scene, Earth,
                        textureLoader.load('./assets/textures/Earth.jpg'),'#3498db');
EarthMesh.castShadow = true;

EarthMesh.position.x=50;

const Mars = new THREE.SphereGeometry(2.5, 20, 20)
const MarsMesh = addGeometry(scene, Mars,
                        textureLoader.load('./assets/textures/Mars.jpg'),'#c0392b');
MarsMesh.castShadow = true;

MarsMesh.position.x=65;

const Mercury = new THREE.SphereGeometry(1.5, 20, 20)
const MercuryMesh = addGeometry(scene, Mercury,
                        textureLoader.load('./assets/textures/Mercury.jpg'),'#a6a6a6');
MercuryMesh.castShadow = true;

MercuryMesh.position.x=20;

const Venus = new THREE.SphereGeometry(3, 20, 20)
const VenusMesh = addGeometry(scene, Venus,
                        textureLoader.load('./assets/textures/Venus.jpg'),'#e3931c');
VenusMesh.castShadow = true;

VenusMesh.position.x=35;

const yellowMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  roughness: 0.4,
  metalness: 0.0,
  emissive: 0xffcc00,
  emissiveIntensity: 1.2

});

const Sun = new THREE.SphereGeometry(10, 20, 20)
const SunMesh = addGeometryWithMaterial(scene, Sun,null,null,null,yellowMaterial);
SunMesh.castShadow = true;




// GUI
const gui = new GUI();
const controls = new function () {
    this.perspective = "Perspective";
    this.switchCamera = function () {
        if (camera instanceof THREE.PerspectiveCamera) {
            scene.remove(camera);
            camera = null; // 기존의 camera 제거    
            // OrthographicCamera(left, right, top, bottom, near, far)
            camera = new THREE.OrthographicCamera(window.innerWidth / -16, 
                window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
            camera.position.x = 120;
            camera.position.y = 60;
            camera.position.z = 180;
            camera.lookAt(scene.position);
            orbitControls.dispose(); // 기존의 orbitControls 제거
            orbitControls = null;
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            this.perspective = "Orthographic";
        } else {
            scene.remove(camera);
            camera = null; 
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.x = 120;
            camera.position.y = 60;
            camera.position.z = 180;
            camera.lookAt(scene.position);
            orbitControls.dispose(); // 기존의 orbitControls 제거
            orbitControls = null;
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            this.perspective = "Perspective";
        }
    };
};
gui.add(controls, 'switchCamera');
gui.add(controls, 'perspective').listen();

const mercurySettings = {
    "Rotation Speed": 0.02,
    "Oribit Speed": 0.02
};

const venusSettings = {
    "Rotation Speed": 0.015,
    "Oribit Speed": 0.015
};


const earthSettings = {
    "Rotation Speed": 0.01,
    "Oribit Speed": 0.01
};

const marsSettings = {
    "Rotation Speed": 0.008,
    "Oribit Speed": 0.008
};

const mercuryFolder = gui.addFolder('Mercury');
mercuryFolder.add(mercurySettings, "Rotation Speed",0 , 0.1);
mercuryFolder.add(mercurySettings, "Oribit Speed", 0, 0.1);

const venusFolder = gui.addFolder('Venus');
venusFolder.add(venusSettings, "Rotation Speed",0 , 0.1);
venusFolder.add(venusSettings, "Oribit Speed", 0, 0.1);

const earthFolder = gui.addFolder('Earth');
earthFolder.add(earthSettings, "Rotation Speed",0 , 0.1);
earthFolder.add(earthSettings, "Oribit Speed", 0, 0.1);

const marsFolder = gui.addFolder('Mars');
marsFolder.add(marsSettings, "Rotation Speed",0 , 0.1);
marsFolder.add(marsSettings, "Oribit Speed", 0, 0.1);


render();

function render() {
  stats.update();
  orbitControls.update();

  MercuryMesh.rotation.y += mercurySettings["Rotation Speed"];
  VenusMesh.rotation.y   += venusSettings["Rotation Speed"];
  EarthMesh.rotation.y   += earthSettings["Rotation Speed"];
  MarsMesh.rotation.y    += marsSettings["Rotation Speed"];

  mercuryAngle += mercurySettings["Oribit Speed"];
  venusAngle   += venusSettings["Oribit Speed"];
  earthAngle   += earthSettings["Oribit Speed"];
  marsAngle    += marsSettings["Oribit Speed"];

  MercuryMesh.position.set(
    Math.cos(mercuryAngle) * mercuryRadius,
    0,
    Math.sin(mercuryAngle) * mercuryRadius
  );

  VenusMesh.position.set(
    Math.cos(venusAngle) * venusRadius,
    0,
    Math.sin(venusAngle) * venusRadius
  );

  EarthMesh.position.set(
    Math.cos(earthAngle) * earthRadius,
    0,
    Math.sin(earthAngle) * earthRadius
  );

  MarsMesh.position.set(
    Math.cos(marsAngle) * marsRadius,
    0,
    Math.sin(marsAngle) * marsRadius
  );

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

