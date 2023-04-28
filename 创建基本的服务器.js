const express = require("express")

const app = express()

const apiRouter = require("./apiRouter")

app.use(apiRouter)

app.listen(5050,() => {
    console.log();
})
