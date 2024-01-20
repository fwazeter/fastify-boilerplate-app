import buildServer from './server.js';
async function start() {
    const server = await buildServer();
    try {
        await server.ready();
        const port = server.config.PORT;
        await new Promise((resolve, reject) => {
            server.server.listen(port, '0.0.0.0', (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log(`Server listening on port ${port}`);
                resolve();
            });
        });
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
start().catch((err) => {
    console.error('Failed to start the server:', err);
    process.exit(1);
});
//# sourceMappingURL=app.js.map