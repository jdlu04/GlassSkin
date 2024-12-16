import React from 'react'
import ProductCard from "../Components/ProductCard";
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const Products = () => {
  const productIds = Array.from({ length: 10 }, (_, index) => index + 1);
  const [product, setProduct] = useState(null);
  const [likedProducts, setLikedProducts] = useState([]);
  const [heart, setHeart] = useState(false);
  const [request] = useState({
    brand: 'glossier'
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const params = new URLSearchParams(request);
        
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/recommended_uncapped?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const productData = await response.json();
        
        if (productData) {
          setProduct(productData);
          console.log(productData)
        } else {
          console.log('error')
        }
        
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchProduct();
  }, [request]);

  const setLiked = (id) => {
    setLikedProducts((prevLikedProducts) => [...prevLikedProducts, id]);
  }

  return (
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
    <div className='w-screen flex-wrap'>
      {product ? (
        product.map((productItem) => (
          <div key={productItem.id}>
            <button onClick={() => setLiked(productItem.id)}>
              <Heart fill={heart ? 'red' : 'white'} />
            </button>
            <ProductCard request={request} product={productItem} /> {/* Pass the individual product */}
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