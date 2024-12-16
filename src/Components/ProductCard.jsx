import React, { useEffect, useState } from 'react';

const ProductCard = ({ productId }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/specific/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    product ? (
      <button className="w-1/5 rounded-lg hover:shadow-2xl hover:bg-gray-200 ">
        <img className ='px-14 py-5 m-1' src={`https:${product.api_featured_image}`} alt={product.name} />
        <div className='px-10'>
          <h1>{product.brand}</h1>
          <h1>{product.name}</h1>
          <h1>${product.price}</h1>
        
          <div className="flex flex-wrap m-2">
            {product.product_colors.map((color, index) => (
              <div
                key={index}
                className="w-5 h-5 m-1 rounded-full"
                style={{ backgroundColor: color.hex_value }}
                title={color.colour_name}
              />
            ))}
          </div>
        </div>
      </button>
    ) : (
      <p>Loading...</p>
    )
  );
};

export default ProductCard;
