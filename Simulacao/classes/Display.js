export default class Display {
  constructor() {
    const $ = document.querySelector.bind(document)
    this.elements = [$("#result"), $("#loading"), $("#welcome")]
    this.resultH1 = $("#result h1")
  }

  show(elementToShow) {
    this.elements.forEach(element => element.id === elementToShow ?
      element.classList.add('show') : element.classList.remove('show')
    )
  }

  exibeVaga(destino) {
    if (destino.trim() !== '') {
      this.show('loading')
      setTimeout(() => {
        this.show('result')
        this.resultH1.innerHTML = destino
      }, 1500)
    }
  }

  resetaDisplay() {
    this.show('welcome')
  }
}

