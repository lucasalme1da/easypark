import Vaga from "./Vaga.js"
const fs = require("fs")
const path = require("path")
export default class GerenciadorVagas {
    constructor({ gerenciadorNos, fila, modelo }) {
        this.vagas = []
        this.fila = fila
        this.modelo = modelo
        this.gerenciadorNos = gerenciadorNos
        this.lerVagasGerenciadorNos()
    }

    lerVagasGerenciadorNos() {
        const vagas = this.gerenciadorNos.nos.filter(no => no.vaga)
        try {
            let dadosArquivo = fs.readFileSync(path.resolve(__dirname, "..", "Software", "Dados", "vagas.txt"), "utf8")
            console.log("Arquivo vagas carregado")
            dadosArquivo.split("\n").forEach((vaga, index) => {
                const [nome] = vaga.split(" ")
                const no = vagas[index]
                const vagaOb = new Vaga({ modelo: this.modelo, id: index, nome, no, fila: this.fila })
                no.vaga = vagaOb
                this.vagas.push(vagaOb)
            })
        } catch (erro) {
            console.log("Erro ao carregar vagas.txt", erro)
        }
    }

    //Está função só é necessária se os nós não estiverem no nos.json
    lerArquivoVagas() {
        try {
            let dadosArquivo = fs.readFileSync(path.resolve(__dirname, "..", "Software", "Dados", "vagas.txt"), "utf8")
            console.log("Arquivo vagas carregado")
            dadosArquivo.split("\n").forEach(vaga => {
                const [nome, x, y, z] = vaga.split(" ")
                const no = this.gerenciadorNos.adicionaNo([x, z, y])
                const vagaOb = new Vaga({ nome, no })
                no.vaga = vagaOb
                this.vagas.push(vagaOb)
            })
        } catch (erro) {
            console.log("Erro ao carregar vagas.txt", erro)
        }
    }
}
