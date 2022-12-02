const express = require("express");
//const boxers = require("boxers");
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

app.get("/boxers/:id", async (req, res) => {
  //I do not need number because it is already in number, but if I use number I get NAN
  //console.log("Hi",req.params);
  try {
    const boxer = await prisma.boxer.findUniqueOrThrow({
      where: { id: Number(req.params.id) },
    });

    res.json(boxer);
  } catch (error) {
    console.log(error.name);
    if (error.name === "NotFoundError") {
      return res.status(404).json({ message: "boxer not found" });
    } else {
      console.log(error);
      return res.status(500).json({ message: "something went wrong" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
