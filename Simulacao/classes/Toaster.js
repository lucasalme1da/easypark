export default class Toast {
  constructor({ message, error }) {
    this.toastContainer = document.querySelector('#toast-container')
    this.toastContent = document.createElement('p')
    this.toastClose = document.createElement('h3')
    this.toast = document.createElement("div")
    this.load(message, error)
  }

  load(content, error) {
    this.toastContent.innerText = content
    this.toastClose.innerText = "X"
    this.toastClose.onclick = this.handleClose
    this.toast.classList.add('toast')
    error &&
      this.toast.classList.add('toast-error')
    this.toast.appendChild(this.toastContent)
    this.toast.appendChild(this.toastClose)
    this.toastContainer.appendChild(this.toast)
    console.log(this.toastContainer, this.toast)
    setTimeout(this.handleClose, 3000)
  }

  handleClose = () => {
    this.toast.classList.add('toast-close')
    setTimeout(() => {
      if ([...this.toastContainer.children].includes(this.toast))
        this.toastContainer.removeChild(this.toast)
    }, 400)
  }
}