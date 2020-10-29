require("./classes/OrbitControls.js")
import Modelo from "./classes/Modelo.js"
import BuscaRota from "./classes/BuscaRota.js"
import InterfaceAStar from "./classes/InterfaceAStar.js"
import Engine from "./classes/Engine.js"
import GerenciadorVagas from "./classes/GerenciadorVagas.js"
import Fila from "./classes/Fila.js"
import ManipuladorInput from "./classes/ManipuladorInput.js"

import Comunicacao from "./classes/Comunicacao.js"

import Display from "./classes/Display.js"
import CameraViewer from "./classes/CameraViewer.js"

const {
  WebGLRenderer,
  OrbitControls,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  SpotLight,
  Clock
} = require("three")

export default class main {
  constructor() {
    this.buscaRota = new BuscaRota()
    this.tempoCarroSairVaga = 40
    this.tempoGeracaoCarros = 5
    this.habilitarSaidaAutomatica = true
    this.geracaoAutomaticaCarros = false
    this.estacionarErrado = false
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
    // this.camera.position.set(0, 5, 5)
    // this.camera.lookAt(0, 0, 0)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableZoom = true
    // this.controls.target.set(0, 0, 0)

    const ambientLight = new AmbientLight(0x404040)
    this.scene.add(ambientLight)

    const spotLight = new SpotLight(0xadadad)
    spotLight.position.set(0, 1000, 0)
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
    this.gerenciadorVagas = new GerenciadorVagas({ modelo: this.modelo, gerenciadorNos: this.interface.gerenciadorNos, fila: this.fila })
    this.engine = new Engine({ vagas: this.gerenciadorVagas.vagas, interfaceAStar: this.interface })
    this.cameraViewer = new CameraViewer({
      manipulador: this.manipuladorInput,
      camera: this.camera,
      controls: this.controls,
      engine: this.engine,
    })
    this.comunicacao = new Comunicacao({ gerenciadorVagas: this.gerenciadorVagas })
    this.display = new Display()
    this.display.canTouch = false
    this.contagemCarros = 0
    this.placas = []

    this.modelo.carregarEstacionamento()

    this.camera.position.set(48.43, 5.46, -198.53)
    this.controls.target.set(-19.85, -65.27, -21.4)

    this.manipuladorInput.KeyR = () => {
      console.log("Próximo carro irá estacionar errado")
      this.estacionarErrado = true
    }

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
    this.cameraViewer.changeCarLast()
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
    console.log(nomeVaga)
    if (nomeVaga == "Nao") {
      if (destinoGerado === false) this.display.exibeVaga("Não há vagas :(")
      if (destinoGerado == false) await this.engine.go(carro, noInicial)
      this.scene.remove(carro)
      const indicePlaca = this.placas.findIndex(placa => placa == carro.placa)
      this.placas.splice(indicePlaca, 1)
      return
    }
    if (destinoGerado === false) this.display.exibeVaga(nomeVaga.toUpperCase())

    //Gerando vaga errada
    let vagaErrada
    if (this.estacionarErrado) {
      let numeroVaga = parseInt(nomeVaga.substring(1, 3))
      let numeroErrado = numeroVaga
      while (numeroErrado == numeroVaga) {
        numeroErrado = Math.floor(Math.random() * 66) + 1
      }
      const vagaErradaNome = `a${numeroErrado.toString().padStart(2, "0")}`
      vagaErrada = this.gerenciadorVagas.vagas.find(vaga => vaga.nome == vagaErradaNome)
      console.log("Vaga errada ", vagaErradaNome)
    }
    //

    const vaga = this.gerenciadorVagas.vagas.find(vaga => vaga.nome == nomeVaga)

    await this.engine.go(carro, this.estacionarErrado ? vagaErrada.no : vaga.no)
    //Sair depois de um tempo
    carro.irVagaCerta = async () => {
      await this.engine.go(carro, vaga.no, false)
    }
    carro.sair = async () => {
      await this.engine.go(carro, noSaida)
      this.scene.remove(carro)
      const indicePlaca = this.placas.findIndex(placa => placa == carro.placa)
      const indiceCarro = this.engine.objetos.findIndex(objeto => objeto == carro)
      this.engine.objetos.splice(indiceCarro, 1)
      this.placas.splice(indicePlaca, 1)
    }
    if (this.habilitarSaidaAutomatica && this.estacionarErrado == false) setTimeout(carro.sair.bind(this), this.tempoCarroSairVaga * 1000)
    if (this.estacionarErrado) this.estacionarErrado = false
  }

  animate() {
    this.cameraViewer.updateCarViewer()
    this.renderer.render(this.scene, this.camera)
    this.controls.update()
    this.modelo.updateLights(this.clock)
    this.controls.rotateSpeed = -0.5
    this.controls.enableDamping = true
    this.engine.simular(this.clock.getDelta())
    requestAnimationFrame(this.animate.bind(this))
  }
}
