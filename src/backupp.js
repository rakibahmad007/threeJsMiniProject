// import *  as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/Addons.js';
// import { OrbitControls } from 'three/examples/jsm/Addons.js';

// const renderer = new THREE.WebGLRenderer({antialias: true})
// // to give the edges a bit of smooth effect we are using antialias
// renderer.outputColorSpace = THREE.SRGBColorSpace;

// renderer.setSize(window.innerWidth,window.innerHeight);
// renderer.setClearColor(0x000000)
// renderer.setPixelRatio(window.devicePixelRatio);

// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

// document.body.appendChild(renderer.domElement)

// const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(
//     45,
//     window.innerWidth / window.innerHeight,
//     1,
//     1000
// )
// camera.position.set(4,5,11);

// const controls = new OrbitControls(camera,renderer.domElement);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 5;
// controls.maxDistance = 20;
// controls.minPolarAngle = 0.5;
// controls.maxPolarAngle = 1.5;
// controls.autoRotate = false;
// controls.target = new THREE.Vector3(0, 1, 0);
// controls.update();


// const groundGeometry = new THREE.PlaneGeometry(20,20,32,32)
// groundGeometry.rotateX(-Math.PI/2)

// const groundMaterial = new THREE.MeshStandardMaterial({
//     color: 0x555555,
//     side: THREE.DoubleSide
//     //renders both side of the plane
// })

// const groundMesh =  new THREE.Mesh(groundGeometry, groundMaterial)
// groundMesh.castShadow = false;
// groundMesh.receiveShadow = true;
// scene.add(groundMesh)

// const spotLight = new THREE.SpotLight(0xffffff, 3000, 1000, 0.22, 1);
// spotLight.position.set(0, 25, 0);
// spotLight.castShadow = true;
// spotLight.shadow.bias = -0.0001;
// scene.add(spotLight);

// const loader = new GLTFLoader().setPath('public/porsche_911_930_turbo_1975/')
// loader.load('scene.gltf', (gltf) => {
//     const mesh = gltf.scene;
    
//     mesh.traverse((child) => {
//         if (child.isMesh) {
//             child.castShadow = true
//             child.receiveShadow = true
//         }
//     });

//     mesh.position.set(-0.5,1.6,-1)
//     scene.add(mesh);

//     // Ensure the spotlight is positioned above the car
//     const carPosition = mesh.position; // Get car's position

//     // Position spotlight directly above the car
//     spotLight.position.set(carPosition.x, 25, carPosition.z); // Adjust the height (25) to place above the car
    
//     // Set spotlight's target to the car's position
//     spotLight.target.position.set(carPosition.x, carPosition.y, carPosition.z);
//     scene.add(spotLight.target); // Ensure the target is added to the scene
// });

// function animate(){

//     requestAnimationFrame(animate)
//     controls.update();
//     renderer.render(scene,camera);
// }

// animate();

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;

controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
});

const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// Spotlight
const spotLight = new THREE.SpotLight(0xffffff, 5000, 2000, 0.4, 1);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

// Set spotlight target
const spotLightTarget = new THREE.Object3D();
spotLightTarget.position.set(0, 0, 0);
scene.add(spotLightTarget);
spotLight.target = spotLightTarget;

// Calculate the radius for circular movement
const spotlightHeight = 25;
const spotlightAngle = 0.22;
const pathRadius = Math.tan(spotlightAngle) * spotlightHeight;

let car;
let angle = 0;
let speed = 0.02; // Default speed

const speedControl = document.getElementById("speed-control");
speedControl.addEventListener("input", (event) => {
    speed = parseFloat(event.target.value); // Update speed dynamically
});

// Load the Porsche model
const loader = new GLTFLoader().setPath('public/porsche_911_930_turbo_1975/');
loader.load('scene.gltf', (gltf) => {
    car = gltf.scene;
    
    car.traverse((child) => {
        if (child.isMesh) {
            console.log("Mesh Name:", child.name, "| Material Name:", child.material?.name);
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    car.position.set(pathRadius, 0, 0);
    scene.add(car);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (car) {
        angle -= speed; // Update position based on speed slider

        const x = Math.cos(angle) * pathRadius;
        const z = Math.sin(angle) * pathRadius;

        car.position.set(x, 1.6, z);

        // Compute future position for rotation
        const futureAngle = angle - 0.1;
        const futureX = Math.cos(futureAngle) * pathRadius;
        const futureZ = Math.sin(futureAngle) * pathRadius;
        car.lookAt(futureX, 1.6, futureZ);
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
