import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, "../client/dist");
app.use(express.static(frontendDistPath));

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
