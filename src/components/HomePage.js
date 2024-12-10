import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  // static array of images
  const staticImages = [
    { src: "/images/acai.jpg" },
    { src: "/images/salmon.jpg" },
    { src: "/images/frenchtoast.jpg" },
    { src: "/images/poke.jpg" },
    { src: "/images/vodka.jpg" },
    { src: "/images/quesadilla.jpg" },
    { src: "/images/tofu.jpg" },
    { src: "/images/grilledcheese.jpg" },
    { src: "/images/crispyricesalad.jpg" },
  ];

  return (
    <div className="text-center mt-5">
      <h1>Welcome to your personalized meal planner!</h1>
      <p>
        Plan your meals by day, find delicious recipes, and generate grocery
        lists all in one place.
      </p>
      <div className="d-flex justify-content-center gap-3 mt-3">
        <Link to="/search-recipes" className="btn btn-primary">
          Search Recipes
        </Link>
        <Link to="/grocery-list" className="btn btn-secondary">
          View Grocery List
        </Link>
      </div>
      {/* Image Grid */}
      <div className="row mt-5">
        {staticImages.map((image, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <img
              src={image.src}
              alt={`Recipe ${index + 1}`}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
