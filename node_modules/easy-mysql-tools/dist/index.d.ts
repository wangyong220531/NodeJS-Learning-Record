import mysql from "mysql2";
export declare type Pool = mysql.Pool;
export declare type PoolOptions = mysql.PoolOptions;
export declare type BaseType = any;
declare type DataBase = {
    [TableName: string]: {
        [FieldName: string]: BaseType;
    };
};
declare type QueryConfig<UrDataBase extends DataBase, T extends keyof UrDataBase = keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T]> = {
    tableName: T;
    where?: {
        [Field in keyof UrDataBase[T]]?: UrDataBase[T][Field] | null | {
            equal: ">" | "<" | "!=" | ">=" | "<=" | "=";
            value: UrDataBase[T][Field] | null;
        };
    } | {
        [Field in keyof UrDataBase[T]]?: UrDataBase[T][Field] | null | {
            equal: ">" | "<" | "!=" | ">=" | "<=" | "=";
            value: UrDataBase[T][Field] | null;
        };
    }[];
    order?: {
        field: keyof UrDataBase[T];
        method?: "desc" | "asc";
    } | {
        field: keyof UrDataBase[T];
        method?: "desc" | "asc";
    }[];
    limit?: {
        offset?: number;
        count: number;
    };
    data?: Partial<{
        [Key in keyof UrDataBase[T]]: UrDataBase[T][Key] | null;
    }>;
    whiteList?: K[];
    transformNullToUndefined?: boolean;
};
declare type Callback<T, K> = (error?: any, result?: [mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader, mysql.FieldPacket[]] | null, value?: K) => T;
export declare type DefaultConfig = {
    transformNullToUndefined?: boolean;
};
export declare const defaultConfig: DefaultConfig;
export declare const setDefaultConfig: (config: DefaultConfig) => void;
export declare const createTools: <UrDataBase extends DataBase>(options: PoolOptions) => {
    pool: mysql.Pool;
    promisePool: import("mysql2/promise").Pool;
    query: (str: string, data?: BaseType[]) => Promise<[mysql.OkPacket | mysql.ResultSetHeader | mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket[], mysql.FieldPacket[]]>;
    insert: {
        <T extends keyof UrDataBase, K extends keyof UrDataBase[T] = keyof UrDataBase[T]>(config: QueryConfig<UrDataBase, T, K>): Promise<number | undefined>;
        <T_1 extends keyof UrDataBase, K_1 extends keyof UrDataBase[T_1] = keyof UrDataBase[T_1], X = any, Y = any>(config: QueryConfig<UrDataBase, T_1, K_1>, callback: Callback<X, number | undefined>): Promise<X>;
    };
    select: {
        <T_2 extends keyof UrDataBase, K_2 extends keyof UrDataBase[T_2] = keyof UrDataBase[T_2]>(config: QueryConfig<UrDataBase, T_2, K_2>): Promise<Pick<UrDataBase[T_2], K_2>[]>;
        <T_3 extends keyof UrDataBase, K_3 extends keyof UrDataBase[T_3] = keyof UrDataBase[T_3], X_1 = any, Y_1 = any>(config: QueryConfig<UrDataBase, T_3, K_3>, callback: Callback<X_1, Pick<UrDataBase[T_3], K_3>[]>): Promise<X_1>;
    };
    remove: {
        <T_4 extends keyof UrDataBase, K_4 extends keyof UrDataBase[T_4] = keyof UrDataBase[T_4]>(config: QueryConfig<UrDataBase, T_4, K_4>): Promise<number>;
        <T_5 extends keyof UrDataBase, K_5 extends keyof UrDataBase[T_5] = keyof UrDataBase[T_5], X_2 = any, Y_2 = any>(config: QueryConfig<UrDataBase, T_5, K_5>, callback: Callback<X_2, number>): Promise<X_2>;
    };
    update: {
        <T_6 extends keyof UrDataBase, K_6 extends keyof UrDataBase[T_6] = keyof UrDataBase[T_6]>(config: QueryConfig<UrDataBase, T_6, K_6>): Promise<number>;
        <T_7 extends keyof UrDataBase, K_7 extends keyof UrDataBase[T_7] = keyof UrDataBase[T_7], X_3 = any, Y_3 = any>(config: QueryConfig<UrDataBase, T_7, K_7>, callback: Callback<X_3, number>): Promise<X_3>;
    };
    count: {
        <T_8 extends keyof UrDataBase, K_8 extends keyof UrDataBase[T_8] = keyof UrDataBase[T_8]>(config: QueryConfig<UrDataBase, T_8, K_8>): Promise<number>;
        <T_9 extends keyof UrDataBase, K_9 extends keyof UrDataBase[T_9] = keyof UrDataBase[T_9], X_4 = any, Y_4 = any>(config: QueryConfig<UrDataBase, T_9, K_9>, callback: Callback<X_4, number>): Promise<X_4>;
    };
};
export {};
