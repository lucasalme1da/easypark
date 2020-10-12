const { Vector3 } = require("three")

export default class No {
    constructor(posicao, vizinhos) {
        this.posicao = new Vector3(...posicao)
        this.vizinhos = []
        if (vizinhos !== undefined) {
            vizinhos.forEach(no => this.conectarNos(no))
        }
    }

    conectar(nos) {
        nos.forEach(no => {
            this.conectarNos(no)
        })
    }

    conectarNos(no) {
        const distanciaEntreNos = this.posicao.distanceTo(no.posicao)
        if (!this.vizinhos.find(vizinho => vizinho.no === no)) {
            this.vizinhos.push({
                no,
                distancia: distanciaEntreNos,
            })
        }
        if (!no.vizinhos.find(vizinho => vizinho.no === this)) {
            no.vizinhos.push({
                no: this,
                distancia: distanciaEntreNos,
            })
        }
    }
}

