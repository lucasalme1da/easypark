var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById('webglviewer').appendChild(renderer.domElement);

var scene = new THREE.Scene();
var mixer;

var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  10000000);
camera.position.set(0, 5, 5);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(camera.position.x + .1, camera.position.y, camera.position.z);

// Modelo 360 do céu
var loader = new THREE.TextureLoader();
loader.load(

  url = 'textures/skies/Sunset_Panorama_by_JohnnySasaki20.jpg',

  onLoad = function (texture) {
    var material = new THREE.MeshBasicMaterial({
      map: texture
    });

    var geometry = new THREE.SphereBufferGeometry(128, 128, 128);
    geometry.scale(-1, 1, 1);
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position = camera.position;
    scene.add(sphere);
    renderer.render(scene, camera);

  },
  onError = function (err) {
    // print error if something goes wrong
    console.error('An error happened.');
  }
);



// Modelo 3d do Estacionamento
var loader = new THREE.GLTFLoader();
var park;
loader.load('models/park.glb', function (gltf) {
  park = gltf.scene.children[0];
  // gltf.scene.scale.set(1, 1, 1);

  scene.add(park);
  park.scale.set(1, 1, 1)
  park.position.x = 10;
  park.position.y = 0;
  park.position.z = -12;

});

var ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(0, 100, 2);
spotLight.castShadow = true;
scene.add(spotLight);

olharPara(0, 8, 10);

function olharPara(x, y, z) {
  controls.object.position.set(x, y, z);
}

function addCar() {
  console.log('Adicionando shrek...')
  var car;
  var loader = new THREE.GLTFLoader();
  loader.load('models/shrek/scene.gltf', function (gltf) {
    car = gltf.scene.children[0];

    car.scale.set(0.01, 0.01, 0.01)
    car.position.x = Math.floor(Math.random() * 20) + -10;
    car.position.y = 0.2;
    car.position.z = Math.floor(Math.random() * 20) + -10;
    console.log(car.position.x)
    scene.add(car);

  });
}

let staticCar;
var loader = new THREE.GLTFLoader();
loader.load('models/shrek/scene.gltf', function (gltf) {
  staticCar = gltf.scene.children[0];

  staticCar.scale.set(0.01, 0.01, 0.01)
  staticCar.position.x = 2;
  staticCar.position.y = 0.1;
  staticCar.position.z = 12;
  staticCar.rotation.z = Math.PI;

  console.log(- Math.PI / 2)
  console.log(2 * Math.PI)
  scene.add(staticCar);

  setTimeout(render, 2000);
});


var clock = new THREE.Clock();

function render() {
  var delta = clock.getDelta();

  requestAnimationFrame(render);

  if (staticCar.position.x > -7.5 && staticCar.position.z < 11)
    staticCar.position.x -= Math.PI * delta / 1.25;

  if (staticCar.position.z > -7)
    staticCar.position.z -= 1.5 * Math.PI * delta;

  console.log(staticCar.rotation.z && staticCar.position.z < 11);
  if (staticCar.rotation.z < 1.5 * Math.PI)
    staticCar.rotation.z += Math.PI * delta / 5;

  renderer.render(scene, camera);
}
