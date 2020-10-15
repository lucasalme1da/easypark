export default class ManipuladorInput {
  constructor() {

    this.body = document.querySelector('body')
    this.body.addEventListener('keydown', this.handleKey.bind(this))
    this.body.addEventListener('mousemove', this.handleMouseMove.bind(this), false)
    this.body.addEventListener('click', this.handleClick.bind(this), false)
    const inputs = this.body.querySelectorAll('input[type="text"]')
    this.ignoreInputs = false
    this.focusElement = null
    inputs.forEach(input => {
      const blur = () => {
        this.ignoreInputs = false
        input.removeEventListener('blur', blur)
      }
      input.addEventListener('focus', (() => {
        this.focusElement = input
        this.ignoreInputs = true
        input.addEventListener('blur', blur.bind(this))
      }).bind(this))
    })

  }

  handleClick(event) {
    if (this.click)
      this.click(event)
  }

  handleMouseMove(event) {
    if (this.mousemove)
      this.mousemove(event)
  }

  handleKey(event) {
    if (this[`${event.code}`] && !this.ignoreInputs)
      this[`${event.code}`]()
  }
}