export default class Display {
  constructor() {
    const $ = document.querySelector.bind(document)
    this.elements = [$("#result"), $("#loading"), $("#welcome"), $("#semVaga")]
    this.resultH1 = $("#result h1")
    this.botoes = Array.from($(".button-list").children)
    this.canTouch = true
    this.selected = -1
    this.botoes.forEach((botao, indice) => {
      botao.onclick = () => {
        console.log("botao ", indice)
        if (this.canTouch) {
          this.selected = indice
        }
      }
    })
  }
  waitTouch() {
    return new Promise(resolve => {
      const checkSelectedButton = () => {
        if (this.selected != -1) {
          resolve(this.selected)
          this.selected = -1
          this.canTouch = false
          return
        }
        setTimeout(checkSelectedButton, 16)
      }
      checkSelectedButton()
    })
  }

  show(elementToShow) {
    this.elements.forEach(element => (element.id === elementToShow ? element.classList.add("show") : element.classList.remove("show")))
  }

  exibeVaga(destino) {
    if (destino.trim() !== "") {
      this.resultH1.innerHTML = destino
      destino === 'nao' ?
        this.show("semVaga") :
        this.show("result")
    }
  }

  resetaDisplay() {
    this.show("welcome")
  }
}
