import ManipuladorInput from "./ManipuladorInput.js"
import GerenciadorNos from "./GerenciadorNos.js"
const { Vector3, Raycaster, LineBasicMaterial, Line, BufferGeometry, SphereGeometry, MeshBasicMaterial, Mesh, Vector2 } = require("three")
export default class InterfaceAStar {
    constructor({ nomeAtributoPosicao, nomeAtributoConexoes, funcaoConectarNos, funcaoRemoveNos, funcaoAdicionaNos, nos, camera, cena, base, canvas }) {
        // Arquitetura esperada recebida dos parametros do construtor:
        //  funcaoAdicionaNos([,,,]) Nó
        //  funcaoConectarNos(Nó,Nó) void
        //  atributoConexoes [Nó,Nó,...] nos conectados
        //  atributoPosicao vector3
        //  nos [Nó,Nó,...] todos os nós
        //  camera instancia de Camera do threejs
        //  cena instance de Scene do threejs

        if (typeof nomeAtributoPosicao != "string" || typeof nomeAtributoConexoes != "string") throw new Error("nomeAtributoPosicao e nomeAtributoConexoes devem ser strings")
        if (!(camera && cena)) throw new Error("Faltando o camera ou cena")
        if (!base) {
            throw new Error("Nenhum objeto base fornecido")
        }

        this.gerenciadorNos = new GerenciadorNos()
        this.funcaoConectarNos = this.gerenciadorNos.conectaNo
        this.funcaoAdicionaNos = this.gerenciadorNos.adicionaNo
        this.funcaoRemoveNos = this.gerenciadorNos.removeNo
        this.funcaoSalvaNos = this.gerenciadorNos.salvaNos
        this.nos = this.gerenciadorNos.nos

        this.camera = camera
        this.cena = cena
        //Base é objeto que servirá como um chão para o raycaster
        this.base = base
        this.canvas = canvas
        //Deve retornar um no

        this.nomeAtributoConexoes = nomeAtributoConexoes
        this.nomeAtributoPosicao = nomeAtributoPosicao
        this.linhas = []
        this.nos.forEach(no => {
            this.criarMesh(no)
        })
        this.iniciarLinhas()
        this.input = new ManipuladorInput()
        this.raycaster = new Raycaster()
        this.mouse = new Vector2()
        this.sensibilidadeMovemento = 1
        this.input.KeyQ = () => {
            this.sensibilidadeMovemento -= 0.1
            console.log(this.sensibilidadeMovemento)
        }
        this.input.KeyW = () => {
            this.sensibilidadeMovemento += 0.1
            console.log(this.sensibilidadeMovemento)
        }
        this.input.mousemove = event => this.updateMouse(event)
        this.input.click = () => this.ativarRaycaster()
        this.input.KeyN = () => this.trocarModo()
        this.input.KeyM = () => this.comutarVisibilidade()
        this.input.KeyC = () => this.conectarNosSelecionados()
        this.input.KeyS = () => this.funcaoSalvaNos()
        this.input.KeyD = () => this.clonarNosSelecionados()
        this.input.ArrowUp = () => this.moverNosSelecionados({ x: this.sensibilidadeMovemento })
        this.input.ArrowDown = () => this.moverNosSelecionados({ x: -this.sensibilidadeMovemento })
        this.input.ArrowRight = () => this.moverNosSelecionados({ z: this.sensibilidadeMovemento })
        this.input.ArrowLeft = () => this.moverNosSelecionados({ z: -this.sensibilidadeMovemento })
        // 0 - Adicionar Nó
        // 1 - Conectar Nós
        // 2 - info Nó
        this.modo = 2
        this.visibilidade = false
        this.nosParaConectar = []
        console.log(`
        Pressione N para trocar de modo:
            Modo 0: Adicionar Nó na posição do mouse ao clicar.
            Modo 1: Selecionar nós com o clique.
            Modo 2: Exibir informações do nó alvo do clique.
            Modo 3: O MODO MAIS PERIGOSO. Deleta um nó.
            Modo 4: Selecionar grupo
        
        Pressione M para trocar a visibilidade dos nós e conexões, por default eles não estão visíveis

        Pressione C para conectar nós previamente selecionados, se o número de nós selecionados for 2 
        eles serão conectados.

        Pressione S para salvas os nós.
        `)
    }
    comutarVisibilidade() {
        this.visibilidade = !this.visibilidade
        this.nos.forEach(no => {
            no.mesh.visible = this.visibilidade
        })
        this.linhas.forEach(linha => {
            linha.visible = this.visibilidade
        })
    }
    criarMesh(no) {
        const geometriaEsfera = new SphereGeometry(1, 12, 12)
        const materialEsfera = new MeshBasicMaterial({ color: 0x33ff99 })
        const mesh = new Mesh(geometriaEsfera, materialEsfera)
        mesh.dono = no
        no.mesh = mesh
        this.cena.add(mesh)
        mesh.position.copy(no[this.nomeAtributoPosicao])
        mesh.visible = this.visibilidade
    }
    trocarModo() {
        this.modo++
        if (this.modo > 4) this.modo = 0
        let textoInformativo
        switch (this.modo) {
            case 0:
                textoInformativo = "adicionar nó"
                break
            case 1:
                textoInformativo = "selecionar nó"
                break
            case 2:
                textoInformativo = "exibir info"
                break
            case 3:
                textoInformativo = "deletar nó"
                break
            case 4:
                textoInformativo = "selecionar em grupo"
                break
        }
        console.log(`Modo: ${this.modo}`, textoInformativo)
    }
    updateMouse(event) {
        this.mouse.x = (event.clientX / this.canvas.clientWidth) * 2 - 1
        this.mouse.y = -(event.clientY / this.canvas.clientHeight) * 2 + 1
    }
    clonarNosSelecionados() {
        if (!this.nosSelecionados) {
            console.log("Nenhum nó selecionado")
            return
        }
        const clones = []
        this.nosSelecionados.forEach(no => {
            const clone = this.gerenciadorNos.adicionaNo([...no.posicao.toArray()])
            this.criarMesh(clone)
            clones.push(clone)
        })
        this.nosSelecionados = clones
        console.log("Nós clonados")
    }
    moverNosSelecionados({ x, z }) {
        const vetor = new Vector3(x ? x : 0, 0, z ? z : 0)
        this.nosSelecionados.forEach(no => {
            no.posicao.add(vetor)
            no.mesh.position.add(vetor)
        })
    }
    ativarRaycaster() {
        switch (this.modo) {
            case 0:
                this.adicionarNovoNo()
                break
            case 1:
                this.conectarNos()
                break
            case 3:
                this.removerNo()
                break
            case 4:
                this.selecionarGrupo()
                break
            default:
                this.raycaster.setFromCamera(this.mouse, this.camera)
                const noMeshes = this.nos.map(no => no.mesh)
                const data = this.raycaster.intersectObjects(noMeshes)
                if (data[0] && data[0].object)
                    console.log(
                        `Nó: `,
                        this.nos.findIndex(no => no == data[0].object.dono),
                        data[0].object.dono,
                        data[0].object.dono.vaga ? `Vaga: ${data[0].object.dono.vaga.nome}` : ""
                    )
        }
    }
    removerNo() {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        const data = this.raycaster.intersectObjects(this.nos.map(no => no.mesh))
        if (data.length == 0) {
            console.log("Nenhum nó encontrado")
            return
        }
        const objeto = data[0].object
        //Remove no Gerenciador Nos
        this.funcaoRemoveNos(objeto.dono)
        //Remove na cena
        this.cena.remove(objeto)
        //Redesenhar linhas
        this.linhas.forEach(linha => this.cena.remove(linha))
        this.linhas = []
        this.iniciarLinhas()
    }
    adicionarNovoNo() {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        const data = this.raycaster.intersectObject(this.base)
        const ponto = data[0].point.toArray()
        const no = this.funcaoAdicionaNos([ponto[0], 0, ponto[2]])
        this.criarMesh(no)
        console.log(`Nó adicionado em (${ponto[0]},0,${ponto[2]})`)
    }
    estaEntre(ponto, ponto1, ponto2) {
        const estaEntreCordenada = cordenada => {
            return ponto[cordenada] > Math.min(ponto1[cordenada], ponto2[cordenada]) && ponto[cordenada] < Math.max(ponto1[cordenada], ponto2[cordenada])
        }
        return estaEntreCordenada("x") && estaEntreCordenada("z")
    }
    selecionarGrupo() {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        const data = this.raycaster.intersectObject(this.base)
        const ponto = data[0].point.toArray()
        if (!this.ponto1) {
            this.ponto1 = new Vector3(...ponto)
            console.log("Ponto 1 selecionado: ", this.ponto1, " selecione o ponto 2")
            return
        }
        this.nosSelecionados = this.nos.filter(no => this.estaEntre(no.posicao, this.ponto1, new Vector3(...ponto)))
        console.log("Nós selecionados: ", this.nosSelecionados)
        console.log("Setas para movelos e D para clonar")
        this.ponto1 = undefined
    }
    conectarNos() {
        if (this.visibilidade == false) this.comutarVisibilidade()
        this.raycaster.setFromCamera(this.mouse, this.camera)
        const data = this.raycaster.intersectObjects(this.nos.map(no => no.mesh))
        if (data.length == 0) {
            console.log("Nenhum nó encontrado")
            return
        }
        const objeto = data[0].object
        if (this.nosParaConectar.length == 0) {
            this.nosParaConectar.push(objeto.dono)
            objeto.material.color.setHex(0xfff000)
            console.log("Primeiro nó ", objeto.dono, ". Selecione o segundo...")
        } else if (this.nosParaConectar.length == 1) {
            this.nosParaConectar.push(objeto.dono)
            objeto.material.color.setHex(0xfff000)
            console.log("Segundo nó ", objeto.dono, ". Precione C para conectar os nós selecionados ou clique em qualquer lugar para cancelar.")
        } else {
            this.nosParaConectar.forEach(no => no.mesh.material.color.setHex(0x33ff99))
            this.nosParaConectar = []
            console.log("Conexão cancelada. Comece de novo")
        }
    }
    conectarNosSelecionados() {
        if (this.nosParaConectar.length != 2) {
            console.log("Selecione dois nós.")
            return
        }
        const [primeiroNo, segundoNo] = this.nosParaConectar
        this.funcaoConectarNos(primeiroNo, segundoNo)
        this.nosParaConectar.forEach(no => no.mesh.material.color.setHex(0x33ff99))
        this.nosParaConectar = []
        this.desenharLinha(primeiroNo[this.nomeAtributoPosicao], segundoNo[this.nomeAtributoPosicao], this.cena)
        console.log("Nós conectados ", primeiroNo, segundoNo)
    }
    iniciarLinhas() {
        this.nos.forEach(no => {
            let linha
            no[this.nomeAtributoConexoes]
                .map(noDistancia => noDistancia.no)
                .forEach(noConectado => {
                    linha = this.desenharLinha(no[this.nomeAtributoPosicao].clone(), noConectado[this.nomeAtributoPosicao].clone(), this.cena)
                })
        })
    }
    desenharLinha(ponto1, ponto2, cena) {
        const material = new LineBasicMaterial({ color: 0xff00ff })

        const pontos = []
        pontos.push(ponto1)
        pontos.push(ponto2)

        const geometria = new BufferGeometry().setFromPoints(pontos)

        const linha = new Line(geometria, material)
        linha.visible = this.visibilidade
        cena.add(linha)
        this.linhas.push(linha)
        return linha
    }
}
