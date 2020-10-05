const {
  MeshBasicMaterial,
  SphereBufferGeometry,
  Mesh,
  LOD,
  TextureLoader,
  PlaneGeometry,
  DoubleSide,
} = require('three')

const path = require('fs')

import ColladaLoader from './ColladaLoader.js'

export default class Modelo {

  constructor(scene) {
    this.lod = new LOD()
    this.loader = new ColladaLoader()
    this.texture = new TextureLoader()
    this.scene = scene
  }

  carregarCeu() {
    this.texture.load(
      `textures/sky.jpg`,
      (texture) => {
        var material = new MeshBasicMaterial({
          map: texture
        })
        var geometry = new SphereBufferGeometry(512, 512, 512)
        geometry.scale(-1, 1, 1)
        geometry.rotateY(Math.PI)
        var sphere = new Mesh(geometry, material)
        sphere.position.set(0, 0, 0)
        this.scene.add(sphere)
      },
      (err) => {
        console.error('Erro ao carregar o céu.')
      }
    )
  }

  carregarEstacionamento() {
    return new Promise((resolve, reject) => {
      this.load('./models/estacionamento/EasyPark.dae').then(resolve)
    })
  }

  carregarPlano() {
    return new Promise((resolve, reject) => {
      var geometry = new PlaneGeometry(1000, 1000, 32)
      var material = new MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: DoubleSide
      })
      var plane = new Mesh(geometry, material)
      plane.rotation.x = Math.PI / 2
      plane.position.set(0, 0, 0)
      this.scene.add(plane)
      resolve(plane)
    })
  }

  load(filePath, ...options) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        filePath,
        ({ scene: object }) => {
          object.position.set(
            options[0] ?? 0,
            options[1] ?? 0,
            options[2] ?? 0
          )
          object.rotation.z = options[3] ?? 0
          var LodTemporaryObject = new LOD();
          LodTemporaryObject.addLevel(object, 75)
          this.scene.add(LodTemporaryObject)
          // this.scene.add(object)
          resolve(object)
        },
        (progress) => {
          console.log(`Carregando modelo... ${Math.floor((progress.loaded / progress.total) * 100)}%`)
        },
        (err) => {
          reject(console.error(`Erro ao carregar o arquivo do caminho:\n${filePath}`))
        })
    })
  }

  carregarListaDeCarros() {
    let carListFromDirectory = path.readdirSync('./models/carros', { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    let carListDropdownElement = document.getElementById('carListDropdown')

    carListFromDirectory.map(
      object => {
        let newOption = Object.assign(
          document.createElement('option'), {
          value: object,
          innerHTML: object
        })
        carListDropdownElement.appendChild(newOption)
      }
    )
  }

  addCar(e) {
    console.log(e)
    e.preventDefault()
    var car = {
      model: e.target[0].value ?? 'empty',
      x: +e.target[1].value ?? 0,
      y: +e.target[2].value ?? 0,
      z: +e.target[3].value ?? 0,
      angle: (+e.target[4].value ?? 0) * (Math.PI / 180),
    }
    this.load(`./models/carros/${car.model}/${car.model}.dae`, car.x, car.y, car.z, car.angle)
  }

  add66Car(e) {
    e.preventDefault()
    var cars = {
      0: { x: 1.3273882762820328, y: 0, z: -2.45671346218767, angle: 180 },
      1: { x: 3.991997976171424, y: 0, z: -2.440755619816033, angle: 180 },
      2: { x: 6.5132734785342965, y: 0, z: -2.481225096528728, angle: 180 },
      3: { x: 1.3508867608839845, y: 0, z: -7.476636320371623, angle: 0 },
      4: { x: 3.9272330093399628, y: 0, z: -7.488813687396788, angle: 0 },
      5: { x: 6.590537635881109, y: 0, z: -7.530551759889571, angle: 0 },
      6: { x: 1.394734113867239, y: 0, z: -18.54290402040499, angle: 180 },
      7: { x: 3.976854770355932, y: 0, z: -18.590521136804288, angle: 180 },
      8: { x: 6.529199302551689, y: 0, z: -18.57910914736319, angle: 180 },
      9: { x: 1.3294210959808153, y: 0, z: -23.63717878392209, angle: 0 },
      10: { x: 3.932749389615139, y: 0, z: -23.59666383259611, angle: 0 },
      11: { x: 6.570479558194194, y: 0, z: -23.611594794343524, angle: 0 },
      12: { x: 1.4058999499897489, y: 0, z: -34.6607594829559, angle: 180 },
      13: { x: 3.955694818495982, y: 0, z: -34.656982467824825, angle: 180 },
      14: { x: 6.5293956360406735, y: 0, z: -34.621020157284775, angle: 180 },
      15: { x: 1.3548781421753389, y: 0, z: -39.767256728281886, angle: 0 },
      16: { x: 3.9626532400054275, y: 0, z: -39.718397716194694, angle: 0 },
      17: { x: 6.542965508910018, y: 0, z: -39.78311903415684, angle: 0 },
      18: { x: 1.390278007670124, y: 0, z: -50.727398470417675, angle: 180 },
      19: { x: 3.942029080287564, y: 0, z: -50.69162834429562, angle: 180 },
      20: { x: 6.555578736621472, y: 0, z: -50.79545027312235, angle: 180 },
      21: { x: 1.3495287227359802, y: 0, z: -55.86335011100775, angle: 0 },
      22: { x: 3.929613847635152, y: 0, z: -55.82654908318892, angle: 0 },
      23: { x: 6.568413106449666, y: 0, z: -55.84435399765721, angle: 0 },
      24: { x: 1.3653154772837537, y: 0, z: -66.885825575649, angle: 180 },
      25: { x: 3.9998315172309327, y: 0, z: -66.84468015137058, angle: 180 },
      26: { x: 6.57876950477145, y: 0, z: -66.90576080571962, angle: 180 },
      27: { x: 1.3000998870770086, y: 0, z: -71.90932226421288, angle: 0 },
      28: { x: 3.944322679078165, y: 0, z: -71.9060679408251, angle: 0 },
      29: { x: 6.5942983410272005, y: 0, z: -71.93622785626496, angle: 0 },
      30: { x: 1.390484872918618, y: 0, z: -82.9483391237108, angle: 180 },
      31: { x: 3.9303787923627835, y: 0, z: -82.99262967080647, angle: 180 },
      32: { x: 6.57225348998434, y: 0, z: -82.96045044105436, angle: 180 },
      33: { x: 1.3616360433835597, y: 0, z: -88.00805754500117, angle: 0 },
      34: { x: 3.9015706521148035, y: 0, z: -88.02408747474153, angle: 0 },
      35: { x: 6.552712390191709, y: 0, z: -88.06726200882883, angle: 0 },
      36: { x: 1.3682071013379113, y: 0, z: -99.0160824054462, angle: 180 },
      37: { x: 3.9909896616954885, y: 0, z: -99.02810947742353, angle: 180 },
      38: { x: 6.531626655460816, y: 0, z: -99.08946827778075, angle: 180 },
      39: { x: 1.3309391678484825, y: 0, z: -104.09075021173311, angle: 0 },
      40: { x: 3.91099714331601, y: 0, z: -104.10607852477702, angle: 0 },
      41: { x: 6.576506261130474, y: 0, z: -104.11479685653791, angle: 0 },
      42: { x: 1.3815769216438314, y: 0, z: -115.1410887714225, angle: 180 },
      43: { x: 4.009282627333337, y: 0, z: -115.1386094144796, angle: 180 },
      44: { x: 6.558709634767415, y: 0, z: -115.13970908497491, angle: 180 },
      45: { x: 1.3402371273253966, y: 0, z: -120.24173294381217, angle: 0 },
      46: { x: 3.9305934996497185, y: 0, z: -120.28018249784729, angle: 0 },
      47: { x: 6.593860099902352, y: 0, z: -120.19763490117025, angle: 0 },
      48: { x: 1.3521177373508602, y: 0, z: -131.217230029574, angle: 180 },
      49: { x: 4.018964600577525, y: 0, z: -131.21296154833894, angle: 180 },
      50: { x: 6.5701827378204625, y: 0, z: -131.25320058903625, angle: 180 },
      51: { x: 1.3089887246581533, y: 0, z: -136.2787379786537, angle: 0 },
      52: { x: 3.940275639842749, y: 0, z: -136.35453742269675, angle: 0 },
      53: { x: 6.64447283252091, y: 0, z: -136.3093396503979, angle: 0 },
      54: { x: 1.3212861006978445, y: 0, z: -147.40475974834368, angle: 180 },
      55: { x: 4.005720084796026, y: 0, z: -147.4708550322303, angle: 180 },
      56: { x: 6.57192196052934, y: 0, z: -147.4290570069517, angle: 180 },
      57: { x: 1.2900949871073575, y: 0, z: -152.5046448292282, angle: 0 },
      58: { x: 3.8939849581216173, y: 0, z: -152.4611236759114, angle: 0 },
      59: { x: 6.60921458170937, y: 0, z: -152.3747455301396, angle: 0 },
      60: { x: 1.3697995872052484, y: 0, z: -163.56123584814273, angle: 180 },
      61: { x: 3.9122047978184775, y: 0, z: -163.63575892793668, angle: 180 },
      62: { x: 6.57368363258716, y: 0, z: -163.6430578341909, angle: 180 },
      63: { x: 1.3076166329707934, y: 0, z: -168.5003752320382, angle: 0 },
      64: { x: 3.9284695542207837, y: 0, z: -168.5426890780807, angle: 0 },
      65: { x: 6.627769640015153, y: 0, z: -168.55279369797924, angle: 0 }
    }

    for (let car in cars) {
      // console.log(cars[car])
      let modelsArray = ['blue_car', 'carbon_car', 'red_car', 'dummy_car']
      let model = modelsArray[Math.floor(Math.random() * modelsArray.length)]
      this.load(`./models/carros/${model}/${model}.dae`, cars[car].x, cars[car].y, cars[car].z, cars[car].angle * (Math.PI / 180))
    }
  }
}