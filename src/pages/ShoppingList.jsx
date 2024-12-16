import React, { useEffect, useState } from 'react';
import supabase from "../Components/Supabase/supabaseClient"; // Supabase client
import { useUser } from "@clerk/clerk-react"; // Clerk user hook

const ShoppingList = () => {
  const [cart,setCart] = useState([]);
  const { user } = useUser(); // Get the current user

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

  return (
    <div>
      <h1>Shopping List</h1>
      {cart.length > 0 ? (
        <ul>
          {cart.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No items in cart.</p>
      )}
    </div>
  );
};

export default ShoppingList;