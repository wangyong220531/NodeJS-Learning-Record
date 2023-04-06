const fs = require("fs")

// fs.readFile("./test.txt", "utf8", (err, dataSrc) => {
//     err ? console.log("读取文件失败" + err.message) : console.log("读取文件成功！" + dataSrc)
// })

// fs.writeFile("./test.txt", "菜徐腾真有钱，天天喝星巴克！", err => {
//     err ? console.log("文件写入失败！" + err.message) : console.log("文件写入成功！")
// })

fs.readFile("./test.txt", "utf8", (err, dataSrc) => {
    if (err) {
        return console.log("读取文件错误！" + err.msg)
    }
    const oldData = dataSrc
        .split(" ")
        .map(e => {
            return e.replace("=", ": ")
        })
        .join("\r\n")

    fs.writeFile("./testOk.txt", oldData, err => {
        err ? console.log("文件写入失败！" + err.message) : console.log("文件写入成功！")
    })
})
