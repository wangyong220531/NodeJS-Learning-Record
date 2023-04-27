const express = require("express")

const app = express()

const mw1 = (req, res, next) => {
    console.log("我是自定义的第一个局部中间件！")
    next()
}

const mw2 = (req, res, next) => {
    console.log("我是自定义的第二个局部中间件！")
    next()
}

app.get("/home", (req, res) => {
    res.send("我是首页！")
})

app.get("/about", [mw1, mw2], (req, res) => {
    res.send("我市关于页！")
})

app.listen(1000, () => {
    console.log("Express服务运行在http://127.0.0.1:1000上！")
})
