require("./classes/OrbitControls.js")
import Modelo from "./classes/Modelo.js"
import BuscaRota from "./classes/BuscaRota.js"
import InterfaceAStar from "./classes/InterfaceAStar.js"
import GravacaoCoordenadas from "./classes/GravacaoCoordenadas.js"
import Engine from "./classes/Engine.js"

import No from "./classes/No.js"
const {
    WebGLRenderer,
    Vector3,
    OrbitControls,
    Scene,
    PerspectiveCamera,
    AmbientLight,
    SpotLight,
    Clock,
} = require("three")

const Stats = require("stats.js")

export default class main {
    constructor() {
        this.buscaRota = new BuscaRota()
        this.stats = new Stats()
        document.body.appendChild(this.stats.dom)
    }
    async load() {
        this.canvas = document.querySelector("#canvas")
        this.renderer = new WebGLRenderer()
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
        this.canvas.appendChild(this.renderer.domElement)
        this.scene = new Scene()
        this.modelo = new Modelo(this.scene)
        this.clock = new Clock()
        this.engine = new Engine()
        this.camera = new PerspectiveCamera(
            80,
            this.canvas.clientWidth / this.canvas.clientHeight,
            1,
            10000000
        ) // fov, aspect, near, far
        this.camera.position.set(0, 5, 5)
        this.camera.lookAt(0, 0, 0)

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableZoom = true
        this.controls.target.set(0, 0, 0)

        const ambientLight = new AmbientLight(0x404040)
        this.scene.add(ambientLight)

        const spotLight = new SpotLight(0xfffff0)
        spotLight.position.set(0, 100, 2)
        spotLight.castShadow = false
        this.scene.add(spotLight)

        this.modelo.carregarListaDeCarros()

        this.modelo.carregarCeu()

        this.modelo.carregarEstacionamento()

        const plano = await this.modelo.carregarPlano()

        this.interface = new InterfaceAStar({
            nomeAtributoPosicao: "posicao",
            nomeAtributoConexoes: "vizinhos",
            camera: this.camera,
            cena: this.scene,
            base: plano,
            canvas: this.canvas,
        })

        this.gravacao = new GravacaoCoordenadas(this.interface.nos)
        const noInicial = this.interface.nos[4]
        const noFinal = this.interface.nos[3]
        const carroTeste = await this.modelo.adicionarCarro(
            "blue_car",
            [noInicial.posicao.x, noInicial.posicao.y, noInicial.posicao.z],
            0
        )
        carroTeste.noInicial = noInicial
        carroTeste.position.copy(noInicial.posicao)
        this.camera.position.copy(noInicial.posicao)
        this.engine.add(carroTeste)
        this.setFrente = (posicao) => {
            this.engine.frente = new Vector3(...posicao)
        }
        this.iniciarRota = (indice) => {
            let noInterface = this.interface.nos[indice]
            this.engine.go(carroTeste, noInterface)
        }
        this.carro = carroTeste
        this.animate()
    }

    animate() {
        this.stats.begin()
        this.renderer.render(this.scene, this.camera)
        this.controls.update()
        this.controls.rotateSpeed = -0.5
        this.controls.enableDamping = true
        this.engine.simular(this.clock.getDelta())
        requestAnimationFrame(this.animate.bind(this))
        this.stats.end()
    }
}
