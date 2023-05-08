"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTools = exports.setDefaultConfig = exports.defaultConfig = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
function getConditionString(config) {
    const { where, order, limit } = config;
    const whereFieldList = [];
    const wherePlaceList = [];
    const whereValueList = [];
    if (where) {
        if (Array.isArray(where)) {
            for (let i = 0; i < where.length; i++) {
                const _where = where[i];
                for (const field in _where) {
                    const item = _where[field];
                    if (item !== undefined) {
                        if (item === null) {
                            whereFieldList.push(`${field} is ?`);
                            whereValueList.push(item);
                            continue;
                        }
                        if (typeof item === "object" && "equal" in item && "value" in item) {
                            if (item.value === null) {
                                if (item.equal === "=") {
                                    whereFieldList.push(`${field} is ?`);
                                    whereValueList.push(item.value);
                                }
                                if (item.equal === "!=" || item.equal === "<" || item.equal === ">") {
                                    whereFieldList.push(`${field} is not ?`);
                                    whereValueList.push(item.value);
                                }
                                continue;
                            }
                            whereFieldList.push(`${field} ${item.equal} ?`);
                            whereValueList.push(item.value);
                            continue;
                        }
                        whereFieldList.push(`${field} = ?`);
                        whereValueList.push(item);
                    }
                }
                if (i !== where.length - 1) {
                    // whereFieldList[whereFieldList.length - 1] += " or "
                    wherePlaceList.push(whereFieldList.length - 1);
                }
            }
        }
        else {
            for (const field in where) {
                const item = where[field];
                if (item !== undefined) {
                    if (item === null) {
                        whereFieldList.push(`${field} is ?`);
                        whereValueList.push(item);
                        continue;
                    }
                    if (typeof item === "object" && "equal" in item && "value" in item) {
                        if (item.value === null) {
                            if (item.equal === "=") {
                                whereFieldList.push(`${field} is ?`);
                                whereValueList.push(item.value);
                            }
                            if (item.equal === "!=" || item.equal === "<" || item.equal === ">") {
                                whereFieldList.push(`${field} is not ?`);
                                whereValueList.push(item.value);
                            }
                            continue;
                        }
                        whereFieldList.push(`${field} ${item.equal} ?`);
                        whereValueList.push(item.value);
                        continue;
                    }
                    whereFieldList.push(`${field} = ?`);
                    whereValueList.push(item);
                }
            }
        }
    }
    const orderList = [];
    if (order) {
        if (Array.isArray(order)) {
            for (const item of order) {
                orderList.push(`${item.field} ${item.method || "asc"}`);
            }
        }
        else {
            orderList.push(`${order.field} ${order.method || "asc"}`);
        }
    }
    const limitString = limit ? "limit ?, ?" : "";
    const queryString = `${whereFieldList.length ? "where" : ""} ${whereFieldList.map((str, index, array) => {
        if (index === array.length - 1)
            return str;
        if (wherePlaceList.includes(index))
            return `${str} or `;
        return `${str} and `;
    }).join("")} ${orderList.length ? "order by" : ""} ${orderList.join(", ")} ${limitString}`;
    const valueList = [...whereValueList, ...(limit ? [limit.offset || 0, limit.count] : [])];
    return { queryString, valueList };
}
exports.defaultConfig = {
    transformNullToUndefined: false
};
const setDefaultConfig = (config) => {
    // defaultConfig.transformNullToUndefined = config.transformNullToUndefined
    for (const i of Object.keys(config)) {
        exports.defaultConfig[i] = config[i];
    }
};
exports.setDefaultConfig = setDefaultConfig;
const createTools = (options) => {
    const pool = mysql2_1.default.createPool(options);
    const promisePool = pool.promise();
    const query = (str, data) => __awaiter(void 0, void 0, void 0, function* () {
        return yield promisePool.query(str, data);
    });
    function insert(config, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tableName, data } = config;
                const setFieldList = [];
                const setValueList = [];
                const setPlaceList = [];
                if (data) {
                    for (const field in data) {
                        if (data[field] !== undefined) {
                            setFieldList.push(field);
                            setPlaceList.push("?");
                            setValueList.push(data[field]);
                        }
                    }
                }
                const { queryString, valueList } = getConditionString(config);
                const result = yield query(`insert into ${tableName}(${setFieldList.join(", ")}) values(${setPlaceList.join(", ")}) ${queryString}`, [...setValueList, ...valueList]);
                const value = result[0].insertId;
                if (callback) {
                    return callback(null, result, value);
                }
                return value;
            }
            catch (error) {
                if (callback) {
                    return callback(error, null, undefined);
                }
                return undefined;
            }
        });
    }
    function select(config, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tableName, whiteList, transformNullToUndefined } = config;
                const { queryString, valueList } = getConditionString(config);
                const result = yield query(`select ${whiteList && whiteList.length ? whiteList.join(", ") : "*"} from ${tableName} ${queryString}`, [...valueList]);
                const value = result[0];
                if (transformNullToUndefined || (transformNullToUndefined === undefined && exports.defaultConfig.transformNullToUndefined)) {
                    for (const item of value) {
                        for (const key in item) {
                            if (item[key] === null) {
                                item[key] = undefined;
                            }
                        }
                    }
                }
                if (callback) {
                    return callback(null, result, value);
                }
                return value;
            }
            catch (error) {
                if (callback) {
                    return callback(error, null, []);
                }
                return [];
            }
        });
    }
    function update(config, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tableName, data } = config;
                const setFieldList = [];
                const setValueList = [];
                if (data) {
                    for (const field in data) {
                        if (data[field] !== undefined) {
                            setFieldList.push(field);
                            setValueList.push(data[field]);
                        }
                    }
                }
                const { queryString, valueList } = getConditionString(config);
                const result = yield query(`update ${tableName} set ${setFieldList.map(field => `${field} = ?`).join(", ")} ${queryString}`, [...setValueList, ...valueList]);
                const value = result[0].affectedRows;
                if (callback) {
                    return callback(null, result, value);
                }
                return value;
            }
            catch (error) {
                if (callback) {
                    return callback(error, null, 0);
                }
                return 0;
            }
        });
    }
    function count(config, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tableName } = config;
                const { queryString, valueList } = getConditionString(config);
                const result = yield query(`select count(*) from ${tableName} ${queryString}`, [...valueList]);
                const value = result[0][0]["count(*)"];
                if (callback) {
                    return callback(null, result, value);
                }
                return value;
            }
            catch (error) {
                if (callback) {
                    return callback(error, null, 0);
                }
                return 0;
            }
        });
    }
    function remove(config, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tableName } = config;
                const { queryString, valueList } = getConditionString(config);
                const result = yield query(`delete from ${tableName} ${queryString}`, [...valueList]);
                const value = result[0].affectedRows;
                if (callback) {
                    return callback(null, result, value);
                }
                return value;
            }
            catch (error) {
                if (callback) {
                    return callback(error, null, 0);
                }
                return 0;
            }
        });
    }
    return { pool, promisePool, query, insert, select, remove, update, count };
};
exports.createTools = createTools;
//# sourceMappingURL=index.js.map