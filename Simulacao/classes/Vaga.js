import Comunicacao from "./Comunicacao.js"
export default class Vaga {
  constructor({ id, nome, no, fila }) {
    this.estadoSensor = 1
    this.fila = fila
    this.no = no
    this.id = id
    this.nome = nome
    this.carro = null
    this.tempoSairAposAlarme = 4
    this.comunicacao = new Comunicacao()
  }

  async alocarCarro(carro) {
    this.estadoSensor = 0
    this.carro = carro
    let [resposta] = await this.fila.executar([async () => await this.comunicacao.mensagemComRetorno(`B ${this.id} ${this.carro.placa};`), async () => await this.comunicacao.mensagemSemRetorno("ok;")], 0)
    //  let resposta = await this.comunicacao.mensagemComRetorno(`B ${this.id} ${this.carro.placa};`)
    //  this.comunicacao.mensagemSemRetorno("ok;")
    console.log(resposta == "0" ? `Carro não é dessa vaga ${this.id}` : `Carro correto vaga:${this.id}`)
    if (resposta == "0") {
      this.acionarAlarme()
    }
  }

  acionarAlarme() {
    console.log(`CARRO NAO É DESSA VAGA: ${this.id}`)
    //alerta visual e sonoro
    setTimeout(this.carro.sair, this.tempoSairAposAlarme * 1000)
  }

  async desalocarCarro() {
    this.estadoSensor = 1
    this.carro = null
    await this.fila.executar([async () => await this.comunicacao.mensagemSemRetorno(`C ${this.id};`)], 0)
  }
}
