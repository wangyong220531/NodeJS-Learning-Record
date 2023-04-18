const resData = [
    {
        id: 0,
        name: "A模块",
        children: [
            {
                id: 00,
                name: "A的子模块A-0",
                children: [
                    {
                        id: 000,
                        name: "新增"
                    },
                    {
                        id: 001,
                        name: "编辑"
                    }
                ]
            },
            {
                id: 01,
                name: "A的子模块A-1",
                children: [
                    {
                        id: 010,
                        name: "A-1的子模块A-1-0",
                        children: [
                            {
                                id: 0100,
                                name: "新增"
                            },
                            {
                                id: 0101,
                                name: "编辑"
                            },
                            {
                                id: 0102,
                                name: "删除"
                            }
                        ]
                    },
                    {
                        id: 011,
                        name: "A-1的子模块A-1-1",
                        children: [
                            {
                                id: 0110,
                                name: "编辑"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 1,
        name: "B模块",
        children: [
            {
                id: 10,
                name: "B模块的子模块B-0",
                children: [
                    {
                        id: 100,
                        name: "新增"
                    },
                    {
                        id: 101,
                        name: "编辑"
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        name: "C模块"
    }
]

const recursive = data => {
    return data.map(e => {
        if (e.children && e.children.length) {
            return {
                key: e.id,
                title: e.name,
                children: recursive(e.children)
            }
        }
        return {
            key: e.id,
            title: e.name
        }
    })
}

const data = JSON.stringify(recursive(resData))

const fs = require("fs")

fs.writeFile(__dirname + "/File/result.json", data, err => {
    err ? console.log(err.message + "写入失败！") : console.log("写入成功！")
})
