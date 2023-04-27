const express = require("express")
const app = express()
const router =  require("./模块化路由")

app.use(router)

app.listen(8080,() => {
    console.log("express server running on port 8080!");
})