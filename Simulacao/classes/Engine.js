const { Vector3, Quaternion, Euler, MathUtils } = require("three")
import BuscaRota from "./BuscaRota.js"
import No from "./No.js"
export default class Engine {
    constructor() {
        //Objetos que terao movimento
        this.objetos = []
        this.estacionario = new Vector3(0, 0, 0)
        //Resistencia a velocidade
        this.resistencia = 0.01
        this.noInicial = new No([0, 0, 0])
        this.buscaRota = new BuscaRota(this.noInicial)
        this.frente = new Vector3(0, 0, 1)
        this.velocidadeDoCarro = 3
        this.tempoDeRotacao = 500
        this.toleranciaAngulo = 5
        this.tolerancia = new Vector3(0.3, 0.3, 0.3)
    }
    add(objeto) {
        if (!objeto.position) {
            throw new Error("Objeto deve ser uma instancia de Object3D")
            return
        }
        objeto.velocidade = new Vector3(0, 0, 0)
        this.objetos.push(objeto)
    }
    aplicarResistencia(vetor, delta) {
        return vetor
            .clone()
            .negate()
            .multiplyScalar(delta)
            .multiplyScalar(this.resistencia)
    }
    atualizarPosicao(objeto, delta) {
        if (!objeto.velocidade.equals(this.estacionario)) {
            objeto.velocidade.add(this.aplicarResistencia(objeto.velocidade, delta))
        }
        objeto.position.add(objeto.velocidade.clone().multiplyScalar(delta))
    }
    async go(modelo3D, noFinal) {
        //modelo3D precisa ter um atributo no inicial
        if (modelo3D.noInicial === undefined) {
            throw new Error('Modelo3D deve ter um parametro "noInicial" do tipo No')
            return
        }
        this.buscaRota.noInicial = modelo3D.noInicial
        const rota = this.buscaRota.irProximoNo(noFinal)
        for (let index = 1; index < rota.length; index++) {
            const previousNode = rota[index - 1]
            const targetNode = rota[index]
            const direction = targetNode.posicao
                .clone()
                .sub(previousNode.posicao)
                .normalize()

            let angle = this.frente.angleTo(direction.clone().normalize())
            angle = targetNode.posicao.x > previousNode.posicao.x ? angle : -angle
            const degAngle = MathUtils.radToDeg(angle)
            await this.rotacionarModelo3D(modelo3D, { x: -90, z: degAngle, y: 0 })
            await this.goToNode(previousNode, targetNode, direction, modelo3D)
        }
        modelo3D.noInicial = rota[rota.length - 1]
    }
    isBetween(vector, targetVectorMin, targetVectorMax) {
        const compareAxis = axis => vector[axis] >= targetVectorMin[axis] && vector[axis] <= targetVectorMax[axis]
        return compareAxis("x") && compareAxis("z")
    }
    goToNode(previousNode, targetNode, direction, modelo3D) {
        return new Promise(resolve => {
            const min = targetNode.posicao.clone().sub(this.tolerancia)
            const max = targetNode.posicao.clone().add(this.tolerancia)
            const interval = setInterval(
                (() => {
                    if (this.isBetween(modelo3D.position, min, max)) {
                        modelo3D.velocidade = this.estacionario.clone()
                        clearInterval(interval)
                        resolve()
                        return
                    }
                    modelo3D.velocidade = direction
                        .clone()
                        .normalize()
                        .setY(modelo3D.velocidade.y)
                        .multiplyScalar(this.velocidadeDoCarro)
                }).bind(this),
                16
            )
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

    //Rodar a cada frame
    simular(delta) {
        this.objetos.forEach(objeto => this.atualizarPosicao(objeto, delta))
    }
}
