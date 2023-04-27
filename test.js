// const cstm = require("./customs")

// console.log(cstm);
// const cstm = require("./模块作用域")
// console.log(cstm);
// console.log(module);
// console.log( exports === module.exports);

const HandleDate = require("./handleDate")

const time = new Date()

console.log(HandleDate.handleDate(time))

