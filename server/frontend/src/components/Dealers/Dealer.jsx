import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from "../Header/Header";

const Dealer = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const dealer_url = `/djangoapp/dealer/${id}/`;
  const reviews_url = `/djangoapp/reviews/dealer/${id}/`;
  const post_review_url = `/postreview/${id}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dealerRes = await fetch(dealer_url);
        const dealerData = await dealerRes.json();

        if (dealerData.status === 200 && dealerData.dealer.length > 0) {
          setDealer(dealerData.dealer[0]);
        }

        const reviewsRes = await fetch(reviews_url);
        const reviewsData = await reviewsRes.json();

        if (reviewsData.status === 200) {
          setReviews(reviewsData.reviews);
        }
      } catch (err) {
        console.error("Error fetching dealer or reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const senti_icon = (sentiment) => {
    if (sentiment === "positive") return positive_icon;
    if (sentiment === "negative") return negative_icon;
    return neutral_icon;
  };

  const isLoggedIn = sessionStorage.getItem("username") !== null;

  if (loading) return <div>Loading dealer info...</div>;

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      {dealer ? (
        <>
          <h1 style={{ color: "grey" }}>
            {dealer.full_name}
            {isLoggedIn && (
              <a href={post_review_url}>
                <img
                  src={review_icon}
                  style={{ width: "10%", marginLeft: "10px", marginTop: "10px" }}
                  alt="Post Review"
                />
              </a>
            )}
          </h1>
          <h4 style={{ color: "grey" }}>
            {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
          </h4>
        </>
      ) : (
        <h2>No dealer found</h2>
      )}

      <div className="reviews_panel">
        {reviews.length === 0 ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review_panel">
              <img
                src={senti_icon(review.sentiment)}
                className="emotion_icon"
                alt="Sentiment"
              />
              <div className="review">{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model}{" "}
                {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
