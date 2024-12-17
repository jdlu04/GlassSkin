import React, { useEffect, useState } from "react";
import supabase from "../Supabase/supabaseClient"; // Supabase client
import { useUser } from "@clerk/clerk-react"; // Clerk user hook
import "./Recommended.css"; // Import custom CSS for the carousel
import { Loader2 } from "lucide-react";

const Recommended = () => {
  const [recommendations, setRecommendations] = useState([]);
  const { user } = useUser(); // Get the current user
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (user) {
        setIsLoading(true);
        console.log("User type:", typeof user.id, user.id); //debug
        try {
          const { data, error } = await supabase
            .from("user_preferences")
            .select("*")
            .eq("id", user.id)
            .single();
          console.log("Data:", data); //debug
          if (error) {
            console.error("Error fetching user preferences:", error);
            return;
          }
          console.log("User preferences:", data); //debug
          const preferencesArray = data.preferences;
          const queryParams = new URLSearchParams(); //this affixed the user preferences to the backend url to get the json data
          preferencesArray.forEach((preference) => {
            Object.keys(preference).forEach((key) => {
              if (preference[key]) {
                queryParams.append(key, preference[key]);
              }
            });
          });

          //get recommendations from the API
          //console.log('Attempted fetch at:', 'http://127.0.0.1:5000/api/recommended?${queryParams.toString()}');
          console.log("Query params:", queryParams.toString());
          const response = await fetch(
            `http://127.0.0.1:5000/api/recommended?${queryParams.toString()}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch recommendations");
          }
          const recommendedData = await response.json();
          setRecommendations(recommendedData);
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRecommendations();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center h-screen pt-40">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    //info displayed on the recommended component
    <div>
      <h1>Recommended Products</h1>
      {recommendations.length > 0 ? (
        <div className="carousel-container">
          <div className="carousel">
            {recommendations.map((item, index) => (
              <div className="carousel-item" key={index}>
                <h2>{item.name}</h2>
                <a
                  href={item.product_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={`https:${item.api_featured_image}`}
                    alt={item.name}
                  />
                </a>

                <p>Price: {item.price}</p>
                <p>Rating: {item.rating}</p>
                <p>Brand: {item.brand}</p>
                <p>Tags: {item.tag_list}</p>
              </div>
            ))}
          </div>
          <button
            className="carousel-button prev"
            onClick={() => scrollCarousel(-1)}
          >
            ‹
          </button>
          <button
            className="carousel-button next"
            onClick={() => scrollCarousel(1)}
          >
            ›
          </button>
        </div>
      ) : (
        <p>No recommendations found.</p>
      )}
    </div>
  );
};

const scrollCarousel = (direction) => {
  //carousel scroll function
  const carousel = document.querySelector(".carousel");
  const scrollAmount = direction * (carousel.clientWidth / 3);
  carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
};

export default Recommended;
