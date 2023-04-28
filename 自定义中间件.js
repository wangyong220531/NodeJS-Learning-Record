const express = require("express")

const qs = require("querystring")

const app = express()

const bodyParser = require("./custom-body-parser")

app.use(bodyParser)

app.post("/test", (req,res) => {
    res.send(req.body)
})

app.listen(6060, () => {
    console.log("Express服务正运行在http://127.0.0.1:6060上")
})
