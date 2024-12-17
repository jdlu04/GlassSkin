import React from 'react'
import ProductCard from "../Components/ProductCard";
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import supabase from "../Components/Supabase/supabaseClient"; // Supabase client
import { useUser } from "@clerk/clerk-react"; // Clerk user hook

const Products = () => {
  
  const [products, setProduct] = useState(null);
  const [likedProducts, setLikedProducts] = useState([]);
  const { user } = useUser(); // Get the current user
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    const fetchUserId = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('id')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error("Error fetching user ID:", error);
            return;
          }

          setUserId(data.id);
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      }
    };

    fetchUserId();
  }, [user]);


  //console.log("User ID:", userId);
  console.log("Liked products:", likedProducts);

  useEffect(() => { //updates the cart in the database
    const updateCart = async () => {
      if (userId) {
        try {
          //first we fetch the current cart, then we append the liked products to it
          const { data, error } = await supabase
            .from('user_preferences')
            .select('cart')
            .eq('id', userId)
            .single();

          if (error) {
            console.error("Error fetching current cart:", error);
            return;
          }

          const currentCart = data.cart || [];
          const newCart = [...new Set([...currentCart, ...likedProducts])]; //remove duplicates from the cart when we append

          const { error: updateError } = await supabase
            .from('user_preferences')
            .update({ cart: newCart }) //update the cart with the new items
            .eq('id', userId);

          if (updateError) {
            console.error("Error updating cart:", updateError);
          }
        } catch (error) {
          console.error("Error updating cart:", error);
        }
      }
    };

    updateCart();
  }, [likedProducts, userId]);

  const setLiked = (id) => {
    setLikedProducts((prevLikedProducts) => {
      if (prevLikedProducts.includes(id)) {
        //if the product is already liked, remove it
        const updatedLikedProducts = prevLikedProducts.filter(productId => productId !== id);
        updateCartInDB(updatedLikedProducts); // Update the cart in the database
        return updatedLikedProducts;
      } else {
        //add to liked products
        const updatedLikedProducts = [...prevLikedProducts, id];
        updateCartInDB(updatedLikedProducts); // Update the cart in the database
        return updatedLikedProducts;
      }
    });
  };



  
  useEffect(() => {//fetches the products from the backend
    const fetchProducts = async () => {
      if (userId) {
        try {
          //supabase stuff dont touch
          const { data, error } = await supabase
            .from('user_preferences')
            .select('preferences,cart')
            .eq('id', userId)
            .single();

          if (error) {
            console.error("Error fetching user preferences:", error);
            return;
          }

          const preferencesArray = data.preferences; //get the preferences from the db
          const cart = data.cart || []; //get the cart from the db
          setLikedProducts(cart); //set the liked products to the cart
          //console.log("User preferences:", preferencesArray);
          const queryParams = new URLSearchParams();
          preferencesArray.forEach(preference => {
            Object.keys(preference).forEach(key => {
              if (preference[key]) {
                queryParams.append(key, preference[key]);
              }
            });
          });

          //backend fetch for the products but uncapped
          const response = await fetch(`http://127.0.0.1:5000/api/recommended_uncapped?${queryParams.toString()}`);
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          const productData = await response.json();
          setProduct(productData);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };

    fetchProducts();
  }, [userId]);

  const updateCartInDB = async (updatedCart) => {
    if (userId) {
      try {
        const { error } = await supabase
          .from('user_preferences')
          .update({ cart: updatedCart })
          .eq('id', userId);

        if (error) {
          console.error("Error updating cart in DB:", error);
        }
      } catch (error) {
        console.error("Error updating cart in DB:", error);
      }
    }
  };



  return ( //info displayed on the product component
    <>
    {/*
    <div>
      <h3>Debugging</h3>
          <pre>{JSON.stringify(likedProducts, null, 2)}</pre>
    </div>
    */}
    
    <div className="min-h-75 w-screen bg-green">
        <div className="text-center py-20 px-10 text-8xl">
          <h1 className="fade-in">Curated for your look</h1>
          <h1 className="text-5xl p-2 text-dark_green py-10 fade-in">
            Express your inner beauty
          </h1>
        </div>
      </div>
      <div className='w-screen flex flex-wrap justify-center gap-5 p-5'>
        {products ? (
          products.map((productItem) => (
            <div key={productItem.id} className="w-1/4">
              <button onClick={() => setLiked(productItem.id)}>
              <Heart fill={likedProducts.includes(productItem.id) ? 'red' : 'white'} />
              </button>
              <ProductCard product={productItem} /> {/* Pass the individual product */}
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default Products;