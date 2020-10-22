import Toast from './Toaster.js'

const fs = require('fs')

const { cameras } = require("./data/infoCameras.json")

export default class CameraViewer {
  constructor({ manipulador, camera, controls, engine }) {

    this.manipuladorInput = manipulador
    this.camera = camera
    this.controls = controls
    this.engine = engine
    this.carViewer = false
    this.currentCarIndex = 0
    this.load()
  }

  load() {
    const goToPosition = number => {
      const camera = Object.values(cameras[number].camera)
      const controls = Object.values(cameras[number].controls)
      if (camera.toString() !== controls.toString()) {
        this.camera.position.set(...camera)
        this.controls.target.set(...controls)
        this.controls.update()

        console.log(`Exibindo camera ${number}`);
        new Toast({ message: `Exibindo camera ${number}` })
      } else {
        console.error('A posição da camera e dos controles não pode ser a mesma!')
        new Toast({ message: `A posição da camera e dos controles não pode ser a mesma!`, error: true })

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
      new Toast({ message: `Sobrescrita posição da camera ${number}` })
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

    this.manipuladorInput.Digit7 = this.toggleCarView
    this.manipuladorInput.Period = this.changeCarRight
    this.manipuladorInput.Comma = this.changeCarLeft


  }

  changeCarRight = () => {
    let cars = this.engine.getCars()
    if (cars.length > 1) {
      this.currentCarIndex === cars.length - 1 ?
        this.currentCarIndex = 0 :
        this.currentCarIndex++
      new Toast({ message: `Observando próximo carro` })
    } else {
      new Toast({ message: "Só há um carro para observar", error: true })
    }
  }

  changeCarLeft = () => {
    let cars = this.engine.getCars()
    if (cars.length > 1) {
      this.currentCarIndex === 0 ?
        this.currentCarIndex = cars.length - 1 :
        this.currentCarIndex--
      new Toast({ message: `Observando carro anterior` })
    } else {
      new Toast({ message: "Só há um carro para observar", error: true })
    }
  }

  changeCarLast = () => {
    this.currentCarIndex = this.engine.getCars().length - 1
  }

  updateCarViewer = async () => {
    if (this.carViewer) {
      let cars = this.engine.getCars()
      if (cars.length === 0) {
        new Toast({ message: `Nenhum carro para ser observado`, error: 1 })
        return this.carViewer = false
      }
      let car = this.engine.getCars()[this.currentCarIndex]
      this.controls.object.position.set(
        car.position.x - Math.sin(car.rotation.z) * 8,
        car.position.y + 5,
        car.position.z - Math.cos(car.rotation.z) * 8
      )
      this.controls.target.set(car.position.x, car.position.y, car.position.z)
      this.controls.update()

    }
  }

  toggleCarView = () => {
    this.carViewer = !this.carViewer
    this.carViewer ?
      this.engine.getCars().length !== 0 &&
      new Toast({ message: `Modo de visualização de carros ligado` }) :
      new Toast({ message: `Modo de visualização de carros desligado` })

  }

}