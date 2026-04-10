const { MongoMemoryServer } = require("mongodb-memory-server");

console.log("Pre-downloading MongoDB binary...");
MongoMemoryServer.create()
  .then((server) => {
    console.log("Download complete! Stopping server...");
    return server.stop();
  })
  .then(() => {
    console.log("Done! MongoDB binary is cached.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
