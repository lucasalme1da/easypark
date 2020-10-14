const {
  MeshBasicMaterial,
  SphereBufferGeometry,
  Mesh,
  LOD,
  TextureLoader,
  PlaneGeometry,
  DoubleSide,
} = require("three")
const path = require("fs")
const { data } = require("./data/infoCarros.json")

import ColladaLoader from "./ColladaLoader.js"

export default class Modelo {
  constructor(scene) {
    this.lod = new LOD()
    this.loader = new ColladaLoader()
    this.texture = new TextureLoader()
    this.scene = scene
    // this.data = fs.readFileSync(path.resolve(__dirname, "/data/infoCarros.json"))
  }

  carregarCeu() {
    this.texture.load(
      `textures/sky.jpg`,
      (texture) => {
        var material = new MeshBasicMaterial({
          map: texture,
        })
        var geometry = new SphereBufferGeometry(512, 512, 512)
        geometry.scale(-1, 1, 1)
        geometry.rotateY(Math.PI)
        var sphere = new Mesh(geometry, material)
        sphere.position.set(0, 0, 0)
        this.scene.add(sphere)
      },
      (err) => {
        console.error("Erro ao carregar o céu.")
      }
    )
  }

  carregarEstacionamento() {
    return new Promise((resolve, reject) => {
      this.load("./models/estacionamento/EasyPark.dae").then(resolve)
    })
  }

  carregarPlano() {
    return new Promise((resolve, reject) => {
      var geometry = new PlaneGeometry(1000, 1000, 32)
      var material = new MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: DoubleSide,
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
          var LodTemporaryObject = new LOD()
          LodTemporaryObject.addLevel(object, 75)
          this.scene.add(LodTemporaryObject)
          // this.scene.add(object)
          resolve(object)
        },
        (progress) => {
          console.log(
            `Carregando modelo... ${Math.floor(
              (progress.loaded / progress.total) * 100
            )}%`
          )
        },
        (err) => {
          reject(
            console.error(
              `Erro ao carregar o arquivo do caminho:\n${filePath}`
            )
          )
        }
      )
    })
  }

  carregarListaDeCarros() {
    let carListFromDirectory = path
      .readdirSync("./models/carros", { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)

    let carListDropdownElement = document.getElementById("carListDropdown")

    carListFromDirectory.map((object) => {
      let newOption = Object.assign(document.createElement("option"), {
        value: object,
        innerHTML: object,
      })
      carListDropdownElement.appendChild(newOption)
    })
  }

  async adicionarCarro(modelo, posicao, angulo) {
    const car = {
      model: modelo,
      x: posicao[0],
      y: posicao[1],
      z: posicao[2],
      angle: angulo,
    }
    return await this.load(
      `./models/carros/${car.model}/${car.model}.dae`,
      car.x,
      car.y,
      car.z,
      car.angle
    )
  }

  addCar(e) {
    console.log(e)
    e.preventDefault()
    var car = {
      model: e.target[0].value ?? "empty",
      x: +e.target[1].value ?? 0,
      y: +e.target[2].value ?? 0,
      z: +e.target[3].value ?? 0,
      angle: (+e.target[4].value ?? 0) * (Math.PI / 180),
    }
    this.load(
      `./models/carros/${car.model}/${car.model}.dae`,
      car.x,
      car.y,
      car.z,
      car.angle
    )
  }

  add66Car(e) {
    e.preventDefault()
    var cars = data;

    for (let car in cars) {
      let modelsArray = ["blue_car", "carbon_car", "red_car", "dummy_car"]
      let model =
        modelsArray[Math.floor(Math.random() * modelsArray.length)]
      this.load(
        `./models/carros/${model}/${model}.dae`,
        cars[car].x,
        cars[car].y,
        cars[car].z,
        cars[car].angle * (Math.PI / 180)
      )
    }
  }
}

