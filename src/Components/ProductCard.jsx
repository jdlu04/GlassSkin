import React, { useEffect, useState } from 'react';


const ProductCard = ({product}) => {
  /*
  const [product, setProduct] = useState(null);

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
          setProduct(productData[0]);
          console.log(productData)
        } else {
          console.log('error')
        }
        
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchProduct();
  }, []);
*/
  return (
    product ? (
      <button className='w-1/4 rounded-lg hover:shadow-2xl hover:bg-gray-200 '>
        <img className='p-5' src={`https:${product.api_featured_image}`} alt={product.name} />
        <div>
          <h1>{product.brand}</h1>
          <h1>{product.name}</h1>
          <h1>${product.price}</h1>
          <div className='flex flex-wrap m-2'>
            {product.product_colors.map((color, index) => (
              <div
                key={index}
                className='w-5 h-5 m-1 rounded-full'
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