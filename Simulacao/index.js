const electron = require("electron")
const { execSync, spawn } = require("child_process")
const path = require("path")
const fs = require("fs")
const os = process.platform
const log = path.resolve("..", "Software", "log")
const executavel = os == "linux" ? "./main" : "main.exe"
try {
    console.log("\nCompilando software...")
    execSync("cd ../Software && gcc -o main *.c Modulos/le_arquivos/le_arquivos.c Modulos/exibe_info/exibe_info.c Modulos/verifica_vaga/verifica_vaga.c Modulos/verifica_tag/verifica_tag.c Modulos/le_input/le_input.c Modulos/comunicacao/comunicacao.c Modulos/calcula_vaga/calcula_vaga.c -lm")
    console.log(`\nSoftware Compilado. Executando ${executavel}`)
    const software = spawn(executavel, { cwd: path.resolve("..", "Software") })
    console.log("PID Software: ", software.pid)
    console.log("PID Simulacao: ", process.pid)
    software.stdout.on("data", data => {
        console.log(data.toString())
    })

    software.stderr.on("data", data => {
        console.error(data.toString())
    })

    software.on("close", codigo => {
        console.log(`Processo parou com código ${codigo}`)
    })
    software.on("error", erro => {
        console.error("Erro ao executar main \n", erro)
    })
    process.on("exit", () => {
        console.log("Fechando processo ", software.pid)
        software.kill()
    })
} catch (erro) {
    console.log("\nErro executando o software \n", erro, erro.stdout)
    process.exit(1)
}

require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
    ignored: /data|[\/\\]\./,
})
const url = require("url")

const { app, BrowserWindow, Menu } = electron
let mainWindow
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        },
    })
    mainWindow.loadURL(`file://${__dirname}/index.html`)

    mainWindow.maximize()

    const menu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(menu)
})

const mainMenuTemplate = [
    {
        label: "Devtool",
        accelerator: "Ctrl+D",
        click() {
            mainWindow.webContents.openDevToosoftware()
        },
    },
    {
        label: "Reload",
        accelerator: "Ctrl+R",
        click() {
            mainWindow.reload()
        },
    },
]
