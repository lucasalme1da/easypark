require('./classes/OrbitControls.js')
import BuscaRota from './classes/BuscaRota.js'
import InterfaceAStar from './classes/InterfaceAStar.js'
import No from './classes/No.js'
const {
    WebGLRenderer,
    OrbitControls,
    Scene,
    PerspectiveCamera,
    AmbientLight,
    SpotLight,
    TextureLoader,
    Clock,
    Mesh,
    PlaneGeometry,
    MeshBasicMaterial,
    SphereBufferGeometry,
    DoubleSide
} = require('three')
export default class main {

    constructor() {
        this.buscaRota = new BuscaRota()

    }
    async load() {
            this.canvas = document.querySelector('#canvas')
            this.renderer = new WebGLRenderer()
            this.renderer.setPixelRatio(window.devicePixelRatio)
            this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
            this.canvas.appendChild(this.renderer.domElement)
            this.scene = new Scene()
            this.clock = new Clock()
            this.camera = new PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 1, 10000000)
            this.camera.position.set(0, 15, 5)
            this.camera.lookAt(0, 0, 0)
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.target.set(this.camera.position.x + .1, this.camera.position.y, this.camera.position.z);

            const ambientLight = new AmbientLight(0xffffff)
            this.scene.add(ambientLight)

            const spotLight = new SpotLight(0xffffff)
            spotLight.position.set(0, 100, 2)
            spotLight.castShadow = true
            this.scene.add(spotLight)

            //LOAD MODELOS
            var geometry = new PlaneGeometry(1000, 1000, 32)
            var material = new MeshBasicMaterial({
                color: 0xff0000,
                side: DoubleSide
            })

            this.plane = new Mesh(geometry, material)
            this.scene.add(this.plane)
            this.plane.rotation.x = 1.5
            this.plane.position.set(0, 0, 0)
            //Carregando interface
            this.nos = []
            this.interface = new InterfaceAStar({
                nomeAtributoPosicao: 'posicao',
                nomeAtributoConexoes: 'vizinhos',
                funcaoConectarNos: (primeiroNo,segundoNo) => {
                    primeiroNo.conectarNos(segundoNo)
                },
                funcaoAdicionaNos: (posicao) => {
                    const no = new No(posicao)
                    this.nos.push(no)
                    return no
                },
                nos: this.nos,
                camera: this.camera,
                cena: this.scene,
                base: this.plane,
            })
            // Modelo 360 do céu
            var loader = new TextureLoader();
            loader.load(
                'textures/skies/Sunset_Panorama_by_JohnnySasaki20.jpg',
                (texture)  => {
                    var material = new MeshBasicMaterial({
                        map: texture
                    });
                    var geometry = new SphereBufferGeometry(512, 512, 512);
                    geometry.scale(-1, 1, 1);
                    var sphere = new Mesh(geometry, material);
                    sphere.position.set(...this.camera.position.toArray())
                    this.scene.add(sphere);
                    this.renderer.render(this.scene, this.camera);
                },
                (err) => {
                    console.error('Erro ao carregar o céu.');
                }
            )
            

        this.animate()
    }
    animate() {
        this.renderer.render(this.scene, this.camera)
        this.controls.update()
        this.controls.rotateSpeed = -0.5
        this.controls.enableDamping = true
        requestAnimationFrame(this.animate.bind(this))
    }

}