const express = require("express")

const app = express()

const apiRouter = require("./apiRouter")

app.use(apiRouter)

app.listen(5050,() => {
    console.log("Express服务正在运行在http://127.0.0.1:5050上");
})
