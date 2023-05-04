const express = require("express")

const app = express()

// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))

app.get("/api/jsonp", (req, res) => {
    const funcName = req.query.callback
    const data = { name: "蔡徐腾", age: 26 }
    const scriptStr = `${funcName}(${JSON.stringify(data)})`
    res.send(scriptStr)
})

const cors = require("cors")

app.use(cors())

const apiRouter = require("./编写GET和POST请求")

app.use("/api", apiRouter)

app.listen(5050, () => {
    console.log("Express服务正在运行在http://127.0.0.1:5050上")
})
