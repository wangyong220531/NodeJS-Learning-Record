const express = require("express")

const handleDate = require("./handleDate")

const app = express()

// const mw = (req, res, next) => {
//     console.log("我是一个自定义中间件！")
//     next()
// }

app.use((req, res, next) => {
    console.log("我是第一个自定义中间件！")
    const startTime = handleDate.handleDate(Date.now())
    req.startTime = startTime
    next()
})

app.use((req,res,next) => {
    console.log("我是第二个自定义全局中间件！");
    next()
})

app.get("/home", (req, res) => {
    console.log("您访问了/home!")
    res.send("我是首页！" + req.startTime)
})

app.get("/user", (req, res) => {
    console.log("您访问了/user!")
    res.send("我是用户页！" + req.startTime)
})

app.listen(9090, () => {
    console.log("Express服务运行在http://127.0.0.1:9090上！")
})
