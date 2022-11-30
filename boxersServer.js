const express = require("express");
const boxers = require("boxers");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(express.json()); //"use" ing middleware
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("This is the night of champions");
});
app.get("/boxers", async (req, res) => {
  const boxers = await prisma.boxer.findMany();
  // etc
  res.json(boxers);
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
