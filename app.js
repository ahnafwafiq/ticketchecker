import express from "express"
import path from "path"
import {fileURLToPath} from "url"

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, "./client/dist");
app.use(express.static(frontendDistPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"))
})

app.listen("8080", () => {
    console.log('App started on port 8080')
})