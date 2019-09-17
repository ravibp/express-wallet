const http = require("http");
const routehandler = require("./routes/routes");
const net = require("net");
http.createServer(routehandler).listen(1010);
console.log("server started");
let server = net.createServer(c => {
  console.log("client connected");
  c.on("data", data => {
    c.write(data);
  });

  c.on("close", () => {
    console.log("client disconnected");
  });
});

server.listen(1234, () => {
  console.log("TCP server started");
});
