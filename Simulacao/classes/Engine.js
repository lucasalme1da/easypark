import BuscaRota from "./BuscaRota.js"

const {
  Path,
  Clock,
  Vector2,
  Vector3,
  Quaternion,
  Euler,
  MathUtils
} = require("three")

export default class Engine {
  constructor({ vagas, interfaceAStar }) {
    //Objetos que terao movimento
    //
    this.interfaceAStar = interfaceAStar
    this.vagas = vagas
    this.objetos = []
    this.atualizarDirecao = []
    this.estacionario = new Vector3(0, 0, 0)
    //Resistencia a velocidade
    this.resistencia = 0.01
    this.frente = new Vector3(0, 0, 1)
    this.velocidadeDoCarro = 0.27
    this.tolerancia = 0.1
    this.intervaloBezier = 0.1
    this.clock = new Clock()
    this.debugger = false
  }

  // DEV

  getCars() {
    return [...this.objetos]
  }

  // FIM DEV

  add(objeto) {
    if (!objeto.position) {
      throw new Error("Objeto deve ser uma instancia de Object3D")
      return
    }
    objeto.velocidade = new Vector3(0, 0, 0)
    this.objetos.push(objeto)
  }
  remove(objeto) {
    const inidice = this.objetos.findIndex(ob => ob == objeto)
    this.objetos.splice(indice, 1)
  }

  atualizarPosicao(objeto, delta) {
    if (!objeto.path || objeto.tempo > 1) return
    const pt = objeto.path.getPoint(objeto.tempo)
    if (objeto.previousPoint) {
      const direction = new Vector3(pt.x, 0, pt.y).sub(new Vector3(objeto.previousPoint.x, 0, objeto.previousPoint.y)).normalize()
      let angle = this.frente.angleTo(direction.clone().normalize())
      angle = pt.x > objeto.previousPoint.x ? angle : -angle
      const degAngle = MathUtils.radToDeg(angle)
      const [x, y, z] = [-90, 0, degAngle]
      const order = "XYZ"
      objeto.quaternion.slerp(new Quaternion().setFromEuler(new Euler(MathUtils.degToRad(x || 0), MathUtils.degToRad(y || 0), MathUtils.degToRad(z || 0), order ? order : "XYZ")), 1)
    }
    objeto.position.set(pt.x, 0, pt.y)

    if (objeto.tempo < 1) {
      objeto.tempo += objeto.intervalo
    }
    objeto.previousPoint = pt

    //objeto.position.add(objeto.velocidade.clone().multiplyScalar(delta))
  }
  curvaBezier(rota) {
    let novaRota = [...rota]
    let nosTemporarios = []
    for (let indice = 0; indice < novaRota.length; indice++) {
      const a0 = novaRota[indice]
      const a1 = novaRota[indice + 1]
      const a2 = novaRota[indice + 2]
      if (a1 == undefined || a2 == undefined) break
      const vetor1 = new Vector3().subVectors(a1.posicao, a0.posicao)
      const vetor2 = new Vector3().subVectors(a2.posicao, a1.posicao)
      const angulo = MathUtils.radToDeg(vetor1.angleTo(vetor2))
      const tolerancia = 80
      if (angulo >= 90 - tolerancia && angulo <= 90 + tolerancia) {
        let pontos = 50
        novaRota.splice(indice, 3, ...this.interfaceAStar.pegarPontosDeCurva([a0, a1, a2], pontos))
        indice += pontos - 10
      }
    }
    novaRota[novaRota.length - 1] = rota[rota.length - 1]
    return novaRota
    //retorna a rota modificada
    //verificar quais pontos formam uma curva
  }
  async go(modelo3D, noFinal, desalocar = true) {
    //modelo3D precisa ter um atributo no inicial
    if (modelo3D.noInicial === undefined) {
      throw new Error('Modelo3D deve ter um parametro "noInicial" do tipo No')
      return
    }
    const buscaRota = new BuscaRota(modelo3D.noInicial)

    let rota = buscaRota.irProximoNo(noFinal)
    //debug
    rota = this.curvaBezier(rota)
    //rota = novaRota
    //this.novaRota = novaRota
    //novaRota.forEach(no => this.interfaceAStar.criarMesh(no))

    const path = new Path(rota.map(no => new Vector2(no.posicao.x, no.posicao.z)))
    let distacia = 0
    for (let indice = 1; indice < rota.length; indice++) {
      const ponto1 = rota[indice].posicao
      const ponto2 = rota[indice - 1].posicao
      distacia += ponto1.distanceTo(ponto2)
    }
    modelo3D.path = path
    modelo3D.tempo = 0
    modelo3D.distacia = distacia
    modelo3D.intervalo = this.velocidadeDoCarro / distacia
    modelo3D.previousPoint = null
    await this.executePath(modelo3D)
    //   for (let index = 1; index < rota.length; index++) {
    //       const previousNode = rota[index - 1]
    //       const targetNode = rota[index]
    //       const direction = targetNode.posicao
    //           .clone()
    //           .sub(previousNode.posicao)
    //           .normalize()

    //       let angle = this.frente.angleTo(direction.clone().normalize())
    //       angle = targetNode.posicao.x > previousNode.posicao.x ? angle : -angle
    //       const degAngle = MathUtils.radToDeg(angle)
    //       await this.rotacionarModelo3D(modelo3D, { x: -90, z: degAngle, y: 0 })
    //       await this.goToNode(previousNode, targetNode, direction, modelo3D)
    //   }
    //Atualizar estado dos sensores
    const vagaFinal = this.vagas.find(vaga => vaga.no == noFinal)
    if (vagaFinal) vagaFinal.alocarCarro(modelo3D)
    const vagaInicial = this.vagas.find(vaga => vaga.no == modelo3D.noInicial)
    if (vagaInicial && desalocar) vagaInicial.desalocarCarro()

    modelo3D.noInicial = rota[rota.length - 1]
    modelo3D.velocidade = this.estacionario.clone()
  }

  isBetween(vector, targetVectorMin, targetVectorMax) {
    const compareAxis = axis => vector[axis] >= targetVectorMin[axis] && vector[axis] <= targetVectorMax[axis]
    return compareAxis("x") && compareAxis("z")
  }
  executePath(modelo) {
    return new Promise(resolve => {
      const checarTempo = setInterval(() => {
        if (modelo.tempo >= 1) {
          clearInterval(checarTempo)
          resolve()
          return
        }
      }, 5)
    })
  }

  goToNode(previousNode, targetNode, direction, modelo3D) {
    return new Promise(resolve => {
      modelo3D.distanciaInicial = previousNode.posicao.distanceTo(targetNode.posicao)
      modelo3D.distanciaAntes = modelo3D.distanciaInicial
      modelo3D.percorrido = 0
      modelo3D.targetNode = targetNode
      modelo3D.previousNode = previousNode
      modelo3D.velocidade = direction
        .clone()
        .normalize()
        .setY(modelo3D.velocidade.y)
        .multiplyScalar(this.velocidadeDoCarro)
      modelo3D.chegouDestino = false
      const checarSeChegou = setInterval(() => {
        if (modelo3D.chegouDestino === true) {
          clearInterval(checarSeChegou)
          resolve()
          return
        }
      }, 5)
      this.atualizarDirecao.push(modelo3D)
    })
  }
  rotacionarModelo3D(mesh, euler, time) {
    return new Promise(resolve => {
      const { x, y, z, order } = euler
      if (!time) {
        mesh.quaternion.slerp(new Quaternion().setFromEuler(new Euler(MathUtils.degToRad(x || 0), MathUtils.degToRad(y || 0), MathUtils.degToRad(z || 0), order ? order : "XYZ")), 1)
        resolve()
        return
      }
      const step = 1 / (time / 16)
      let amount = 0
      let count = 0
      let times = time / 16

      const endQuaternion = new Quaternion().setFromEuler(new Euler(MathUtils.degToRad(x || 0), MathUtils.degToRad(y || 0), MathUtils.degToRad(z || 0), order ? order : "XYZ"))
      let animation = setInterval(() => {
        // amount += step
        mesh.quaternion.slerp(endQuaternion, step * count)
        if (count >= times) {
          resolve()
          clearInterval(animation)
        } else {
          count++
        }
      }, 16)
    })
  }
  atualizarVelocidades() {
    this.atualizarDirecao.forEach(modelo => this.atualizarVelocidade(modelo))
  }
  //Rodar a cada frame
  simular(delta) {
    this.objetos.forEach(objeto => this.atualizarPosicao(objeto, delta))
  }
}
