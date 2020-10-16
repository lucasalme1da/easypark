const fs = require("fs")
const path = require("path")
export default class Comunicacao {
    constructor() {
        this.debug = false
        //Objeto para ficar armazenado o que fazer ao receber determinado comando
        //O comando deve retornar uma string que será escrita no arquivo de envio
        this.comandos = {}
        this.arquivoEnvioMensagem = path.resolve(__dirname, "..", "Software", "leitura")
        this.arquivoRecebimentoMensagem = path.resolve(__dirname, "..", "Software", "escrita")
        this.registrarComando("idle", () => console.log("O software está em espera"))
    }
    //O comando final encerra o escutarMensagens
    registrarComando(comando, acao, final = false) {
        this.comandos[comando] = { acao, final }
    }
    mensagemComRetorno(mensagem) {
        return new Promise((resolve, reject) => {
            console.log(`Enviando mensagem ${mensagem}. Aguardando retorno`)
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
                        data = data.trim()
                        if (data[data.length - 1] == ";") {
                            fs.writeFileSync(this.arquivoRecebimentoMensagem, "")
                            resposta = data.substring(0, data.length - 1)
                            console.log(`Mensagem Recebida ${resposta}`)
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
        return new Promise((resolve, reject) => {
            console.log(`Enviando mensagem ${mensagem}`)
            fs.writeFile(this.arquivoEnvioMensagem, mensagem, (erro, data) => {
                if (erro) {
                    reject(`Erro ao ler arquivo ${erro}`)
                    return
                }
                resolve()
            })
        })
    }
    escutarMensagens() {
        return new Promise((resolve, reject) => {
            try {
                console.log("Começando a escutar mensagens")
                let resposta = ""
                const checarArquivo = () => {
                    fs.readFile(this.arquivoRecebimentoMensagem, "utf8", (erro, data) => {
                        if (erro) {
                            reject(`Erro ao ler arquivo ${erro}`)
                            return
                        }
                        if (this.debug) debugger
                        data = data.trim()
                        if (data[data.length - 1] == ";") {
                            fs.writeFileSync(this.arquivoRecebimentoMensagem, "")
                            resposta = data.substring(0, data.length - 1)
                            console.log(`Mensagem recebida ${resposta}`)
                            const [comando, argumentos] = [resposta.split(" ")[0], resposta.split(" ").splice(1, resposta.length)]
                            const enviar = this.comandos[comando].acao(...argumentos)
                            if (enviar) fs.writeFileSync(this.arquivoEnvioMensagem, enviar)
                            if (this.comandos[comando].final) {
                                console.log("É a mensagem final")
                                resolve(argumentos)
                                return
                            }
                            console.log("Nao é a mensagem final")
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
