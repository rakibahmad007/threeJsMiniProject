import *  as THREE from 'three';

const renderer = new THREE.WebGLRenderer({antialias: true})
// to give the edges a bit of smooth effect we are using antialias
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor(0x000000)
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
)

const groundGeometry = new THREE.PlaneGeometry(20,20,32,32)
groundGeometry.rotateX(-Math.PI/2)

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
    //renders both side of the plane
})

const groundMesh =  new THREE.Mesh(groundGeometry, groundMaterial)
scene.add(groundMesh)

const spotLight = new THREE.SpotLight(0xffffff,3,100,0.2,0.5);
spotLight.position.set(0,25,0)
scene.add(spotLight)

function animate(){

    requestAnimationFrame(animate)
    renderer.render(scene,camera);
}

animate();