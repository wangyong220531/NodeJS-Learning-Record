const { log } = require("console")

const http = require("http")

const server = http.createServer()

const path = require("path")

const fs = require("fs")

server.on("request", (req, res) => {
    const url = req.url
    let fPath = ""
    if (url === "/") {
        fPath = path.join(__dirname, "/index.html")
    } else {
        fPath = path.join(__dirname, "/File" + url)
    }
    fs.readFile(fPath, "utf-8", (err, dataSrc) => {
        err ? res.end("404") : res.end(dataSrc)
    })
    res.setHeader("Content-Type", "text/html; charset=utf-8")
})

server.listen(5000, () => {
    log("服务器运行在http://127.0.0.1:5000")
})
