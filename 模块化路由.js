const express = require("express")

const router = express.Router()

router.get("/login", (req, res) => {
    res.send("nb")
})

router.post("/nb", (req, res) => {
    res.send("666")
})

module.exports = router
