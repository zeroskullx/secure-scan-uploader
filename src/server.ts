import { app } from "#/app"

// What I will use in this project are the most common ones like GET, POST, PATCH, PUT, DELETE
// Explaining a bit about HTTP methods:
// GET - Retrieve a resource
// POST - Create a resource
// PUT - Update a resource
// PATCH - Update a specific piece of information of a resource
// DELETE - Delete a resource

// const server = http.createServer((req, res) => {
//   res.writeHead(200, {"Content-Type": "text/plain"});
//   res.end("Hello, World!");
// });

// server.listen(3333, () => {
//   console.log("🚀 Server is running on http://localhost:3333");
// });

app.listen(
  { port: Number(process.env.PORT!), host: "0.0.0.0" },
  (err, address) => {
    if (err !== null) {
      console.error(err)
      process.exit(1)
    }
    console.log(`🚀 Server listening at ${address}`)
  },
)
