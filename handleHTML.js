const fs = require("fs")

const path = require("path")

const regStyle = /<style>[\s\S]*<\/style>/

const regScript = /<script>[\s\S]*<\/script>/

fs.readFile(path.join(__dirname,"index.html"),"utf8",(err,dataSrc) => {
    err ? console.log("读取文件失败！"+err.message) : console.log("读取文件成功！" + dataSrc);
})

