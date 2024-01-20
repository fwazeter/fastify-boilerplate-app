export const getConfig = () => ({
    server: {
        port: process.env.PORT || 3000,
        // Add other server-related configurations here
    },
    database: {
      uri: process.env.DB_URI,
      name: process.env.DB_NAME
    }
    // Other configuration groups as needed
});
