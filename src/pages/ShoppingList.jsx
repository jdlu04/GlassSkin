import React, { useEffect, useState } from 'react';
import supabase from "../Components/Supabase/supabaseClient"; // Supabase client
import { useUser } from "@clerk/clerk-react"; // Clerk user hook

const ShoppingList = () => {
  const [cart,setCart] = useState([]); //cart items
  const { user } = useUser(); //get user from clerk
  const [cartDetails, setCartDetails] = useState([]); //cart details, see 
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        console.log("User ID:", user.id);
        
        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('cart')
            .eq('id', user.id)
            .single();
          console.log("Data:", data.cart); //debug for db data --jawad
          if (error) {
            console.error("Error fetching cart:", error);
          } else {
            setCart(data.cart || []);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    };

    fetchCart();
  }, [user]);


  useEffect(() => {
    const fetchCartDetails = async () => {
      const details = await Promise.all(
        cart.map(async (itemId) => {
          try {
            const response = await fetch(`http://127.0.0.1:5000/api/specific/${itemId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch item details');
            }
            const data = await response.json();
            return data;
          } catch (error) {
            console.error("Error fetching item details:", error);
            return null;
          }
        })
      );
      setCartDetails(details.filter(item => item !== null));
    };

    if (cart.length > 0) {
      fetchCartDetails();
    }
  }, [cart]);
  const totalPrice = cartDetails.reduce((total, item) => total + parseFloat(item.price), 0);
  return (
    <div>
      <h1>Shopping List</h1>
      {cartDetails.length > 0 ? (
        <>
          <ul style={{ display: 'flex', flexWrap: 'wrap', listStyleType: 'none', padding: 0 }}>
            {cartDetails.map((item, index) => (
              <li key={index} style={{ flex: '1 0 21%', margin: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                <h2>{item.name}</h2>
                <a href={item.product_link} target="_blank" rel="noopener noreferrer">
                  <img src={`https:${item.api_featured_image}`} alt={item.name} style={{ width: '100px', height: '100px' }} />
                </a>
                <p>{item.description}</p>
                <p>Price: {item.price}</p>
                <p>Rating: {item.rating}</p>
                <p>Brand: {item.brand}</p>
                <p>Tags: {item.tag_list}</p>
              </li>
            ))}
          </ul>
          <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
        </>
      ) : (
        <p>No items in cart.</p>
      )}
    </div>
  );
};

export default ShoppingList;