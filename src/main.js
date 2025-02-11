import *  as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const renderer = new THREE.WebGLRenderer({antialias: true})
// to give the edges a bit of smooth effect we are using antialias
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor(0x000000)
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
)
camera.position.set(4,5,11);

const controls = new OrbitControls(camera,renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();


const groundGeometry = new THREE.PlaneGeometry(20,20,32,32)
groundGeometry.rotateX(-Math.PI/2)

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
    //renders both side of the plane
})

const groundMesh =  new THREE.Mesh(groundGeometry, groundMaterial)
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh)

const spotLight = new THREE.SpotLight(0xffffff, 3000, 1000, 0.22, 1);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

const loader = new GLTFLoader().setPath('public/porsche_911_930_turbo_1975/')
loader.load('scene.gltf', (gltf) => {
    const mesh = gltf.scene;
    
    mesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
        }
    });

    mesh.position.set(-0.5,1.6,-1)
    scene.add(mesh);

    // Ensure the spotlight is positioned above the car
    const carPosition = mesh.position; // Get car's position

    // Position spotlight directly above the car
    spotLight.position.set(carPosition.x, 25, carPosition.z); // Adjust the height (25) to place above the car
    
    // Set spotlight's target to the car's position
    spotLight.target.position.set(carPosition.x, carPosition.y, carPosition.z);
    scene.add(spotLight.target); // Ensure the target is added to the scene
});

function animate(){

    requestAnimationFrame(animate)
    controls.update();
    renderer.render(scene,camera);
}

animate();