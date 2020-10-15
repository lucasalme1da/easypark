export default class BuscaRota {
  constructor(noInicial) {
    this.noInicial = noInicial
    this.listaAberta = []
    this.listaFechada = []
  }

  encontrarMenorValor() {
    let menorValor = {
      indice: 0,
      distancia: this.listaAberta[0].distancia,
    }
    for (let i = 0; i < this.listaAberta.length; i++) {
      if (this.listaAberta[i].distancia < menorValor.distancia) {
        menorValor = {
          indice: i,
          distancia: this.listaAberta[i].distancia,
        }
      }
    }
    return menorValor
  }

  construirCaminho() {
    const caminhoFinal = []
    let ultimoNo = this.listaFechada[this.listaFechada.length - 1]
    while (ultimoNo.noAnterior != null) {
      caminhoFinal.unshift(ultimoNo.no) // unshift() - Add o elemento no início do array e retorna length atualizado.
      ultimoNo = this.listaFechada[ultimoNo.indiceNoAnterior]
    }
    caminhoFinal.unshift(this.noInicial)
    this.listaFechada = caminhoFinal
  }

  irProximoNo(no) {
    this.listaAberta.push({
      noAnterior: null,
      no: this.noInicial,
      distanciaNo: 0,
      distancia: this.noInicial.posicao.distanceTo(no.posicao),
    })
    let encontrarCaminho = true
    while (encontrarCaminho) {
      encontrarCaminho = this.expandirNo(no)
    }
    this.construirCaminho()
    return this.listaFechada
  }

  expandirNo(noEmExpansao) {
    if (this.listaAberta.length === 0) return false
    const { indice } = this.encontrarMenorValor()
    const obterInfo = this.listaAberta[indice]
    const obterNo = this.listaAberta[indice].no

    if (obterNo === noEmExpansao) {
      this.listaFechada.push(obterInfo)
      this.listaAberta = []
      return false
    }
    obterNo.vizinhos.forEach(vizinho => {
      const { no, distancia } = vizinho
      if (obterInfo.noAnterior && no == obterInfo.noAnterior) return
      this.listaAberta.push({
        noAnterior: obterNo,
        indiceNoAnterior: this.listaFechada.length,
        no,
        distanciaNo: obterInfo.distanciaNo + distancia,
        distancia: obterInfo.distanciaNo + distancia + no.posicao.distanceTo(noEmExpansao.posicao),
      })
    })
    this.listaFechada.push(obterInfo)
    this.listaAberta.splice(indice, 1)
    return true
  }
}
