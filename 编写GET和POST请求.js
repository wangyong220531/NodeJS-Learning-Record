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

module.exports = router
