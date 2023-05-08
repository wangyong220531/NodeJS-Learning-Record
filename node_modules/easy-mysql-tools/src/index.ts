import mysql, { ResultSetHeader } from "mysql2"

export type Pool = mysql.Pool

export type PoolOptions = mysql.PoolOptions

export type BaseType = any

type DataBase = {
    [TableName: string]: {
        [FieldName: string]: BaseType
    }
}

type QueryConfig<UrDataBase extends DataBase, T extends keyof UrDataBase = keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T]> = {
    tableName: T,
    where?: {
        [Field in keyof UrDataBase[T]]?: UrDataBase[T][Field] | null | {
            equal: ">" | "<" | "!=" | ">=" | "<=" | "=",
            value: UrDataBase[T][Field] | null
        }
    } | {
        [Field in keyof UrDataBase[T]]?: UrDataBase[T][Field] | null | {
            equal: ">" | "<" | "!=" | ">=" | "<=" | "=",
            value: UrDataBase[T][Field] | null
        }
    }[]
    order?: {
        field: keyof UrDataBase[T],
        method?: "desc" | "asc"
    } | {
        field: keyof UrDataBase[T],
        method?: "desc" | "asc"
    }[],
    limit?: {
        offset?: number,
        count: number
    },
    data?: Partial<{ [Key in keyof UrDataBase[T]]: UrDataBase[T][Key] | null }>,
    whiteList?: K[],
    transformNullToUndefined?: boolean,
}

type ConditionConfig = {
    where?: {
        [Prop: string]: BaseType | {
            equal: ">" | "<" | "!=" | ">=" | "<=" | "=",
            value: BaseType
        } | undefined
    } | {
        [Prop: string]: BaseType | {
            equal: ">" | "<" | "!=" | ">=" | "<=" | "=",
            value: BaseType
        } | undefined
    }[],
    order?: {
        field: string | symbol | number,
        method?: "desc" | "asc"
    } | {
        field: string | symbol | number,
        method?: "desc" | "asc"
    }[],
    limit?: {
        offset?: number,
        count: number
    }
}

type Callback<T, K> = (error?: any, result?: [mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader, mysql.FieldPacket[]] | null, value?: K) => T

function getConditionString(config: ConditionConfig) {
    const { where, order, limit } = config
    const whereFieldList: string[] = []
    const wherePlaceList: number[] = []
    const whereValueList: BaseType[] = []
    if (where) {
        if (Array.isArray(where)) {
            for (let i = 0; i < where.length; i++) {
                const _where = where[i]
                for (const field in _where) {
                    const item = _where[field]
                    if (item !== undefined) {
                        if (item === null) {
                            whereFieldList.push(`${field} is ?`)
                            whereValueList.push(item as BaseType)
                            continue
                        }
                        if (typeof item === "object" && "equal" in item && "value" in item) {
                            if (item.value === null) {
                                if (item.equal === "=") {
                                    whereFieldList.push(`${field} is ?`)
                                    whereValueList.push(item.value)
                                }
                                if (item.equal === "!=" || item.equal === "<" || item.equal === ">") {
                                    whereFieldList.push(`${field} is not ?`)
                                    whereValueList.push(item.value)
                                }
                                continue
                            }
                            whereFieldList.push(`${field} ${item.equal} ?`)
                            whereValueList.push(item.value)
                            continue
                        }
                        whereFieldList.push(`${field} = ?`)
                        whereValueList.push(item as BaseType)
                    }
                }
                if (i !== where.length - 1) {
                    // whereFieldList[whereFieldList.length - 1] += " or "
                    wherePlaceList.push(whereFieldList.length - 1)
                }
            }
        } else {
            for (const field in where) {
                const item = where[field]
                if (item !== undefined) {
                    if (item === null) {
                        whereFieldList.push(`${field} is ?`)
                        whereValueList.push(item as BaseType)
                        continue
                    }
                    if (typeof item === "object" && "equal" in item && "value" in item) {
                        if (item.value === null) {
                            if (item.equal === "=") {
                                whereFieldList.push(`${field} is ?`)
                                whereValueList.push(item.value)
                            }
                            if (item.equal === "!=" || item.equal === "<" || item.equal === ">") {
                                whereFieldList.push(`${field} is not ?`)
                                whereValueList.push(item.value)
                            }
                            continue
                        }
                        whereFieldList.push(`${field} ${item.equal} ?`)
                        whereValueList.push(item.value)
                        continue
                    }
                    whereFieldList.push(`${field} = ?`)
                    whereValueList.push(item as BaseType)
                }
            }
        }
    }
    const orderList: string[] = []
    if (order) {
        if (Array.isArray(order)) {
            for (const item of order) {
                orderList.push(`${item.field as string} ${item.method || "asc"}`)
            }
        } else {
            orderList.push(`${order.field as string} ${order.method || "asc"}`)
        }
    }
    const limitString = limit ? "limit ?, ?" : ""
    const queryString = `${whereFieldList.length ? "where" : ""} ${whereFieldList.map((str, index, array) => {
        if (index === array.length - 1) return str
        if (wherePlaceList.includes(index)) return `${str} or `
        return `${str} and `
    }).join("")} ${orderList.length ? "order by" : ""} ${orderList.join(", ")} ${limitString}`
    const valueList = [...whereValueList, ...(limit ? [limit.offset || 0, limit.count] : [])]
    return { queryString, valueList }
}

export type DefaultConfig = {
    transformNullToUndefined?: boolean
}

export const defaultConfig: DefaultConfig = {
    transformNullToUndefined: false
}

export const setDefaultConfig = (config: DefaultConfig) => {
    // defaultConfig.transformNullToUndefined = config.transformNullToUndefined
    for (const i of Object.keys(config)) {
        defaultConfig[i as keyof DefaultConfig] = config[i as keyof DefaultConfig]
    }
}

export const createTools = <UrDataBase extends DataBase>(options: PoolOptions) => {
    const pool = mysql.createPool(options)
    const promisePool = pool.promise()
    const query = async (str: string, data?: BaseType[]) => {
        return await promisePool.query(str, data)
    }
    function insert<T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T]>(config: QueryConfig<UrDataBase, T, K>): Promise<number | undefined>

    function insert<T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T], X = any, Y = any>(config: QueryConfig<UrDataBase, T, K>, callback: Callback<X, number | undefined>): Promise<X>

    async function insert<T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T], X = any>(config: QueryConfig<UrDataBase, T, K>, callback?: Callback<X, number | undefined>) {
        try {
            const { tableName, data } = config
            const setFieldList: string[] = []
            const setValueList: BaseType[] = []
            const setPlaceList: string[] = []
            if (data) {
                for (const field in data) {
                    if (data[field] !== undefined) {
                        setFieldList.push(field)
                        setPlaceList.push("?")
                        setValueList.push(data[field]!)
                    }
                }
            }
            const { queryString, valueList } = getConditionString(config)
            const result = await query(`insert into ${tableName as string}(${setFieldList.join(", ")}) values(${setPlaceList.join(", ")}) ${queryString}`, [...setValueList, ...valueList])
            const value = (result[0] as ResultSetHeader).insertId
            if (callback) {
                return callback(null, result, value)
            }
            return value
        } catch (error) {
            if (callback) {
                return callback(error, null, undefined)
            }
            return undefined
        }
    }

    function select<T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T]>(config: QueryConfig<UrDataBase, T, K>): Promise<Pick<UrDataBase[T], K>[]>

    function select<T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T], X = any, Y = any>(config: QueryConfig<UrDataBase, T, K>, callback: Callback<X, Pick<UrDataBase[T], K>[]>): Promise<X>

    async function select<T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T], X = any>(config: QueryConfig<UrDataBase, T, K>, callback?: Callback<X, Pick<UrDataBase[T], K>[]>) {
        try {
            const { tableName, whiteList, transformNullToUndefined } = config
            const { queryString, valueList } = getConditionString(config)
            const result = await query(`select ${whiteList && whiteList.length ? whiteList.join(", ") : "*"} from ${tableName as string} ${queryString}`, [...valueList])
            const value = result[0] as any
            if (transformNullToUndefined || (transformNullToUndefined === undefined && defaultConfig.transformNullToUndefined)) {
                for (const item of value) {
                    for (const key in item) {
                        if (item[key] === null) {
                            item[key] = undefined
                        }
                    }
                }
            }
            if (callback) {
                return callback(null, result, value)
            }
            return value
        } catch (error) {
            if (callback) {
                return callback(error, null, [])
            }
            return []
        }
    }

    function update<T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T]>(config: QueryConfig<UrDataBase, T, K>): Promise<number>

    function update<T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T], X = any, Y = any>(config: QueryConfig<UrDataBase, T, K>, callback: Callback<X, number>): Promise<X>

    async function update<T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T], X = any>(config: QueryConfig<UrDataBase, T, K>, callback?: Callback<X, number>) {
        try {
            const { tableName, data } = config
            const setFieldList: string[] = []
            const setValueList: BaseType[] = []
            if (data) {
                for (const field in data) {
                    if (data[field] !== undefined) {
                        setFieldList.push(field)
                        setValueList.push(data[field]!)
                    }
                }
            }
            const { queryString, valueList } = getConditionString(config)
            const result = await query(`update ${tableName as string} set ${setFieldList.map(field => `${field} = ?`).join(", ")} ${queryString}`, [...setValueList, ...valueList])
            const value = (result[0] as ResultSetHeader).affectedRows
            if (callback) {
                return callback(null, result, value)
            }
            return value
        } catch (error) {
            if (callback) {
                return callback(error, null, 0)
            }
            return 0
        }
    }

    function count<T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T]>(config: QueryConfig<UrDataBase, T, K>): Promise<number>

    function count<T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T], X = any, Y = any>(config: QueryConfig<UrDataBase, T, K>, callback: Callback<X, number>): Promise<X>

    async function count<T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T], X = any>(config: QueryConfig<UrDataBase, T, K>, callback?: Callback<X, number>) {
        try {
            const { tableName } = config
            const { queryString, valueList } = getConditionString(config)
            const result = await query(`select count(*) from ${tableName as string} ${queryString}`, [...valueList])
            const value = (result[0] as any)[0]["count(*)"] as number
            if (callback) {
                return callback(null, result, value)
            }
            return value
        } catch (error) {
            if (callback) {
                return callback(error, null, 0)
            }
            return 0
        }
    }

    function remove<T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T]>(config: QueryConfig<UrDataBase, T, K>): Promise<number>

    function remove<T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T], X = any, Y = any>(config: QueryConfig<UrDataBase, T, K>, callback: Callback<X, number>): Promise<X>

    async function remove<T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T], X = any>(config: QueryConfig<UrDataBase, T, K>, callback?: Callback<X, number>) {
        try {
            const { tableName } = config
            const { queryString, valueList } = getConditionString(config)
            const result = await query(`delete from ${tableName as string} ${queryString}`, [...valueList])
            const value = (result[0] as ResultSetHeader).affectedRows
            if (callback) {
                return callback(null, result, value)
            }
            return value
        } catch (error) {
            if (callback) {
                return callback(error, null, 0)
            }
            return 0
        }
    }
    return { pool, promisePool, query, insert, select, remove, update, count }
}