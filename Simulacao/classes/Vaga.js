import Comunicacao from "./Comunicacao.js"
export default class Vaga {
    constructor({ id, nome, no, fila, modelo }) {
        this.estadoSensor = 1
        this.modelo = modelo
        this.fila = fila
        this.no = no
        this.id = id
        this.nome = nome
        this.carro = null
        this.tempoSairAposAlarme = 10
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
            this.acionarAlarme(carro)
            this.estadoSensor = 1
            this.carro = null
        }
    }

    acionarAlarme(carro) {
        this.modelo.light(this.nome)
        setTimeout(async () => {
            this.modelo.removeLight(this.nome)
            await carro.irVagaCerta()
            setTimeout(carro.sair, this.tempoSairAposAlarme * 1000)
        }, 8000)
    }

    async desalocarCarro() {
        this.estadoSensor = 1
        this.carro = null
        await this.fila.executar([async () => await this.comunicacao.mensagemSemRetorno(`C ${this.id};`)], 0)
    }
}
