const age = 23

exports.usrname = "AK-103"

exports.ak = () => {
    console.log("我是：" + usrname)
}

exports.age = age

exports = {
    username: "AK-102",
    age: 23,
    sayHi: () => {
        console.log("你好！我是：" + username)
    }
}
