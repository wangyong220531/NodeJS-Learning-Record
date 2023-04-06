const path = require("path")

// const pathstr =  path.join("/a/e","../../b","/c")

const fpath = "./a/b/index.js"

console.log(path.basename(fpath,".js"));