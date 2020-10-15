require("./classes/OrbitControls.js")
import Modelo from "./classes/Modelo.js"
import BuscaRota from "./classes/BuscaRota.js"
import InterfaceAStar from "./classes/InterfaceAStar.js"
import GravacaoCoordenadas from "./classes/GravacaoCoordenadas.js"
import Engine from "./classes/Engine.js"
import GerenciadorVagas from "./classes/GerenciadorVagas.js"
import No from "./classes/No.js"
import Comunicacao from "./classes/Comunicacao.js"
const { WebGLRenderer, Vector3, OrbitControls, Scene, PerspectiveCamera, AmbientLight, SpotLight, Clock } = require("three")

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
        this.camera = new PerspectiveCamera(80, this.canvas.clientWidth / this.canvas.clientHeight, 1, 10000000) // fov, aspect, near, far
        this.camera.position.set(0, 5, 5)
        this.camera.lookAt(0, 0, 0)

        this.engine = new Engine()
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
        const nos = this.interface.gerenciadorNos.nos
        this.entradas = [nos[66], nos[73], nos[71]]
        this.gerenciadorVagas = new GerenciadorVagas({ gerenciadorNos: this.interface.gerenciadorNos })
        this.comunicacao = new Comunicacao({ gerenciadorVagas: this.gerenciadorVagas })
        this.contagemCarros = 0

        //Funções de Debug
        this.testarTodasRotas = () => {
            this.gerenciadorVagas.vagas.forEach(vaga => {
                console.log(vaga.nome)
                this.instanciarCarro({ entrada: 0, nomeVaga: vaga.nome })
            })
        }
        this.gerarCarro = async () => {
            const vagaAleatoria = Math.floor(Math.random() * 66)
            const entradaAleatoria = Math.floor(Math.random() * 2)
            console.log("Vaga: ", this.gerenciadorVagas.vagas[vagaAleatoria].nome, "Entrada: ", entradaAleatoria)
            await this.instanciarCarro({ entrada: entradaAleatoria, nomeVaga: this.gerenciadorVagas.vagas[vagaAleatoria].nome })
            this.contagemCarros++
            setTimeout(this.gerarCarro, 5500)
        }

        this.animate()
    }
    async instanciarCarro({ entrada, nomeVaga }) {
        console.log("Instanciando Carro")
        console.log("Numero de carros: ", this.contagemCarros)
        const noInicial = entrada ? this.entradas[entrada] : this.entradas[0]
        const noFinal = this.gerenciadorVagas.vagas.find(vaga => vaga.nome == nomeVaga).no
        const corCarro = Math.floor(Math.random() * 4)
        let nomeCor = "blue_car"
        switch (corCarro) {
            case 0:
                nomeCor = "blue_car"
                break
            case 1:
                nomeCor = "carbon_car"
                break
            case 2:
                nomeCor = "dummy_car"
                break
            case 3:
                nomeCor = "red_car"
                break
        }
        const carro = await this.modelo.adicionarCarro(nomeCor, [noInicial.posicao.x, noInicial.posicao.y, noInicial.posicao.z], 0)
        carro.noInicial = noInicial
        carro.position.copy(noInicial.posicao)
        this.engine.add(carro)
        this.engine.go(carro, noFinal)
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
