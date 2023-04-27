const express = require("express")

const app = express()

// app.get("/", (req, res) => {
//     throw new Error("服务器内部出现错误！")
//     res.send("我是首页！")
// })

// app.use((err,req,res,next) => {
//     console.log("发生了错误！" + err.message);
//     res.send("Error:" + err.message)
// })

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.post("/user", (req, res) => {
    console.log(req.body)
    res.send("ok")
})

app.post("/book", (req, res) => {
    console.log(req.body)
    res.send("okay")
})

app.listen(7000, () => {
    console.log("Express服务器正运行在http://127.0.0.1:7000上！")
})
