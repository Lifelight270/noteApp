require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
const port = process.env.port;

//mongodb+srv://lightlife908:lifelight0011@cluster0.3dnyipx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//mongodb://127.0.0.1:27017/noteApp
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((e) => {
    console.log(`${e}`);
  });

const List = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const Note = mongoose.model("Note", List);

app.post("/listnote", async (req, res) => {
  try {
    const { name } = req.body;
    const item = new Note({
      name,
    });
    await item.save();
    res.status(201).json({ message: "Note added successfully" });
  } catch (e) {
    console.log(`${e}`);
  }
});

app.get("/getItem", async (req, res) => {
  try {
    const items = await Note.find();
    // console.log(items);
    res.json(items);
  } catch (e) {
    res.status(201).json({ message: `The error is ${e}` });
  }
});

app.get("/editList/:id", async (req, res) => {
  try {
    const getId = req.params.id;
    const newItem = await Note.findById(getId);
    res.json(newItem);
    // console.log(newItem.name);
  } catch (e) {
    console.log(`${e}`);
  }
});

app.put("/editList/:id", async (req, res) => {
  try {
    const getItem = req.params.id;
    const { name } = req.body;
    const newItem = await Note.findByIdAndUpdate(
      getItem,
      { name },
      { new: true, runValidators: true }
    );
    res.json(newItem);
  } catch (e) {
    console.log(`${e}`);
  }
});

app.delete("/deleteTask/:id", async (req, res) => {
  const deletedItem = await Note.findByIdAndDelete(req.params.id);
  res.json(deletedItem);
  // console.log(deletedItem);
});
app.get("", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
