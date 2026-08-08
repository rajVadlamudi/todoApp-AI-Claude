import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/tasks", tasksRouter);

app.listen(PORT, () => {
  console.log(`Todo API listening on http://localhost:${PORT}`);
});
