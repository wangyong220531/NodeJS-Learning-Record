import { error } from "console"
import { createTools } from "easy-mysql-tools"

type MyDatabase = {
    usersTable: {
        id: number
        name: string
        age: number
        status: 0 | 1
    }
}

const tools = createTools<MyDatabase>({
    host: "127.0.0.1",
    user: "root",
    password: "220531",
    database: "prisma"
})

const { insert, select, update, remove, count } = tools

// insert(
//     {
//         tableName: "usersTable",
//         data: {
//             name: "卡莎",
//             age: 6,
//             status: 1
//         }
//     },
//     (error, result, data) => {
//         error ? console.log(error) : console.log(data)
//     }
// )

// select({
//     tableName: "usersTable",
//     where: {
//         id: 1
//     }
// }).then(data => {
//     console.log(data)
// })

// update(
//     {
//         tableName: "usersTable",
//         data: {
//             name: "莉莉娅"
//         },
//         where: {
//             id: 3
//         }
//     },
//     (error, result, data) => {
//         error ? console.log(error) : console.log(data)
//     }
// )

// remove(
//     {
//         tableName: "usersTable",
//         where: {
//             name: "莉莉娅"
//         }
//     },
//     (error, result, data) => {
//         error ? console.log(error) : console.log(data)
//     }
// )

// count(
//     {
//         tableName: "usersTable",
//         where: {
//             status: 0
//         }
//     },
//     (error, result, data) => {
//         error ? console.log(error) : console.log(data)
//     }
// )
