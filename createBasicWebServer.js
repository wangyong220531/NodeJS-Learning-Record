const { log } = require("console")
const http = require("http")

const server = http.createServer()

server.on("request", (req, res) => {
    const url = req.url
    switch (url) {
        case "/":
            content = "<h1>我是首页</h1>"
            break
        case "/index.html":
            content = "<h1>我是首页</h1>"
            break
        case "/about.html":
            content = "<h1>我是关于页</h1>"
            break
        default:
            content = "<h1>404</h1>"
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.end(content)
})

server.listen(5000, () => {
    log("服务器运行在http://127.0.0.1:5000")
})
