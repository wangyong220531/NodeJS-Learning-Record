const mysql = require("mysql")

const db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "220531",
    database: "prisma"
})

// db.query("SELECT * FROM users", (err, res) => {
//     err ? console.log(err.message) : console.log(res)
// })

const insertData = { name: "蛮王", age: 222, status: 0 }

const sqlStr = "INSERT INTO users (name,age,status) VALUES (?,?,?)"

db.query(sqlStr, [insertData.name, insertData.age, insertData.status], (err, res) => {
    err ? console.log(err.message) : res.affectedRows === 1 ? console.log("插入成功！") : console.log("插入失败！")
})

// const insertData = { name: "蛮王", age: 222, sex: 0 }

// const sqlStr = "INSERT INTO users SET ?"

// db.query(sqlStr, insertData, (err, res) => {
//     err ? console.log(err.message) : res.affectedRows === 1 ? console.log("插入成功！") : console.log("插入失败！")
// })

// const insertData = { name: "酒桶", age: 222, sex: 0 }

// const sqlStr = "UPDATE users SET ? WHERE age=?"

// db.query(sqlStr, [insertData, insertData.age], (err, res) => {
//     err ? console.log(err.message) : res.affectedRows === 8 ? console.log("更新成功！") : console.log("更新失败！")
// })

// const sqlStr = "DELETE FROM users WHERE id=?"

// db.query(sqlStr, 13, (err, res) => {
//     err ? console.log(err.message) : res.affectedRows === 1 ? console.log("删除成功！") : console.log("删除失败！")
// })
