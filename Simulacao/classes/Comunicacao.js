const fs = require("fs")
const path = require("path")
export default class Comunicacao {
    constructor({ gerenciadorVagas }) {
        this.debug = false
        //Objeto para ficar armazenado o que fazer ao receber determinado comando
        //O comando deve retornar uma string que será escrita no arquivo de envio
        this.comandos = {}
        this.arquivoEnvioMensagem = path.resolve(__dirname, "..", "Software", "leitura")
        this.arquivoRecebimentoMensagem = path.resolve(__dirname, "..", "Software", "escrita")
        this.registrarComando("destino", () => "0;")
        this.registrarComando("idle", () => console.log("O software está em espera"))
        this.registrarComando("sensores", () => `${gerenciadorVagas.vagas.map(vaga => vaga.estadoSensor).join(" ")};`)
        this.registrarComando(
            "vaga",
            vaga => {
                console.log(vaga)
                return "ok;"
            },
            true
        )
    }
    //O comando final encerra o escutarMensagens
    registrarComando(comando, acao, final = false) {
        this.comandos[comando] = { acao, final }
    }
    iniciarFluxoA(placa) {
        this.mensagemSemRetorno(`A ${placa};`)
        this.escutarMensagens()
    }
    async iniciarFluxoB(vaga) {
        let indice = "0"
        let placa = "A44"
        let resposta = await this.mensagemComRetorno(`B ${indice} ${placa};`)
        this.mensagemSemRetorno("ok;")
        console.log(resposta)
        console.log(resposta == "0" ? "Carro não é dessa vaga" : "Carro correto")
    }
    iniciarFluxoC(vaga) {
        this.mensagemSemRetorno(`C 0;`)
    }
    mensagemComRetorno(mensagem) {
        return new Promise((resolve, reject) => {
            try {
                fs.writeFileSync(this.arquivoRecebimentoMensagem, "")
                fs.writeFileSync(this.arquivoEnvioMensagem, mensagem)
                let resposta = ""
                const checarArquivo = () => {
                    fs.readFile(this.arquivoRecebimentoMensagem, "utf8", (erro, data) => {
                        if (erro) {
                            reject(`Erro ao ler arquivo ${erro}`)
                            return
                        }
                        if (this.debug) debugger
                        fs.writeFileSync(this.arquivoRecebimentoMensagem, "")
                        data = data.trim()
                        if (data[data.length - 1] == ";") {
                            resposta = data.substring(0, data.length - 1)
                            resolve(resposta)
                        } else checarArquivo()
                    })
                }
                checarArquivo()
            } catch (erro) {
                reject(`Erro ao mandar mensagem: ${erro}`)
            }
        })
    }
    mensagemSemRetorno(mensagem) {
        try {
            fs.writeFileSync(this.arquivoEnvioMensagem, mensagem)
        } catch (erro) {
            throw new Error(`Erro ao mandar mensagem: ${erro}`)
        }
    }
    escutarMensagens() {
        return new Promise((resolve, reject) => {
            try {
                let resposta = ""
                const checarArquivo = () => {
                    fs.readFile(this.arquivoRecebimentoMensagem, "utf8", (erro, data) => {
                        if (erro) {
                            reject(`Erro ao ler arquivo ${erro}`)
                            return
                        }
                        fs.writeFileSync(this.arquivoRecebimentoMensagem, "")
                        if (this.debug) debugger
                        data = data.trim()
                        if (data[data.length - 1] == ";") {
                            resposta = data.substring(0, data.length - 1)
                            const [comando, argumentos] = [resposta.split(" ")[0], resposta.split(" ").splice(1, resposta.length)]
                            const enviar = this.comandos[comando].acao(...argumentos)
                            if (enviar) fs.writeFileSync(this.arquivoEnvioMensagem, enviar)
                            if (this.comandos[comando].final) {
                                resolve()
                                return
                            }
                        }
                        checarArquivo()
                    })
                }
                checarArquivo()
            } catch (erro) {
                reject(`Erro ao mandar mensagem: ${erro}`)
            }
        })
    }
}
