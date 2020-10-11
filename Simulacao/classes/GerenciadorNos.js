import No from "./No.js"
const fs = require("fs")
const path = require("path")
export default class GerenciadorNos {
    constructor() {
        this.nos = []
        this.carregarNos()
    }
    adicionaNo(posicao) {
        const no = new No(posicao)
        this.nos.push(no)
        return no
    }
    conectaNo(primeiroNo, segundoNo) {
        primeiroNo.conectarNos(segundoNo)
    }
    removeNo(no) {
        const index = this.nos.findIndex(noRef => noRef == no)
        if (index == -1) {
            throw new Error("Esse nó não está mais na lista")
            return
        }

        this.nos.splice(index, 1)
        no.vizinhos
            .map(noDistancia => noDistancia.no)
            .forEach(vizinho => {
                const indexNo = vizinho.vizinhos.map(noDistancia => noDistancia.no).findIndex(noRef => noRef == no)
                if (indexNo == -1) {
                    throw new Error("Esse nó não está mais na lista")
                    return
                }
                vizinho.vizinhos.splice(indexNo, 1)
            })
    }
    salvaNos() {
        const dadosArquivoJson = this.nos.map(no => {
            const vizinhos = no.vizinhos.map(vizinho => {
                const { distanciaEntreNos } = vizinho
                const noIndex = this.nos.findIndex(noRef => noRef == vizinho.no)
                return { no: noIndex, distanciaEntreNos }
            })
            const ob = {
                posicao: no.posicao.toArray(),
                vizinhos,
            }
            if (no.vaga) ob.vaga = true
            return ob
        })
        fs.writeFileSync(path.resolve(__dirname, "nos.json"), JSON.stringify({ nos: dadosArquivoJson }))
        console.log("Arquivo nos.json salvo.")
    }
    carregarNos() {
        try {
            let dadosArquivoJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "nos.json")))
            dadosArquivoJson = dadosArquivoJson.nos
            this.nos = dadosArquivoJson.map(no => {
                const noOb = new No(no.posicao.map(cordenada => parseFloat(cordenada)))
                if (no.vaga) noOb.vaga = true
                return noOb
            })
            this.nos.forEach((no, index) => {
                no.vizinhos = dadosArquivoJson[index].vizinhos.map(vizinho => {
                    const { distanciaEntreNos } = vizinho
                    return {
                        no: this.nos[vizinho.no],
                        distanciaEntreNos,
                    }
                })
            })
            console.log("Arquivo nos.json carregado")
        } catch (erro) {
            console.log("Erro ao carregar nos.json", erro)
            this.nos = []
        }
    }
}
