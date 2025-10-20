import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, "../client/dist");
app.use(express.static(frontendDistPath));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Web Socket Code
io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  // Add participant on form submission
  socket.on("addParticipant", (data) => {
    db.participant
      .create({
        data: {
          ...data,
        },
      })
      .then((res) => {
        if (res) {
          socket.emit(`creationSuccess`, res);
        } else {
          socket.emit(`creationFailed`);
        }
      });
  });

  socket.on("participantsQuery", (data) => {
    db.participant
      .findMany({
        where: {
          createdBy: data.admin,
        },
      })
      .then((res) => {
        socket.emit("queryResult", res);
      })
      .catch((e) => {
        socket.emit("queryFailed", { e });
      });
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

server.listen(8080, "0.0.0.0", () => {
  console.log("App started on port 8080");
});
