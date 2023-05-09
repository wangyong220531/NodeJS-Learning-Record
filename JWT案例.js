const express = require("express")
const app = express()

app.use(express.urlencoded({ extended: false }))

const jwt = require("jsonwebtoken")
const expressJWT = require("express-jwt")

const secretKey = "AK103220531"

const cors = require("cors")
app.use(cors())

app.post("/api/login", (req, res) => {
    const userInfo = req.body
    if (userInfo.username !== "admin" || userInfo.password !== "123456") {
        return res.send({
            status: 1,
            success: false,
            msg: "登录失败！"
        })
    }
    const tokenStr = jwt.sign({ username: userInfo.username }, secretKey, { expiresIn: "30s" })
    res.send({
        status: 0,
        success: true,
        msg: "登录成功！",
        token: tokenStr
    })
})

app.use(expressJWT({ secret: secretKey }).unless({ path: [/^\/api\//] }))

app.get("/getUser", (req, res) => {
    res.send({
        status: 0,
        msg: "获取用户信息成功！",
        data: req.user
    })
})

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        return res.send({
            status: 401,
            msg: "无效的token"
        })
    }
    res.send({
        status: 500,
        msg: "未知错误"
    })
})

const apiRouter = require("./编写GET和POST请求")
app.use("/api", apiRouter)

app.listen(9090, () => {
    console.log("Express服务正运行在http://127.0.0.1:9090上")
})
