import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../Header/Header";
import negativeIcon from "../assets/negative.png";
import neutralIcon from "../assets/neutral.png";
import positiveIcon from "../assets/positive.png";
import reviewIcon from "../assets/reviewbutton.png";
import "../assets/style.css";
import "./Dealers.css";


const Dealer = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const isLoggedIn = Boolean(sessionStorage.getItem("username"));

  useEffect(() => {
    const loadDealer = async () => {
      const dealerResponse = await fetch("/djangoapp/dealer/" + id);
      const dealerResult = await dealerResponse.json();
      if (dealerResult.status === 200 && dealerResult.dealer.length > 0) {
        setDealer(dealerResult.dealer[0]);
      }

      const reviewsResponse = await fetch("/djangoapp/reviews/dealer/" + id);
      const reviewsResult = await reviewsResponse.json();
      if (reviewsResult.status === 200) {
        setReviews(Array.from(reviewsResult.reviews || []));
      }
      setLoaded(true);
    };
    loadDealer();
  }, [id]);

  const sentimentIcon = (sentiment) => {
    if (sentiment === "positive") {
      return positiveIcon;
    }
    if (sentiment === "negative") {
      return negativeIcon;
    }
    return neutralIcon;
  };

  return (
    <div>
      <Header />
      <main className="dealer-detail-page">
        <section className="dealer-summary">
          <div>
            <p className="eyebrow">Dealer #{id}</p>
            <h1>{dealer.full_name || "Dealer details"}</h1>
            {dealer.city && (
              <p>
                {dealer.address}, {dealer.city}, {dealer.state} {dealer.zip}
              </p>
            )}
          </div>
          {isLoggedIn && (
            <a className="review-cta" href={"/postreview/" + id}>
              <img src={reviewIcon} alt="" />
              Post Review
            </a>
          )}
        </section>

        <h2>Customer reviews</h2>
        {!loaded ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="empty-state">No reviews yet. Be the first to contribute.</p>
        ) : (
          <div className="reviews_panel">
            {reviews.map((review) => (
              <article className="review_panel" key={review.id}>
                <img
                  src={sentimentIcon(review.sentiment)}
                  className="emotion_icon"
                  alt={review.sentiment + " sentiment"}
                />
                <div>
                  <p className="review">{review.review}</p>
                  <p className="reviewer">
                    {review.name} · {review.car_year} {review.car_make}{" "}
                    {review.car_model}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dealer;
