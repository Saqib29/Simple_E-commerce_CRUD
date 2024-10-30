export const db_config = {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DATABASE,
    db_query_log: process.env.DB_QUERY_LOG
};


export const app_config = {
    port: process.env.PORT ?? 3000,
    origin: process.env.ORIGIN,
    node_env: process.env.NODE_ENV,
    run_seed: process.env.RUN_SEED
}

export const jwt_config = {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXP,
    salt: process.env.BCRYPT_SALT
}