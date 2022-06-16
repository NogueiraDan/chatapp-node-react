const app = require("express")();
const server = require("http").createServer(app);
const PORT = 3001;
const io = require("socket.io")(server, {
  cors: {
    origins: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello from server</h1>");
});
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta:${PORT}`);
});

io.on("connection", (socket) => {
  /* O objeto socket pode ser usado para 
  enviar mensagens específicas para o novo cliente conectado */

  console.log(`Novo cliente conectado: ${socket.id}`);
  socket.emit("connection", { id: "test" });

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`Usuário com id: ${socket.id} entrou na sala: ${data}`);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Usuário Disconectado", socket.id);
  });
});
