
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87ceeb); // Sky blue background
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 5, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.target.set(0, 1, 0);
controls.update();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

let car;
let zPos = -20;
let speed = 0.1; // Initial speed matching the slider's default value

// Speed control
const speedControl = document.getElementById('speed-control');
speedControl.addEventListener('input', (e) => {
  speed = parseFloat(e.target.value);
});

// Load car model
const carLoader = new GLTFLoader();
carLoader.load('porsche_911_930_turbo_1975/scene.gltf', (gltf) => {
  car = gltf.scene;
  car.scale.set(2.5, 2.5, 2.5);
  car.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  car.position.set(0, 0.05, zPos);
  scene.add(car);
});

// Load road model
const roadLoader = new GLTFLoader();
roadLoader.load('road_intersection/road_scene.gltf', (gltf) => {
  const roadModel = gltf.scene;
  roadModel.traverse((child) => {
    if (child.isMesh) {
      child.receiveShadow = true;
      child.castShadow = true;
    }
  });
  roadModel.position.set(0, 0, 0);
  scene.add(roadModel);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (car) {
    zPos += speed;
    car.position.z = zPos;
    car.position.y = 0.05;
    
    // Reset position when car reaches the end
    if (zPos > 150) {
      zPos = -20;
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});