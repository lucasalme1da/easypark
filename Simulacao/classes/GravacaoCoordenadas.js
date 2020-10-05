const fs = require('fs')

export default class GravacaoCoordenadas {

  constructor(nos) {
    this.nos = nos
  }

  gravar(tipo, e) {
    e.preventDefault()
    let contador = 1
    let coordenadas = this.nos.map(no => {
      return [
        `a${contador > 9 ? contador : '0' + contador}`,
        no.posicao.x,
        no.posicao.z,
        0,
        contador++ - 1,
        -1
      ].join(' ')
    }
    ).join('\n')

    fs.writeFileSync(`./data/${tipo}.txt`, coordenadas === '' ? 'Arquivo Vazio' : coordenadas)
  }
}