const { Vector3 } = require('three')
export default class Engine{
    constructor(){
        //Objetos que terao movimento
        this.objetos = []
        this.estacionario = new Vector3(0,0,0)
        //Resistencia a velocidade
        this.resistencia = 0.01
    }
    add(objeto){
        if(!objeto.position){
            throw new Error('Objeto deve ser uma instancia de Object3D')
            return
        }
        objeto.velocidade = new Vector3(0,0,0)
        this.objetos.push(objeto)
    }
    aplicarResistencia(vetor,delta){
        return vetor.clone().negate().multiplyScalar(delta).multiplyScalar(this.resistencia)
    }
    atualizarPosicao(objeto,delta){
     
        if(!objeto.velocidade.equals(this.estacionario)){
            objeto.velocidade.add(this.aplicarResistencia(objeto.velocidade,delta))
        }
        objeto.position.add(objeto.velocidade.clone().multiplyScalar(delta))
    }
    //Rodar a cada frame
    simular(delta){
        this.objetos.forEach(objeto => this.atualizarPosicao(objeto,delta))
    }
}