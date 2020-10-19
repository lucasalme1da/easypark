const fs = require('fs')

const { cameras } = require("./data/infoCameras.json")

export default class CameraViewer {
  constructor({ manipulador, camera, controls }) {

    this.manipuladorInput = manipulador
    this.camera = camera
    this.controls = controls

    this.load()
  }

  load() {
    const goToPosition = number => {
      const camera = Object.values(cameras[number].camera)
      const controls = Object.values(cameras[number].controls)
      if (camera.toString() !== controls.toString()) {
        this.camera.position.set(...camera)
        this.controls.target.set(...controls)
        console.log(`Exibindo camera ${number}`);
      } else {
        console.error('A posição da camera e dos controles não pode ser a mesma!')
      }
    }

    const save = (number) => {
      const data = {
        cameras: { ...cameras, }
      }

      data.cameras[`${number}`].camera = { ...this.camera.position }
      data.cameras[`${number}`].controls = { ...this.controls.target }

      !!data &&
        fs.writeFile('./data/infoCameras.json', JSON.stringify(data), () => { })

      console.log(`Sobrescrita posição da camera ${number}`);
      reset()
    }

    const savePosition = () => {
      this.manipuladorInput.Digit1 = () => save(1)
      this.manipuladorInput.Digit2 = () => save(2)
      this.manipuladorInput.Digit3 = () => save(3)
      this.manipuladorInput.Digit4 = () => save(4)
      this.manipuladorInput.Digit5 = () => save(5)
      this.manipuladorInput.Digit6 = () => save(6)
    }

    const reset = () => {
      this.manipuladorInput.Digit1 = () => goToPosition(1)
      this.manipuladorInput.Digit2 = () => goToPosition(2)
      this.manipuladorInput.Digit3 = () => goToPosition(3)
      this.manipuladorInput.Digit4 = () => goToPosition(4)
      this.manipuladorInput.Digit5 = () => goToPosition(5)
      this.manipuladorInput.Digit6 = () => goToPosition(6)
    }

    reset()

    this.manipuladorInput.ControlLeft = () => savePosition()
  }


}