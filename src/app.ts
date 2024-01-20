import buildServer from './server.js';

// Asynchronously starts the Fastify server.
async function start() {

    // Builds and configures the Fastify server instance.
    const server = await buildServer();

    try {
        // Ensures all registered plugins, including fastify-env, are loaded and ready.
        await server.ready();

        // Parses the server port number from the configuration and checks if it's a valid number.
        const port = server.config.PORT;

        // Starts the server listening on the specified port. Uses a Promise to handle asynchronous
        // operations in Node's listen method, which is callback-based.
        await new Promise<void>((resolve, reject) => {
            server.server.listen(port, '0.0.0.0', (err?: Error) => {
                if (err) {
                    reject(err); // Rejects the promise if there is an error.
                    return;
                }
                console.log(`Server listening on port ${port}`);
                resolve(); // Resolves the promise upon successful listening.
            });
        });

    } catch (err) {
        // Handles any errors that occur during the server setup and startup.
        console.error(err);
        process.exit(1); // Exits the process with a failure status code.
    }
}

// Initiates the server start process and catches any unhandled promise rejections.
start().catch((err) => {
    console.error('Failed to start the server:', err);
    process.exit(1); // Ensures the process exits with a failure status code for unhandled rejections.
});
