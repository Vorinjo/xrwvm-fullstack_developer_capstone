const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const Reviews = require("./review");
const Dealerships = require("./dealership");

const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const reviewsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "reviews.json"), "utf8")
);
const dealershipsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "dealerships.json"), "utf8")
);

app.get("/", (req, res) => {
  res.send("Welcome to the Best Cars dealership API");
});

app.get("/fetchReviews", async (req, res) => {
  try {
    const documents = await Reviews.find().sort({ id: 1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

app.get("/fetchReviews/dealer/:id", async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: Number(req.params.id) });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching dealer reviews" });
  }
});

app.get("/fetchDealers", async (req, res) => {
  try {
    const documents = await Dealerships.find().sort({ id: 1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching dealerships" });
  }
});

app.get("/fetchDealers/:state", async (req, res) => {
  try {
    const state = new RegExp("^" + req.params.state + "$", "i");
    const documents = await Dealerships.find({ state: state }).sort({ id: 1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching dealerships by state" });
  }
});

app.get("/fetchDealer/:id", async (req, res) => {
  try {
    const documents = await Dealerships.find({ id: Number(req.params.id) });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching dealership" });
  }
});

app.post("/insert_review", async (req, res) => {
  try {
    const latestReview = await Reviews.findOne().sort({ id: -1 });
    const data = req.body;
    const review = new Reviews({
      id: latestReview ? latestReview.id + 1 : 1,
      name: data.name,
      dealership: Number(data.dealership),
      review: data.review,
      purchase: Boolean(data.purchase),
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: Number(data.car_year)
    });
    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error inserting review" });
  }
});

async function startServer() {
  try {
    await mongoose.connect("mongodb://mongo_db:27017/", {
      dbName: "dealershipsDB"
    });
    await Reviews.deleteMany({});
    await Dealerships.deleteMany({});
    await Reviews.insertMany(reviewsData.reviews);
    await Dealerships.insertMany(dealershipsData.dealerships);
    app.listen(port, () => {
      console.log("Server is running on http://localhost:" + port);
    });
  } catch (error) {
    console.error("Unable to start the API", error);
    process.exit(1);
  }
}

startServer();
