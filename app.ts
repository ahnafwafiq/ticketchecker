import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, "../client/dist");
app.use(express.static(frontendDistPath));

const server = http.createServer(app);
const io = new Server(server);

// Web Socket Code
io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  socket.on("message", (data) => {
    console.log("📩 Received message:", data);
    // Broadcast to all connected clients
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

app.get("/api/get-participant", (req, res) => {
  const barcode = req.query.barcode as string;

  console.log("Received barcode: ", barcode);

  const participant = {
    name: "John Doe",
    status: "Checked In",
  };

  res.json(participant);
});

app.listen(8080, "0.0.0.0", () => {
  console.log("App started on port 8080");
});
