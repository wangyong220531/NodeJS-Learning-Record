const { log } = require("console")

const fs = require("fs")

const path = require("path")

const regStyle = /<style>[\s\S]*<\/style>/

const regScript = /<script>[\s\S]*<\/script>/

fs.readFile(path.join(__dirname, "index.html"), "utf8", (err, dataSrc) => {
    err ? console.log("读取文件失败！" + err.message) : console.log("读取文件成功！", resolveCSS(dataSrc), resolveJS(dataSrc), resolveHTML(dataSrc))
})

const resolveCSS = e => {
    const newCSS = regStyle.exec(e)[0].replace("<style>", "").replace("</style>", "")
    fs.writeFile(path.join(__dirname, "/File/index.css"), newCSS, err => {
        err ? console.log("写入CSS失败！" + err.message) : console.log("写入CSS成功！")
    })
}

const resolveJS = e => {
    const newJS = regScript.exec(e)[0].replace("<script>", "").replace("</script>", "")
    fs.writeFile(path.join(__dirname, "/File/index.js"), newJS, err => {
        err ? console.log("写入JS失败！" + err.message) : console.log("写入JS成功！")
    })
}

const resolveHTML = e => {
    const newHTML = e.replace(regStyle, "<link rel='stylesheet' href='./index.css'/>").replace(regScript, "<script src='./index.js'><script/>")
    fs.writeFile(path.join(__dirname + "/File/index.html"), newHTML, err => {
        err ? log("写入HTML失败！" + err.message) : log("写入HTML成功！")
    })
}
