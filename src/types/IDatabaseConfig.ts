/**
 * IDatabaseConfig interface with a generic type for database configuration.
 * This allows specifying the type of the configuration object for each database,
 * improving type safety while maintaining flexibility.
 *
 * @type TConfig - A generic type parameter representing the configuration object for the database.
 */
export interface IDatabaseConfig<TConfig = any> {
    type: string;        // Database type identifier
    config: TConfig;     // Database-specific configuration object
}

export interface IMongoDBConfig {
    url: string;
    database: string;
}