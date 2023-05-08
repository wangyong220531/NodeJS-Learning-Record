# Easy-MySQL-Tools

## 介绍

`MySQL` 常用的增删改查工具合集，提升 `MySQL` 在 `TypeScript` 中的使用体验

1. 基于 [TypeScript](https://www.npmjs.com/package/typescript) 和 [MySQL2](https://www.npmjs.com/package/mysql2)
2. 包含了简单的增删改查等基本功能
3. 使用了 `MySQL2`模块 的 `escape` 功能，避免注入
4. 根据数据库的类型，自动生成查询的配置以及结果类型，也就是让 `TypeScript` 识别出查询的结果类型，而非一直是 `any`

## 安装

```shell
yarn add easy-mysql-tools
# 或者
npm i easy-mysql-tools
```

## 使用

简单三个步骤：

1. 使用 `type` 定义你的数据库结构，**不要使用 `interface`**
2. 使用 `createTools` 创建查询工具合集
3. 使用 `insert`、`select`、`update`、`remove`、`count`等五种方法进行查询

注意：**使用 `createTools` 时必须提供数据库的类型，否则这个模块便失去了意义**

```typescript
import { createTools } from "easy-mysql-tools"

// 定义你的数据库结构，不要使用 interface
type MyDatabase = {
    userTable: {
        id: number,
        username: string,
        age: number,
        phone: number,
        email: string,
        intrd?: string
    },
    articleTable: {
        id: number,
        title: string,
        content: string
    }
}

// 配置同 MySQL2 的配置
// 必须提供数据库的类型，否则这个模块便失去了意义
const tools = createTools<MyDatabase>({
    host: "x.x.x.x",
    user: "root",
    password: "password",
    database: "mydatabase"
})

// 取出五种方法
const { insert, select, update, remove, count } = tools

// 使用 select 方法
select({
    // 这里会自动提供所有的表名供你使用
    tableName: "userTable",
    // 这里会自动提供已选表所有的字段供你使用
    where: {
        // 你可以直接提供一个值，表示等于的情况
        id: 123,
        // 也可以使用对象来表示，小于大于等比较运算符
        age: {
            equal: ">=",
            value: 18
        },
        intrd: {
            equal: "!=",
            value: null
        }
    },
    order: {
        // 这里会自动提供已选表所有的字段供你使用
        field: "age",
        // desc 或者 asc，默认为 asc
        method: "desc"
    },
    limit: {
        offset: 6,
        count: 2
    },
    // 这里会自动提供已选表所有的字段供你使用
    // 如果你使用 whiteList，只会选取列表中字段
    whiteList: ["id", "username", "email"],
    // 如果你想要将 MySQL 返回的 null 数据自动转换为 undefined，可以开启这一项，默认不开启
    transformNullToUndefined: true
}).then(data => {
    // TypeScript 可以自动识别出查询 data 的类型
    typeof data = {
        id: number,
        username: string,
        email: string
    }
})
```

`insert`、`select`、`update`、`remove`、`count` 五个方法的使用方式均一样，传入一个配置文件即可，比如 `count(config)`

## 配置

```typescript
type QueryConfig = {
    tableName: TableName,
    data?: Data,
    where?: Where,
    order?: Order,
    limit?: Limit,
    whiteList?: WhiteList,
    transformNullToUndefined?: TransformNullToUndefined
}
```

### tableName

```typescript
type TableName = "userTable" | "articleTable"
```

**必填项**，类型为传入的数据库类型的所有数据表表名

### data

```typescript
type Data = {
    [Key in keyof MyDatabase["userTable"]]?: MyDatabase["userTable"][Key] | null
}
```

可选项，在 `insert` 方法中，`data` 便是新增记录的数据，在 `update` 方法中，`data` 便是希望符合条件数据更新之后变成的值

### where

```typescript
type SingleWhere = {
    [Key in keyof MyDatabase["userTable"]]: MyDatabase["userTable"][Key] | null | {
        equal: "<" | "<=" | "=" | "!=" | ">=" | ">",
        value: MyDatabase["userTable"][Key]
    }
}

type Where = SingleWhere | SingleWhere[]
```

可选项，有两种形式，对于单个查询条件来说（`where` 是一个 `SingleWhere` 对象），键名为已选数据库的字段，**每个字段之间的关系是 `且` 或者说 `And`**，键值有两种形式

1. 直接提供一个值，表示等于的情况

    ```typescript
    const config = {
        tableName: "userTable",
        where: {
            id: 123,
            age: 18
        }
    }
    ```

    此时表示，查询 `id` 等于 `123` **且** `age` 等于 `18` 的数据。对于键值为 `null` 的情况，会自动转换为 `id is null`

2. 使用对象来表示，小于大于等比较运算符

    ```typescript
    const config = {
        tableName: "userTable",
        where: {
            id: {
                equal: "<=",
                value: 123
            }
        }
    }
    ```

    `equal` 的类型为 `"<" | "<=" | "=" | "!=" | ">=" | ">"`，此时表示，查询 `id` 小于等于 `123` 的数据。

    对于键值为 `null` 的情况

    如果比较运算符为 `=`，则视为 `id is null`

    如果比较运算符为 `"<" | "!=" | ">"`，则视为 `id is not null`

    如果比较运算符为 `"<=" | ">="`，则忽略这一条件。

当然，你可以提供多个查询条件（`where` 是一个 `SingleWhere[]` 数组），**每个条件之间的关系是 `或` 或者说 `Or`**

```typescript
{
    where: [
        { id: 1 },
        { age: { equal: ">=", value: 18 } }
    ]
}
```

上述代码代表，查询 `id` 为 `1` **或者** `age` 大于等于 `18` 的记录

### order

```typescript
type SingleOrder = {
    field: keyof MyDatabase["userTable"],
    // 默认为 asc
    method?: "asc" | "desc"
}

type Order= SingleOrder | SingleOrder[]
```

可选项，默认排序方式为 `asc`，可以是单个排序方式，也可以是多个排序方式组成的数组

### limit

```typescript
type Limit = {
    offset?: number,
    count: number
}
```

可选项，`offset` 默认为 0

### whiteList

```typescript
type WhiteList = (keyof MyDatabase["userTable"])[]
```

可选项，指定提取出来的字段，默认为全部字段

### transformNullToUndefined

```typescript
type TransformNullToUndefined = boolen
```

可选项，是否将结果中的所有 `null` 转换为 `undefined`，默认不开启

## 方法

所有的方法都在由 `createTools` 创建的对象中，使用 `createTools` 必须提供泛型参数以及函数参数。泛型为你的数据库类型（**不要使用 interface，请使用 type 定义**），函数参数同 `MySQL2` 的配置

```typescript
import { createTools } from "easy-mysql-tools"

// 定义你的数据库结构，不要使用 interface
type MyDatabase = {
    userTable: {
        id: number,
        username: string,
        age: number,
        phone: number,
        email: string,
        intrd?: string
    },
    articleTable: {
        id: number,
        title: string,
        content: string
    }
}

// 配置同 MySQL2 的配置，传入数据库类型以及数据库配置
// 必须提供数据库的类型，否则这个模块便失去了意义
const tools = createTools<MyDatabase>({
    host: "x.x.x.x",
    user: "root",
    password: "password",
    database: "mydatabase"
})

const { pool, promisePool, query, insert, select, update, remove, count } = tools
```

### MySQL2 的导出对象

`pool`、`promisePool`、`query` 这三者是使用 `MySQL2` 模块创建的对象或者方法

`pool` 等于 `mysql.createPool(options)`，`promisePool` 等于 `pool.promise()`，`query` 等于 `promisePool.query`。当你不满足于使用 `easy-mysql-tools` 的几种方法时，可以使用 `MySQL2` 的对象或者方法

### Easy-MySQL-Tools 的导出方法

`insert`、`select`、`update`、`remove`、`count` 这五个是 `easy-mysql-tools` 提供的方法。

这几种方法参数类型相同，均可以提供两个参数：

**第一个参数：配置[QueryConfig](#配置)，必须提供**

第二个参数：回调函数[Callback](#回调函数)，可选，为进阶功能

**注意：这个五个方法内部都捕捉了错误，因此，即使查询出错，也会有默认的返回值，如果有抛出错误或者其他高级需求，请看回调函数[Callback](#回调函数)**

下面介绍**只提供第一个 Config 参数的情况下，五个函数的返回值类型：**

### 插入 · insert(config)

返回值类型为 `Promise<number | undefined>`，插入成功返回插入的 `insertId` 值，也就是那一条新纪录的 `id` 值，插入失败或者报错返回 `Promise<undefined>`

### 选取 · select(config)

返回值为记录的数组 `Promise<singleRecord[]>`，当提供了 `whiteList` 时，每条记录只包含 `whiteList` 所含字段，如果没有则包含数据表所有的字段，查询失败或者报错返回空数组 `Promise<[]>`

### 更新 · update(config)

返回值为 `Promise<number>`，更新成功则返回更新的记录数 `affectedRows` 值，更新失败或者报错返回 `Promise<0>`

### 删除 · remove(config)

返回值为 `Promise<number>`，删除成功则返回删除的记录数 `affectedRows` 值，删除失败或者报错返回 `Promise<0>`

### 计数 · count(config)

返回值为 `Promise<number>`，统计符合条件的记录数，统计失败或者报错返回 `Promise<0>`

## 回调函数

```typescript
type Callback<T, K> = (error?: any, result?: [mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader, mysql.FieldPacket[]] | null, value?: K) => T
```

如果你对 `easy-mysql-tools` 的默认捕获错误行为不满意，又或者对于他的数据处理方式不满意，可以在上方的五个方法，提供第二个参数，也就是回调函数。**当你使用了回调函数以后，回调函数的返回值将作为查询方法的返回值**。以下是回调函数的三个参数

- error

查询过程中被 `try {...} catch(error) {...}` 捕获的错误，如果没有错误被捕获则是 `null`

- result

使用 `MySQL2` 模块查询的原生返回结果，你可以使用这个结果，来进行你想要的数据处理，查询出错时，为 `null`

- data

查询方法在没有使用 `callback` 的情况下应该返回的值，比如你只是想要打印一下错误，并不想做其他的事，你可以这样写：

```typescript
insert(config, (error, result, data) => {
    if (error) {
        console.log(error)
    }

    // 注意：回调函数的返回值，将会是查询方法的返回值
    return data
})
```

当然，`TypeScript` 依旧能够识别回调函数的返回值类型

## 默认配置

```typescript
import { setDefaultConfig } from "easy-mysql-tools"

type DefaultCOnfig = {
    transformNullToUndefined?: boolen
}

setDefaultConfig({
    transformNullToUndefined: true
})
```

暂时只支持 `transformNullToUndefined` 的默认配置
