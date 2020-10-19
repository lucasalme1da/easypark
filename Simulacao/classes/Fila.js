export default class Fila {
  constructor() {
    //O objetivo dessa classe é gerenciar as mensagens para que elas
    //não aconteçam ao mesmo tempo e dar prioridade para algumas acontecerem primeiro
    this.fila = []
    this.executarFila()
  }

  executar(vetorFuncoes, prioridade = 1) {
    return new Promise(resolve => {
      const lista = { vetorFuncoes, prioridade, resolvida: false, respostas: [] }
      this.fila.push(lista)
      const checarEstado = () => {
        if (lista.resolvida) {
          console.log(lista)
          resolve(lista.respostas)
          return
        }
        setTimeout(checarEstado, 16)
      }
      checarEstado()
    })
  }

  async executarFila() {
    if (this.fila.length !== 0) {
      const fila = [...this.fila]
      this.fila = []
      console.log(`Executando fila de taredas `, fila)
      fila.sort((a, b) => a.prioridade - b.prioridade)
      for (let indice = 0; indice < fila.length; indice++) {
        console.log(`Começando a executar lista de comandos `, fila[indice])
        for (let indiceFuncoes = 0; indiceFuncoes < fila[indice].vetorFuncoes.length; indiceFuncoes++) {
          try {
            console.log(`Executando tarefa ${indiceFuncoes} `, fila[indice].vetorFuncoes[indiceFuncoes])
            let resposta = await fila[indice].vetorFuncoes[indiceFuncoes]()
            console.log(`Tarefa ${indiceFuncoes} executada`)
            if (resposta !== undefined) fila[indice].respostas.push(resposta)
          } catch (erro) {
            throw new Error(`Erro ao executar fila de funções ${erro}, funcao: ${indiceFuncoes}, lista: ${indice}`)
          }
        }
        fila[indice].resolvida = true
        console.log(`Lista de comandos finalizada `, fila[indice])
      }
    }
    setTimeout(this.executarFila.bind(this), 16)
  }
}
