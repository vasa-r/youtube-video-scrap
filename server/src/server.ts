import express from "express";
import "dotenv/config";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Hey there. You're good to go.",
  });
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port: ${PORT}`);
});
