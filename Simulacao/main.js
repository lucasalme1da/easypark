require("./classes/OrbitControls.js")
import Modelo from "./classes/Modelo.js"
import BuscaRota from "./classes/BuscaRota.js"
import InterfaceAStar from "./classes/InterfaceAStar.js"
import GravacaoCoordenadas from "./classes/GravacaoCoordenadas.js"
import Engine from "./classes/Engine.js"
import GerenciadorVagas from "./classes/GerenciadorVagas.js"
import No from "./classes/No.js"
import Fila from "./classes/Fila.js"
import ManipuladorInput from "./classes/ManipuladorInput.js"

import Comunicacao from "./classes/Comunicacao.js"

import Display from "./classes/Display.js"

const { WebGLRenderer, Vector3, OrbitControls, Scene, PerspectiveCamera, AmbientLight, SpotLight, Clock } = require("three")

const Stats = require("stats.js")

export default class main {
    constructor() {
        this.buscaRota = new BuscaRota()
        this.stats = new Stats()
        document.body.appendChild(this.stats.dom)
        this.tempoCarroSairVaga = 10
        this.tempoGeracaoCarros = 5
        this.habilitarSaidaAutomatica = true
        this.geracaoAutomaticaCarros = false
        this.manipuladorInput = new ManipuladorInput()
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
        this.fila = new Fila()
        this.gerenciadorVagas = new GerenciadorVagas({ gerenciadorNos: this.interface.gerenciadorNos, fila: this.fila })
        this.engine = new Engine({ vagas: this.gerenciadorVagas.vagas })
        this.comunicacao = new Comunicacao({ gerenciadorVagas: this.gerenciadorVagas })
        this.display = new Display()
        this.display.canTouch = false
        this.contagemCarros = 0
        this.placas = []

        this.modelo.carregarEstacionamento()

        this.camera.position.set(59, 12, -210)
        this.camera.lookAt(52, 0, -198)

        this.manipuladorInput.KeyW = () => {
            console.log("Gerando carro")
            this.gerarCarro()
        }
        this.manipuladorInput.KeyE = () => {
            if (this.geracaoAutomaticaCarros) {
                this.geracaoAutomaticaCarros = false
                console.log("Desligando carros automaticos")
            } else {
                this.geracaoAutomaticaCarros = true
                this.gerarCarros()
                console.log("Ligando carros automaticos")
            }
        }
        console.log("Tecla W Gera um novo carro")
        console.log("Tecla E liga a geração de carros aleatorios")

        this.animate()
    }
    gerarPlaca() {
        let placa = "ABC" + (Math.floor(Math.random() * 3000) + 1)
        while (this.placas.find(placasRegistradas => placa == placasRegistradas) != undefined) {
            placa = "ABC" + (Math.floor(Math.random() * 3000) + 1)
        }
        return placa
    }
    gerarCarros() {
        const entrada = Math.random() > 0.5 ? 132 : 72
        const destino = Math.floor(Math.random() * 5)
        this.gerarCarro(entrada, destino)
        if (this.geracaoAutomaticaCarros) setTimeout(this.gerarCarros.bind(this), this.tempoGeracaoCarros * 1000)
    }
    async gerarCarro(noInicialIndice = 131, destinoGerado = false) {
        const comunicacao = new Comunicacao()
        const noInicial = this.interface.gerenciadorNos.nos[noInicialIndice]
        const noTotem = this.interface.gerenciadorNos.nos[130]
        const noSaida = this.interface.gerenciadorNos.nos[70]
        const corCarro = Math.floor(Math.random() * 4)
        let coresCarros = ["blue_car", "carbon_car", "dummy_car", "red_car"]
        const carro = await this.modelo.adicionarCarro(coresCarros[corCarro], [noInicial.posicao.x, noInicial.posicao.y, noInicial.posicao.z], 0)
        carro.noInicial = noInicial
        carro.placa = this.gerarPlaca()
        carro.position.copy(noInicial.posicao)
        this.engine.add(carro)
        if (destinoGerado === false) await this.engine.go(carro, noTotem)
        let destino
        if (destinoGerado === false) {
            this.display.resetaDisplay()
            this.display.canTouch = true
            destino = await this.display.waitTouch()
            this.display.show("loading")
        } else destino = destinoGerado
        comunicacao.registrarComando("destino", () => {
            console.log(`Enviando destino ${destino}`)
            return `${destino};`
        })
        comunicacao.registrarComando("sensores", () => {
            console.log(`Enviando estado sensores ${this.gerenciadorVagas.vagas.map(vaga => vaga.estadoSensor).join(" ")}`)
            return `${this.gerenciadorVagas.vagas.map(vaga => vaga.estadoSensor).join(" ")};`
            //return "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0;"
        })
        comunicacao.registrarComando(
            "vaga",
            vaga => {
                console.log("Melhor vaga: ", vaga)
                return "ok;"
            },
            true
        )
        const [[nomeVaga]] = await this.fila.executar([async () => await comunicacao.mensagemSemRetorno(`A ${carro.placa};`), async () => await comunicacao.escutarMensagens()])
        //  comunicacao.mensagemSemRetorno(`A ${carro.placa};`)
        //  const [nomeVaga] = await comunicacao.escutarMensagens()
        console.log(nomeVaga)
        if (nomeVaga == "Nao") {
            if (destinoGerado === false) this.display.exibeVaga("Não há vagas :(")
            await this.engine.go(carro, noInicial)
            this.scene.remove(carro)
            const indicePlaca = this.placas.findIndex(placa => placa == carro.placa)
            this.placas.splice(indicePlaca, 1)
            return
        }
        if (destinoGerado === false) this.display.exibeVaga(nomeVaga.toUpperCase())
        const vaga = this.gerenciadorVagas.vagas.find(vaga => vaga.nome == nomeVaga)
        await this.engine.go(carro, vaga.no)
        //Sair depois de um tempo
        carro.sair = async () => {
            await this.engine.go(carro, noSaida)
            this.scene.remove(carro)
            const indicePlaca = this.placas.findIndex(placa => placa == carro.placa)
            this.placas.splice(indicePlaca, 1)
        }
        if (this.habilitarSaidaAutomatica) setTimeout(carro.sair.bind(this), this.tempoCarroSairVaga * 1000)
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
