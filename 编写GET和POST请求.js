const express = require("express")

const router = express.Router()

router.get("/getList", (req, res) => {
    const query = req.query
    res.send({
        status: 0,
        msg: "获取成功！",
        data: query
    })
})

router.post("/getList2", (req, res) => {
    const body = req.body
    res.send({
        status: 0,
        success: true,
        msg: "POST请求成功！",
        data: body
    })
})

router.post("/login", (req, res) => {
    req.username !== "admin" || req.password !== "123456"
        ? res.send({
              status: 1,
              success: false,
              msg: "登陆失败！"
          })
        : (req.session.username === req.body,
          (req.session.isLogin = true),
          res.send({
              status: 0,
              success: true,
              msg: "登陆成功！"
          }))
})

module.exports = router
