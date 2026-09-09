import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../Header/Header";
import "../assets/style.css";
import "./Dealers.css";


const PostReview = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("2023");
  const [date, setDate] = useState("");
  const [carModels, setCarModels] = useState([]);

  useEffect(() => {
    const loadFormData = async () => {
      const dealerResponse = await fetch("/djangoapp/dealer/" + id);
      const dealerResult = await dealerResponse.json();
      if (dealerResult.status === 200 && dealerResult.dealer.length > 0) {
        setDealer(dealerResult.dealer[0]);
      }

      const carsResponse = await fetch("/djangoapp/get_cars");
      const carsResult = await carsResponse.json();
      setCarModels(Array.from(carsResult.CarModels || []));
    };
    loadFormData();
  }, [id]);

  const postReview = async (event) => {
    event.preventDefault();
    if (!model || !review.trim() || !date || !year) {
      alert("All review details are mandatory.");
      return;
    }

    const selected = carModels.find(
      (car) => car.CarMake + "|" + car.CarModel === model
    );
    const response = await fetch("/djangoapp/add_review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:
          [
            sessionStorage.getItem("firstname"),
            sessionStorage.getItem("lastname"),
          ].filter(Boolean).join(" ") || sessionStorage.getItem("username"),
        dealership: id,
        review: review.trim(),
        purchase: true,
        purchase_date: date,
        car_make: selected.CarMake,
        car_model: selected.CarModel,
        car_year: Number(year),
      }),
    });

    const result = await response.json();
    if (result.status === 200) {
      window.location.href = "/dealer/" + id;
      return;
    }
    alert(result.message || "The review could not be posted.");
  };

  return (
    <div>
      <Header />
      <main className="post-review-page">
        <p className="eyebrow">Share your experience</p>
        <h1>Review {dealer.full_name || "this dealership"}</h1>
        <form className="review-form" onSubmit={postReview}>
          <label>
            Your review
            <textarea
              id="review"
              rows="7"
              value={review}
              onChange={(event) => setReview(event.target.value)}
              placeholder="Tell other customers about the service you received."
              required
            />
          </label>
          <label>
            Purchase date
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </label>
          <label>
            Car make and model
            <select
              id="cars"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              required
            >
              <option value="" disabled>Choose Car Make and Model</option>
              {carModels.map((car) => (
                <option
                  key={car.CarMake + "-" + car.CarModel}
                  value={car.CarMake + "|" + car.CarModel}
                >
                  {car.CarMake} {car.CarModel}
                </option>
              ))}
            </select>
          </label>
          <label>
            Car year
            <input
              type="number"
              value={year}
              onChange={(event) => setYear(event.target.value)}
              min="2015"
              max="2023"
              required
            />
          </label>
          <button className="postreview" type="submit">Post Review</button>
        </form>
      </main>
    </div>
  );
};

export default PostReview;
