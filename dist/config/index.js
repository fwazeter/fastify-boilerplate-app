export const getConfig = () => ({
    server: {
        port: process.env.PORT || 3000,
    },
    database: {
        uri: process.env.DB_URI,
        name: process.env.DB_NAME
    }
});
//# sourceMappingURL=index.js.map