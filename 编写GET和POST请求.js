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

// router.post("/login", (req, res) => {
//     if (req.body.username !== "admin" || req.body.password !== "123456") {
//         return res.send({
//             status: 1,
//             success: false,
//             msg: "登录失败！"
//         })
//     }
//     req.session.username = req.body.username
//     req.session.isLogin = true
//     res.send({
//         status: 0,
//         success: true,
//         msg: "登录成功！"
//     })
// })

router.get("/getUsername", (req, res) => {
    if (!req.session.isLogin) {
        return res.send({
            status: 1,
            success: false,
            msg: "获取失败！"
        })
    }
    res.send({
        status: 0,
        success: true,
        msg: "获取成功！",
        // username: req.session.username
        data: req.user
    })
})

router.post("/logout", (req, res) => {
    req.session.destroy()
    res.send({
        status: 0,
        success: true,
        msg: "退出登录成功！"
    })
})

module.exports = router
